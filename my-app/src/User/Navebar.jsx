import React from 'react';
import { Package, CreditCard, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ activeTab, setActiveTab }) {
     const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl shadow-md mb-6 p-2 flex gap-2">
    <button
        onClick={() => {
          setActiveTab('products');
          navigate('/UserHome');
        }}
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
        onClick={() => setActiveTab('transactions')}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
          activeTab === 'transactions'
            ? 'bg-green-600 text-white'
            : 'text-green-700 hover:bg-green-50'
        }`}
      >
        <CreditCard className="w-5 h-5" />
        Transactions
      </button>

 <button
  onClick={() => setActiveTab('UserAnnounce')}
  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
    activeTab === 'UserAnnounce'
      ? 'bg-green-600 text-white'
      : 'text-green-700 hover:bg-green-50'
  }`}
>
  <Bell className="w-5 h-5" />
  Announcements
</button>
    </div>
  );
}
