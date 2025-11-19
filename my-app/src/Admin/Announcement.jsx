import React, { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../Context/GlobalContext";
import { Send, MessageSquare, Clock } from "lucide-react";

const Announcement = () => {
  const { announcementConnection, announcements } = useContext(GlobalContext);
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState([]);


  useEffect(() => {
    if (announcements && announcements.length > 0) {
      const formatted = announcements.map((a) => ({
        id: a.id || Date.now() + Math.random(),
        text: a.message || a.text,
        timestamp: new Date(a.createdAt).toLocaleString(),
      }));
      setSentMessages(formatted);
    }
  }, [announcements]);

  const handleSend = async () => {
    if (!message.trim()) return alert("Enter announcement message");

    if (
      announcementConnection &&
      announcementConnection.state === "Connected"
    ) {
      try {
        await announcementConnection.invoke("SendAnnouncement", message);

        // Add locally
        const newMessage = {
          id: Date.now(),
          text: message,
          timestamp: new Date().toLocaleString(),
        };
        setSentMessages([newMessage, ...sentMessages]);

        setMessage("");
        alert(" Announcement sent to all users!");
      } catch (err) {
        console.error("Send error:", err);
        alert(" Error sending announcement");
      }
    } else {
      alert("⚠️ Not connected to Announcement Hub");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-6">
      <div className="flex gap-6 w-full max-w-5xl">
        {/* Main Panel */}
        <div className="bg-white shadow-2xl rounded-3xl w-full max-w-lg p-8 border-t-4 border-green-500">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Send size={28} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-700">
              Admin Announcement Panel
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Broadcast messages to all connected users
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                className="w-full border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl p-4 text-gray-700 transition-all outline-none resize-none"
                rows={5}
                placeholder="Type your announcement message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <button
              onClick={handleSend}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <Send size={20} />
              Send Announcement
            </button>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-xs text-green-700 text-center">
              {announcementConnection &&
              announcementConnection.state === "Connected" ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Connected to server
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Not connected
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Sent Messages History */}
        <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-8 border-t-4 border-blue-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
              <MessageSquare size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-700">
                Sent Messages
              </h3>
              <p className="text-gray-500 text-xs">
                {sentMessages.length} announcement
                {sentMessages.length !== 1 ? "s" : ""} total
              </p>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sentMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare
                  size={48}
                  className="text-gray-300 mx-auto mb-3"
                />
                <p className="text-gray-400 text-sm">No announcements yet</p>
              </div>
            ) : (
              sentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 hover:shadow-md transition-shadow"
                >
                  <p className="text-gray-700 text-sm mb-2 leading-relaxed">
                    {msg.text}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
