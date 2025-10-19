import React, { useState } from 'react';
import { BarChart3, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Creatuser() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    agreeTerms: false
  });
const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  // 🔹 Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Input handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 🔹 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (validateForm()) {
      try {
        // Only send required fields to backend
        const payload = {
          username: formData.username,
          email: formData.email,
          role: formData.role
        };

        const response = await axios.post(
          'https://localhost:7044/api/User/create',
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.status === 200 || response.status === 201) {
          setSubmitted(true);

          // Reset form after few seconds
       setTimeout(() => {
    navigate('/Admin');
  }, 2000);
        }
      } catch (error) {
        console.error('API Error:', error);
        if (error.response) {
          setApiError(error.response.data.message || 'Something went wrong');
        } else {
          setApiError('Unable to connect to server');
        }
      }
    }
  };

  // 🔹 Success Message
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            User Created Successfully!
          </h2>
          <p className="text-gray-600 mb-4">
            Welcome, <span className="font-semibold">{formData.username}</span>!
          </p>
          <p className="text-sm text-gray-500">
            Your account has been created successfully.
          </p>
        </div>
      </div>
    );
  }

  // 🔹 Form UI
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 py-4">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Ledger Management System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Registration Form */}
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600 mb-8">Add new user to system</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter username"
              />
              {errors.username && (
                <p className="text-red-600 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              >
                <option value="">Select Role</option>
                <option value="customer">Customer</option>
                <option value="supplier">Supplier</option>
              </select>
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
              />
              <label className="text-sm text-gray-600">
                I agree to the{' '}
                <span className="text-green-600 font-medium cursor-pointer">
                  Terms and Conditions
                </span>
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-red-600 text-xs">{errors.agreeTerms}</p>
            )}

            {/* API Error */}
            {apiError && (
              <p className="text-red-600 text-sm text-center">{apiError}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 mt-6"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
