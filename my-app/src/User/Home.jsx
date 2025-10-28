import React, { useEffect, useState } from 'react';
import { MessageCircle, Package, CreditCard, Bell, Send, X, ChevronRight, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import Chat from './Chat';
import Transaction from './Transaction';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [activeTab, setActiveTab] = useState('products');
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
 

const [product,setProducts]=useState([]);

const navigate = useNavigate();

useEffect(() => {
  axios.get("https://localhost:7044/api/Product/catogory")
    .then((res) => {
      setProducts(res.data.data); // <-- here, data array set ചെയ്യണം
      console.log(res.data.data);
    })
    .catch((err) => console.error(err));
}, []);


const groupedProducts = (product || []) // product null ആണെങ്കിൽ empty array ഉപയോഗിക്കുന്നു
  .filter(p => !p.isDeleted)           // deleted products remove ചെയ്യുന്നു
  .reduce((acc, product) => {
    const categoryName = product.category?.name || "Uncategorized"; // safety fallback
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(product);
    return acc;
  }, {});






  // const productCategories = {
  //   'Beverages': [
  //     { id: 1, name: 'Organic Green Tea', price: '$24.99', image: '🍵', status: 'In Stock' },
  //     { id: 4, name: 'Premium Coffee Beans', price: '$32.00', image: '☕', status: 'In Stock' },
  //     { id: 5, name: 'Herbal Infusion Tea', price: '$19.99', image: '🫖', status: 'In Stock' }
  //   ],
  //   'Natural Sweeteners': [
  //     { id: 2, name: 'Natural Honey', price: '$18.50', image: '🍯', status: 'In Stock' },
  //     { id: 6, name: 'Maple Syrup', price: '$26.99', image: '🍁', status: 'Low Stock' }
  //   ],
  //   'Fresh Herbs & Spices': [
  //     { id: 3, name: 'Fresh Herbs Bundle', price: '$12.99', image: '🌿', status: 'Low Stock' },
  //     { id: 7, name: 'Organic Basil', price: '$8.99', image: '🌱', status: 'In Stock' },
  //     { id: 8, name: 'Spice Mix Collection', price: '$22.50', image: '🧂', status: 'In Stock' }
  //   ]
  // };

  

  // const announcements = [
  //   { id: 1, title: 'New Products Added!', desc: 'Check out our latest organic collection', date: 'Oct 22' },
  //   { id: 2, title: 'Flash Sale This Weekend', desc: '20% off on all herbal products', date: 'Oct 21' },
  //   { id: 3, title: 'Shipping Update', desc: 'Free shipping on orders above $50', date: 'Oct 20' }
  // ];

  const sendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, {
        id: chatMessages.length + 1,
        sender: 'user',
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setMessage('');
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: 'support',
          text: 'Thank you for your message. A support agent will respond shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b-2 border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-700">GreenMarket</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-green-50 rounded-lg transition-colors">
              <Bell className="w-6 h-6 text-green-600" />
            </button>
            <button className="p-2 hover:bg-green-50 rounded-lg transition-colors">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6 p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'products'
                ? 'bg-green-600 text-white'
                : 'text-green-700 hover:bg-green-50'
            }`}
          >
            <Package className="w-5 h-5" />
            Products
          </button>
          
       <button
  onClick={() => navigate("/transactions")}
  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all text-green-700 hover:bg-green-50"
>
  <CreditCard className="w-5 h-5" />
  Transactions
</button>


       <button
  onClick={() => navigate("/UserAnnounce")}
  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all text-green-700 hover:bg-green-50"
>
  <Bell className="w-5 h-5" />
  Announcements
</button>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 gap-6">
          {/* Products Section */}
          {activeTab === 'products' && (
            <div className="space-y-8">
 {Object.keys(groupedProducts || {}).map((categoryName) => (
  <div key={categoryName} className="bg-white rounded-xl shadow-md p-6">
    <h2 className="text-2xl font-bold text-green-700 mb-6 border-b-2 border-green-200 pb-3">
      {categoryName}
    </h2>
    <div className="overflow-x-auto">
      <div className="flex gap-4 pb-2">
        {(groupedProducts[categoryName] || []).map(product => (
          <div key={product.id} className="flex-shrink-0 w-48 border-2 border-green-100 rounded-lg p-4 hover:border-green-300 transition-all hover:shadow-lg">
            <div className="text-5xl mb-3 text-center">
              <img
                src={product.imageUrl || "https://via.placeholder.com/150"}
                alt={product.name}
                className="w-full h-32 object-cover rounded-md mb-3"
              />
            </div>
            <h3 className="font-semibold text-green-800 mb-2 text-sm">{product.name}</h3>
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-green-600">${product.price}</span>
            </div>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
))}

            </div>
          )}

          {/* Transactions Section */}
          {/* {activeTab === 'transactions' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-green-700 mb-6">Transaction History</h2>
              <div className="space-y-3">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="border-2 border-green-100 rounded-lg p-4 hover:border-green-300 transition-all flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-800">{transaction.item}</h3>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 text-lg">{transaction.amount}</p>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        transaction.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* Announcements Section */}
          {activeTab === 'announcements' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-green-700 mb-6">Announcements</h2>
              <div className="space-y-3">
                {announcements.map(announcement => (
                  <div key={announcement.id}
                  
                  onClick={() => navigate("/announcement")}
                  className="border-2 border-green-100 rounded-lg p-4 hover:border-green-300 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-800 mb-1">{announcement.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{announcement.desc}</p>
                        <span className="text-xs text-gray-500">{announcement.date}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

{/* Chat Button */}
<button
  onClick={() => setChatOpen(!chatOpen)}
  className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-110"
>
  {chatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
</button>

{/* Chat Window */}
<Chat chatOpen={chatOpen} setChatOpen={setChatOpen} />

    </div>
  );
}