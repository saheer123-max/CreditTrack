import React from 'react';
import { Bell, ShoppingCart } from 'lucide-react';

export default function Header() {
  return (
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
  );
}
