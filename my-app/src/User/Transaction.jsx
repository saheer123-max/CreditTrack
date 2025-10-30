import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
   const [balance, setBalance] = useState(null);
  // userId localStorage-ൽ നിന്ന് set ചെയ്യാം
  useEffect(() => {
    const id = localStorage.getItem("userid"); // key match check
    setUserId(id);

    
  }, []);

useEffect(() => {
  if (!userId) return; // userId ഇല്ലെങ്കിൽ skip

  const fetchTransactionsAndBalance = async () => {
    try {
      // ✅ 1. Transactions Fetch ചെയ്യുന്നു
      const transactionRes = await axios.get(
        `https://localhost:7044/api/CreditTransaction/user/${userId}`
      );

      console.log("Transactions:", transactionRes.data);
      setTransactions(transactionRes.data.data || []);

      // ✅ 2. Balance Fetch ചെയ്യുന്നു
      const balanceRes = await axios.get(
        `https://localhost:7044/api/CreditTransaction/balance/${userId}`
      );

      console.log("Balance:", balanceRes.data);
      setBalance(balanceRes.data.data); // assuming API returns { data: 1200 }
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchTransactionsAndBalance();
}, [userId]);


  console.log("aslam"+userId);
  

  if (loading) return <p className="text-center text-gray-500 mt-6">Loading...</p>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
  <h2 className="text-2xl font-bold text-green-700 mb-2">Transaction History</h2>

  {balance !== null && (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
      <p className="text-lg font-semibold text-green-800">
        💰 Current Balance: ₹{balance}
      </p>
    </div>
  )}

  {transactions.length === 0 ? (
    <p className="text-center text-gray-500">No transactions found.</p>
  ) : (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="border-2 border-green-100 rounded-lg p-4 hover:border-green-300 transition-all flex items-center justify-between"
        >
          <div className="flex-1">
            <h3 className="font-semibold text-green-800">
              {transaction.description || "Unknown Item"}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(transaction.transactionDate).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right">
            <p className="font-bold text-green-600 text-lg">
              ₹{transaction.amount}
            </p>
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                transaction.type === "Receive"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {transaction.type === "Receive" ? "Paid" : "Debt"}
            </span>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
}
