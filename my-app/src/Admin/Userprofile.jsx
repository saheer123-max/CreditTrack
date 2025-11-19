import React, { useEffect, useState } from 'react';
import { Phone, MessageCircle, Share2, ChevronRight, Users, DollarSign, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function Userprofile() {
  const { username, id } = useParams();
  const navigate = useNavigate();

  const [showInput, setShowInput] = useState(false);
  const [transactionType, setTransactionType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]); // ✅ initially empty
  const [balance, setBalance] = useState(0);

  const api = axios.create({
    baseURL: 'https://localhost:7044/api/CreditTransaction',
  });


  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.get(`/balance/${id}`);
        setBalance(res.data?.data ?? 0);
      } catch (err) {
        console.error('❌ Error fetching balance:', err);
      }
    };
    fetchBalance();
  }, [id]);


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get(`/user/${id}`);
        console.log('✅ Transactions fetched:', res.data);

    
        setTransactions(res.data?.data ?? []);
      } catch (err) {
        console.error('❌ Error fetching transactions:', err);
      }
    };
    fetchTransactions();
  }, [id]);


  const handleClick = (type) => {
    setTransactionType(type);
    setShowInput(true);
  };


  const handleSubmit = async () => {
    if (!amount || !description) return;

    try {
      const response =await api.post(
        transactionType==='given' ? '/gave':'/receive',{
         userId: Number(id),
    amount: Number(amount),
    description,
        } 
      )
      

      console.log('✅ Transaction saved:', response.data);


      const [balanceRes, transactionsRes] = await Promise.all([
        api.get(`/balance/${id}`),
        api.get(`/user/${id}`),
      ]);

      setBalance(balanceRes.data?.data ?? 0);
      setTransactions(transactionsRes.data?.data ?? []);

      setAmount('');
      setDescription('');
      setShowInput(false);
    } catch (error) {
      console.error('❌ Error submitting transaction:', error);
      alert('Error submitting transaction');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button className="text-gray-600" onClick={() => navigate(-1)}>
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <div className="flex-1 ml-4">
            <h1 className="font-bold text-lg">{username}</h1>
            <p className="text-2xl text-teal-600">{id} Profile</p>
          </div>
          <div className="flex gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Users className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="p-4">
        <div className="inline-block bg-teal-500 text-white px-6 py-2 rounded-full text-sm font-medium mb-4">
          Today
        </div>

        {/* Dynamic Transactions */}
        <div className="space-y-3 mb-6">
          {transactions.length > 0 ? (
            transactions.map((tx, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 ${
                        tx.type === 'Gave' ? 'bg-red-100' : 'bg-green-100'
                      } rounded-full flex items-center justify-center`}
                    >
                      <span
                        className={`${
                          tx.type === 'Gave' ? 'text-red-600' : 'text-green-600'
                        } font-bold`}
                      >
                        {tx.type === 'Gave' ? '↑' : '↓'}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-800">₹{tx.amount}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(tx.transactionDate).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    ✓
                  </span>
                </div>
                <p
                  className={`${
                    tx.type === 'Gave' ? 'text-red-600' : 'text-green-600'
                  } text-sm ml-4`}
                >
                  {tx.description}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No transactions found.</p>
          )}
        </div>

        {/* Share Button */}
        <button className="w-full bg-white border border-gray-300 rounded-full py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition">
          <Share2 className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">Share</span>
        </button>
      </div>

      {/* Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        {/* Balance */}
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <span className="text-gray-700 font-medium">Balance Due</span>
          <span className="text-red-600 font-bold text-lg">₹{balance}</span>
        </div>

        {/* Buttons */}
        <div className="flex justify-around gap-8 mt-4 pt-4 border-t border-gray-200">
          <div
            onClick={() => handleClick('received')}
            className="flex items-center justify-center gap-2 bg-yellow-50 rounded-3xl p-2 w-[130px]"
          >
            <span className="text-green-600 font-bold text-m">↓ RECEIVED</span>
          </div>
          <div
            onClick={() => handleClick('given')}
            className="flex items-center gap-2 bg-yellow-50 rounded-3xl p-2 w-[130px] justify-center"
          >
            <span className="text-red-600 font-bold text-m">↑ GIVEN</span>
          </div>
        </div>

        {/* Input Form */}
        {showInput && (
          <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 animate-fadeIn border-t-4 border-green-500 mt-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {transactionType === 'given' ? 'New Given' : 'New Received'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 text-green-400" size={20} />
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-green-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">Description</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3.5 text-green-400" size={20} />
                  <input
                    type="text"
                    placeholder="What did you spend on?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-green-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    setShowInput(false);
                    setAmount('');
                    setDescription('');
                  }}
                  className="flex-1 bg-gray-100 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!amount || !description}
                  className="flex-1 bg-green-600 text-white py-2 rounded disabled:bg-gray-300"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
