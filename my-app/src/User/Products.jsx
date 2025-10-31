import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("https://localhost:7044/api/Product")
      .then(res => setProducts(res.data || []))
      .catch(err => console.error(err));
  }, []);

  const categoryMap = {
    1: "Beverages",
    2: "Chocolate",
    3: "Drinks",
    4: "Others"
  };

  const grouped = (products || []).reduce((acc, p) => {
    const cat = categoryMap[p.categoryId] || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.keys(grouped).map(category => (
        <div key={category} className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-green-700 mb-6">{category}</h2>
          <div className="flex gap-4 overflow-x-auto">
            {grouped[category].map(product => (
              <div key={product.id} className="w-48 border rounded-lg p-4 hover:shadow-lg">
                <img src={product.imageUrl || "https://via.placeholder.com/150"} alt={product.name} className="h-32 w-full object-cover rounded-md mb-2" />
                <h3 className="font-semibold text-green-800  pl-[50px]">{product.name}</h3>
                <p className="font-bold text-green-600 pl-[50px]">${product.price}</p>

              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
