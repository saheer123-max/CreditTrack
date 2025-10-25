import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // userId localStorage-ൽ നിന്ന് set ചെയ്യാം
  useEffect(() => {
    const id = localStorage.getItem("userid"); // key match check
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return; // userId ഇല്ലെങ്കിൽ fetch skip ചെയ്യൂ

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7044/api/CreditTransaction/user/${userId}`
        );
        console.log("API Response:", response.data);

        // data field-ൽ transactions ഉണ്ട്
        setTransactions(response.data.data || []);
      } catch (error) {
        console.error("❌ Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  if (loading) return <p className="text-center text-gray-500 mt-6">Loading...</p>;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-6">
        Transaction History
      </h2>

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
