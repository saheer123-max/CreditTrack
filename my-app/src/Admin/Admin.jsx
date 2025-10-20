import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Creatuser from './Creatuser'; // ✅ FIX: Import your CreateUser component

import { 
  BarChart3, Users, TrendingUp, DollarSign, Calendar, 
  Search, Filter, Download, Plus, Settings, Bell, 
  ChevronDown 
} from 'lucide-react';

export default function Admin() {
  const [timeFilter, setTimeFilter] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Sample static stats
  const stats = {
    totalCustomers: 1247,
    totalSuppliers: 453,
    totalReceivable: 1250000,
    totalPayable: 850000,
    netBalance: 400000,
    todayTransactions: 45
  };

  const topDebtors = [
    { name: 'Rahul Kumar', amount: 45000, days: 45 },
    { name: 'Amit Singh', amount: 38000, days: 30 },
    { name: 'Priya Sharma', amount: 32000, days: 22 }
  ];

  const topCreditors = [
    { name: 'ABC Suppliers', amount: 55000, days: 38 },
    { name: 'XYZ Traders', amount: 42000, days: 25 },
    { name: 'PQR Industries', amount: 35000, days: 18 }
  ];

  const handleClick = () => {
    navigate("/Creatuser");
  };

  const handleClickS = () => {
    setShowCreateUser(true);
  };

  // ✅ Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://localhost:7044/api/User/usernames");
        if (response.data.success) {
          setUsers(response.data.data);
          console.log(response.data.data)
        } else {
          setError("Failed to fetch users");
        }
      } catch (err) {
        setError("Error fetching users: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Ledger Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <span className="text-sm font-medium">Admin</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-gray-500">+12% this month</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</h3>
            <p className="text-sm text-gray-600">Total Customers</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">+8% this month</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalSuppliers}</h3>
            <p className="text-sm text-gray-600">Total Suppliers</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs text-green-600">↑ Receivable</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">₹{(stats.totalReceivable / 1000).toFixed(0)}K</h3>
            <p className="text-sm text-gray-600">Total Receivable</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-xs text-red-600">↓ Payable</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">₹{(stats.totalPayable / 1000).toFixed(0)}K</h3>
            <p className="text-sm text-gray-600">Total Payable</p>
          </div>
        </div>

        {/* Recent Accounts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Accounts</h3>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {loading && <p className="text-gray-500">Loading users...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading && !error && users.length === 0 && (
                <p className="text-gray-500">No users found.</p>
              )}
              {users.map((user, index) => (
  <div
    onClick={()=>navigate(`/Userprofile/${user.id}/${user.username}`)}
    key={index}
    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-100"
  >
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
        {user.username}  {/* First letter of username */}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{user.username}</h4>
        <span className="text-xs text-gray-500">Registered User</span>
      </div>
    </div>
  </div>
))}
            </div>
          </div>

          {/* Top Lists */}
          <div className="space-y-6">
            {/* Top Debtors */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Debtors</h3>
              {topDebtors.map((debtor, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{debtor.name}</p>
                    <p className="text-xs text-gray-500">{debtor.days} days overdue</p>
                  </div>
                  <p className="font-bold text-orange-600">₹{(debtor.amount / 1000).toFixed(1)}K</p>
                </div>
              ))}
            </div>

            {/* Top Creditors */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Creditors</h3>
              {topCreditors.map((creditor, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{creditor.name}</p>
                    <p className="text-xs text-gray-500">{creditor.days} days pending</p>
                  </div>
                  <p className="font-bold text-red-600">₹{(creditor.amount / 1000).toFixed(1)}K</p>
                </div>
              ))}
            </div>
          </div>
        </div>

               <div className="fixed bottom-22 ">
          <button
             onClick={()=>navigate('/Products')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full shadow-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Products</span>
          </button>
        </div>





        {/* Add User Floating Button */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={handleClick}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full shadow-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add User</span>
          </button>
        </div>

        {/* Create User Popup */}
        {showCreateUser && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowCreateUser(false)}
              >
                ✕
              </button>
              <Creatuser />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
