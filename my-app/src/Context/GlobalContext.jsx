import React, { createContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import axios from "axios";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 🔐 ലോഗിൻ ചെയ്ത user
  const [chatConnection, setChatConnection] = useState(null); // 💬 Chat hub
  const [announcementConnection, setAnnouncementConnection] = useState(null); // 📢 Announcement hub
  const [announcements, setAnnouncements] = useState([]); // 📜 Announcement list

  // ======================= 📢 ANNOUNCEMENT HUB =======================
  useEffect(() => {
    const connectAnnouncementHub = async () => {
      try {
        const connection = new signalR.HubConnectionBuilder()
          .withUrl("https://localhost:7044/announcementHub")
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Information)
          .build();

        connection.on("ReceiveAnnouncement", (message) => {
          console.log("📢 New Announcement:", message);
          setAnnouncements((prev) => [
            { message, createdAt: new Date().toISOString() },
            ...prev,
          ]);
        });

        await connection.start();
        console.log("✅ Connected to AnnouncementHub");
        setAnnouncementConnection(connection);
      } catch (err) {
        console.error("❌ AnnouncementHub Error:", err);
        // 🔁 Retry after 5s
        setTimeout(connectAnnouncementHub, 5000);
      }
    };

    connectAnnouncementHub();

    return () => {
      if (announcementConnection) {
        console.log("🔴 Disconnected from AnnouncementHub");
        announcementConnection.stop();
      }
    };
  }, []);

  // 🗂️ പഴയ announcements DB-ൽ നിന്ന് എടുത്ത് കാണിക്കുക
  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("https://localhost:7044/api/announcement");
      setAnnouncements(res.data);
    } catch (err) {
      console.error("❌ Fetch Announcements Error:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // ======================= 💬 CHAT HUB =======================
  useEffect(() => {
    if (!user) return; // user ഇല്ലെങ്കിൽ connect വേണ്ട
    if (chatConnection?.state === signalR.HubConnectionState.Connected) return; // duplicate avoid

    const connectChatHub = async () => {
      try {
        const role = user.role?.toLowerCase();
        const userId = user.id;

        const connection = new signalR.HubConnectionBuilder()
          .withUrl(`https://localhost:7044/chathub?role=${role}&userId=${userId}`)
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Information)
          .build();

        connection.onreconnecting(() => {
          console.warn("⚠️ ChatHub reconnecting...");
        });

        connection.onreconnected(() => {
          console.log("✅ ChatHub reconnected successfully!");
        });

        connection.onclose(() => {
          console.warn("🔴 ChatHub disconnected. Retrying...");
          setTimeout(connectChatHub, 5000);
        });

        await connection.start();
        console.log(`✅ ChatHub Connected (${role})`);
        setChatConnection(connection);
      } catch (err) {
        console.error("❌ ChatHub Connection Error:", err);
        setTimeout(connectChatHub, 5000); // 🔁 Retry after 5s
      }
    };

    connectChatHub();

    return () => {
      if (chatConnection) {
        console.log("🔴 Disconnecting ChatHub...");
        chatConnection.stop();
      }
    };
  }, [user]);

  // ======================= 🌍 CONTEXT PROVIDER =======================
  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        chatConnection,
        announcementConnection,
        announcements,
        fetchAnnouncements,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
