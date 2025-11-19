import React, { useState, useEffect, useContext } from "react";
import { Send, User, Search } from "lucide-react";
import axios from "axios";
import { GlobalContext } from "../Context/GlobalContext";

const AdminChat = () => {
  const { chatConnection } = useContext(GlobalContext);

  const [userId, setUserId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const storedId = localStorage.getItem("userid");
    if (storedId) {
      console.log("🟢 Admin ID loaded:", storedId);
      setUserId(storedId);
    } else {
      console.warn("⚠️ No admin ID found in localStorage");
    }
  }, []);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://localhost:7044/api/Chat/users");
        const data = res.data || [];
        console.log("🟢 Users fetched:", data);
        setCustomers(
          data.map((u) => ({
            id: String(u),
            name: `User ${u}`,
            unread: 0,
            lastMessage: "",
          }))
        );
      } catch (err) {
        console.error("❌ Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);


  useEffect(() => {
    if (!chatConnection) {
      console.warn("⚠️ chatConnection not ready");
      return;
    }

    const handleReceiveMessage = (senderId, message) => {
      console.log("📨 Message received:", senderId, message);

      const newMsg = {
        senderId,
        receiverId: userId,
        sender: senderId === userId ? "admin" : "user",
        text: message,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, newMsg]);

      setCustomers((prev) =>
        prev.map((u) => {
          if (u.id === String(senderId)) {
            if (selectedUser?.id !== String(senderId)) {
              return {
                ...u,
                unread: (u.unread || 0) + 1,
                lastMessage: message,
              };
            } else {
              return { ...u, lastMessage: message };
            }
          }
          return u;
        })
      );
    };

    chatConnection.on("ReceiveMessage", handleReceiveMessage);
    return () => {
      chatConnection.off("ReceiveMessage", handleReceiveMessage);
    };
  }, [chatConnection, userId, selectedUser]);


  const handleSelectUser = async (userItem) => {
    try {
      if (!userItem || !userItem.id) {
        console.warn("⚠️ Invalid user selected:", userItem);
        return;
      }

      setSelectedUser(userItem);
      setUserMessages([]);

  
      setCustomers((prev) =>
        prev.map((u) =>
          u.id === userItem.id ? { ...u, unread: 0 } : u
        )
      );

      const res = await axios.get(
        `https://localhost:7044/api/Chat/history/${userItem.id}`
      );
      const history = Array.isArray(res.data) ? res.data : [];

      console.log("📜 Chat history fetched:", history);

      const formatted = history.map((msg) => ({
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        sender:
          String(msg.senderId) === String(userId) ? "admin" : "user",
        text: msg.message || "",
        timestamp: msg.createdAt
          ? new Date(msg.createdAt).toLocaleTimeString()
          : new Date().toLocaleTimeString(),
      }));

      setMessages((prev) => [
        ...prev.filter(
          (m) =>
            m.senderId !== userItem.id &&
            m.receiverId !== userItem.id
        ),
        ...formatted,
      ]);
    } catch (err) {
      console.error("❌ Error fetching chat history:", err);
    }
  };


  useEffect(() => {
    if (selectedUser) {
      setUserMessages(
        messages.filter(
          (m) =>
            m.senderId === selectedUser.id ||
            m.receiverId === selectedUser.id
        )
      );
    }
  }, [messages, selectedUser]);

 
  const handleSendMessage = () => {
    if (!chatConnection || !selectedUser || !inputMessage.trim() || !userId) {
      console.warn("⚠️ Missing connection / selectedUser / message / userId");
      return;
    }

    chatConnection
      .invoke("SendMessage", userId, selectedUser.id, inputMessage)
      .then(() => {
        const newMsg = {
          senderId: userId,
          receiverId: selectedUser.id,
          sender: "admin",
          text: inputMessage,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, newMsg]);
        setInputMessage("");
      })
      .catch((err) => console.error("❌ Send failed:", err));
  };

  const filteredUsers = customers.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-80 bg-green-50 border-r border-green-200 flex flex-col">
        <div className="p-4 bg-green-600 text-white">
          <h2 className="text-xl font-bold">Admin Chat</h2>
          <p className="text-sm text-green-100">Manage conversations</p>
        </div>

        <div className="p-3 bg-white border-b border-green-200">
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-green-600"
              size={18}
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              onClick={() => handleSelectUser(u)}
              className={`p-4 border-b border-green-100 cursor-pointer transition-colors ${
                selectedUser?.id === u.id
                  ? "bg-green-200"
                  : "hover:bg-green-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {u.name}
                    </h3>
                    {u.unread > 0 && (
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                        {u.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {u.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {userMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-3 flex ${
                    msg.sender === "admin"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md ${
                      msg.sender === "admin"
                        ? "bg-green-600 text-white"
                        : "bg-white border border-green-200"
                    } px-4 py-2 rounded-lg`}
                  >
                    <p>{msg.text}</p>
                    <p
                      className={`text-xs mt-1 text-right ${
                        msg.sender === "admin"
                          ? "text-green-100"
                          : "text-gray-400"
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-green-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Send size={18} />
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <User
                size={64}
                className="mx-auto text-green-600 mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Select a User
              </h3>
              <p className="text-gray-500">
                Choose a user to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
