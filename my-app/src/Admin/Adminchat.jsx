import React, { useState, useEffect } from 'react';
import { Send, User, Search } from 'lucide-react';
import * as signalR from "@microsoft/signalr";

const AdminChat = () => {
  const [connection, setConnection] = useState(null);
  const [customers, setCustomers] = useState([]); // connected users
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize SignalR connection
  useEffect(() => {
    const token = localStorage.getItem("token");

    const connect = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7044/chathub?role=admin&userId=1`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    connect.start()
      .then(() => console.log("Admin connected"))
      .catch(err => console.error("Connection failed: ", err));

    // New customer joined
    connect.on("NewCustomerJoined", (userId) => {
      setCustomers(prev => {
        if (!prev.some(u => u.id === userId)) {
          return [...prev, { id: userId, name: userId, online: true, unread: 0, lastMessage: '' }];
        }
        return prev;
      });
    });

    // Receive message from user
    connect.on("ReceiveMessage", (senderId, message) => {
      console.log("[ReceiveMessage]", senderId, message);

      setMessages(prev => [
        ...prev,
        {
          senderId,
          receiverId: "admin",
          sender: senderId === "admin" ? "admin" : "user",
          text: message,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);

      // Update unread count and lastMessage
      setCustomers(prev => prev.map(u => {
        if (u.id === senderId) {
          if (selectedUser?.id !== senderId) {
            return { ...u, unread: (u.unread || 0) + 1, lastMessage: message };
          } else {
            return { ...u, lastMessage: message };
          }
        }
        return u;
      }));
    });

    setConnection(connect);

    return () => {
      connect.stop();
    };
  }, [selectedUser]);

  // Send message function
  const handleSendMessage = () => {
    if (!connection || !selectedUser || inputMessage.trim() === '') return;

    connection.invoke("SendMessage", "admin", selectedUser.id, inputMessage)
      .then(() => {
        console.log("Message sent successfully ✅");
        setMessages(prev => [
          ...prev,
          {
            senderId: "admin",
            receiverId: selectedUser.id,
            sender: "admin",
            text: inputMessage,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
        setInputMessage('');
      })
      .catch(err => console.error("Failed to send message ❌", err));
  };

  // Select user
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setCustomers(prev => prev.map(u => u.id === user.id ? { ...u, unread: 0 } : u));
  };

  // Filter users
  const filteredUsers = customers.filter(
    u => typeof u.name === "string" && u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Messages for selected user
  const userMessages = messages.filter(
    m => (m.senderId === selectedUser?.id || m.receiverId === selectedUser?.id)
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Users List Sidebar */}
      <div className="w-80 bg-green-50 border-r border-green-200 flex flex-col">
        <div className="p-4 bg-green-600 text-white">
          <h2 className="text-xl font-bold">Admin Chat</h2>
          <p className="text-sm text-green-100">Manage user conversations</p>
        </div>

        {/* Search Bar */}
        <div className="p-3 bg-white border-b border-green-200">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-green-600" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className={`p-4 border-b border-green-100 cursor-pointer transition-colors ${selectedUser?.id === user.id ? 'bg-green-200' : 'hover:bg-green-100'}`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  {user.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 truncate">{user.name}</h3>
                    {user.unread > 0 && (
                      <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {user.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{user.lastMessage}</p>
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
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {userMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-4 flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${msg.sender === 'admin' ? 'order-2' : 'order-1'}`}>
                    <div className={`px-4 py-2 rounded-lg ${msg.sender === 'admin' ? 'bg-green-600 text-white' : 'bg-white text-gray-800 border border-green-200'}`}>
                      <p>{msg.text}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-green-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
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
              <User size={64} className="mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a User</h3>
              <p className="text-gray-500">Choose a user from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
