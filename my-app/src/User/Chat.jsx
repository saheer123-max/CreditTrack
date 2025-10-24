import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import * as signalR from "@microsoft/signalr";

export default function Chat({ chatOpen, setChatOpen }) {
  const [userId, setUserId] = useState("user123"); // test userId
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    if (!userId) return; // wait until userId is set

    const connect = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7044/chatHub?role=user&userId=${userId}`)
      .withAutomaticReconnect()
      .build();

    connect.start().then(() => console.log("Connected to SignalR")).catch(console.error);

    connect.on("ReceiveMessage", (senderId, msg) => {
      setMessages((prev) => [...prev, { sender: senderId === userId ? 'user' : 'admin', text: msg, time: new Date().toLocaleTimeString() }]);
    });

    setConnection(connect);

    return () => {
      connect.stop();
    };
  }, [userId]);

const sendMessage = () => {
  if (connection && message.trim() !== "") {
    connection
      .invoke("SendMessage", userId, "admin", message)
      .then(() => {
        console.log("Message sent successfully ✅");
        // message state update
        setMessages((prev) => [
          ...prev,
          { sender: 'user', text: message, time: new Date().toLocaleTimeString() }
        ]);
        setMessage("");
      })
      .catch((err) => {
        console.error("Message failed ❌", err);
      });
  }
};


  return (
    <>
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-2xl border-2 border-green-200 overflow-hidden">
          <div className="bg-green-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">Customer Support</h3>
            </div>
            <button onClick={() => setChatOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-3 bg-green-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-lg p-3 ${
                  msg.sender === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-white border-2 border-green-200 text-gray-800'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t-2 border-green-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 border-2 border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:border-green-400"
              />
              <button
                onClick={sendMessage}
                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
