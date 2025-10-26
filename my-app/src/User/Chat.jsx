import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import * as signalR from "@microsoft/signalr";
import axios from 'axios';

export default function Chat({ chatOpen, setChatOpen }) {
  const [userId, setUserId] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [connection, setConnection] = useState(null);
  const messagesEndRef = useRef(null);
  const userIdRef = useRef(null);
  const token = localStorage.getItem("token");

  // 1️⃣ Get userId from localStorage
  useEffect(() => {
    const id = localStorage.getItem("userid");
    if (id) {
      userIdRef.current = id;
      setUserId(id);
    }
  }, []);

  // 2️⃣ Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3️⃣ Fetch user history when chat opens
  useEffect(() => {
    if (!chatOpen || !userId) return;

    const fetchHistory = async () => {
      try {
        const response = await axios.get(`https://localhost:7044/api/Chat/history/${userId}`);
        const history = response.data || [];

        const formatted = history.map(h => ({
          sender: h.senderId === userId ? 'user' : 'admin',
          text: h.message,
          time: new Date(h.createdAt).toLocaleTimeString()
        }));

        setMessages(formatted);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();
  }, [chatOpen, userId]);

  // 4️⃣ Setup SignalR connection for real-time messages
  useEffect(() => {
    if (!userId) return;

    const connect = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7044/chatHub?role=user&userId=${userId}`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    connect.start()
      .then(() => console.log("Connected to SignalR"))
      .catch(console.error);

    // Receive new messages
    connect.on("ReceiveMessage", (senderId, msg) => {
      setMessages(prev => [
        ...prev,
        { sender: senderId === userId ? 'user' : 'admin', text: msg, time: new Date().toLocaleTimeString() }
      ]);
    });

    setConnection(connect);

    return () => connect.stop();
  }, [userId]);

  // 5️⃣ Send message
  const sendMessage = () => {
    if (!connection || message.trim() === "") return;

    connection.invoke("SendMessage", userId, "admin", message)
      .then(() => {
        setMessages(prev => [
          ...prev,
          { sender: 'user', text: message, time: new Date().toLocaleTimeString() }
        ]);
        setMessage("");
      })
      .catch(err => console.error("Message failed ❌", err));
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
            <div ref={messagesEndRef}></div>
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
