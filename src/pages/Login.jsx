import React, { useState } from 'react'
import { login } from '../API/user';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate=useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const res=await login(form.username,form.password)
    if (res) {
      localStorage.setItem("token",res.token)
      if (res.role==="Receptionist") {
        localStorage.setItem("doctorId",res.doctorId)
        localStorage.setItem("Id",res.id)
      } else {
        localStorage.setItem("doctorId",res.id)
        localStorage.setItem("Id",res.id)
      }
      toast.success("Login successful");
      navigate('/home')
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md px-6">        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-2">
            HealSync360
          </h1>
          <p className="text-sm text-slate-500">Clinical Management System</p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-sm border border-slate-200"
        >
          <h2 className="text-xl font-semibold text-slate-800 mb-5">Sign In</h2>
          
          {error && (
            <div className="mb-4 px-3 py-2 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              autoComplete="username"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
          </div>
            <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-all shadow-sm"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
