import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, X } from "lucide-react";
import axios from "axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
    image: null, // 🔹 file
    stock: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://localhost:7044/api/Product/catogory");
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ name: "", price: "", categoryId: "", image: null, stock: "" });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      categoryId: product.categoryId || "",
      image: null,
      stock: product.stock,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`https://localhost:7044/api/Product/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  // ✅ handleSave with FormData for file upload
  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.categoryId || !formData.stock) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("Name", formData.name);
      fd.append("Price", formData.price);
      fd.append("CategoryId", formData.categoryId);
      fd.append("Stock", formData.stock);
      if (formData.image) fd.append("Image", formData.image);

      let res;
      if (editingId) {
        res = await axios.put(`https://localhost:7044/api/Product/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...res.data.data } : p))
        );
        alert("✅ Product updated!");
      } else {
        res = await axios.post("https://localhost:7044/api/Product", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setProducts((prev) => [...prev, res.data.data]);
        alert("✅ Product added!");
      }

      setShowModal(false);
      setFormData({ name: "", price: "", categoryId: "", image: null, stock: "" });
    } catch (err) {
      console.error("Error saving product:", err);
      alert("❌ Failed to save product");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-700">Products Management</h1>
            <p className="text-green-600 text-sm mt-1">Manage your product inventory</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"
          >
            <Plus size={20} /> Add Product
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-green-600">
          <table className="w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Product Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-100">
              {products.map((product, idx) => (
                <tr key={product.id} className={idx % 2 === 0 ? "bg-white hover:bg-green-50" : "bg-green-50 hover:bg-green-100"}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category?.name || "N/A"}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">${product.price?.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">{product.stock}</td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button onClick={() => handleEdit(product)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded flex items-center gap-1">
                      <Edit2 size={16} /> Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex items-center gap-1">
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 border-t-4 border-green-600">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-green-700">{editingId ? "Edit Product" : "Add New Product"}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-green-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product name" className="w-full px-3 py-2 border border-green-300 rounded-lg" />
                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full px-3 py-2 border border-green-300 rounded-lg" />
                <input type="file" onChange={handleFileChange} className="w-full px-3 py-2 border border-green-300 rounded-lg" />
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full px-3 py-2 border border-green-300 rounded-lg">
                  <option value="">Select Category</option>
                  <option value="1">Beverage</option>
                  <option value="2">Chocolate</option>
                  <option value="3">Drinks</option>
                </select>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" className="w-full px-3 py-2 border border-green-300 rounded-lg" />
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 px-4 py-2 rounded-lg">Cancel</button>
                <button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">{editingId ? "Update" : "Add"} Product</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
  