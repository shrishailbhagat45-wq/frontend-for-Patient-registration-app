import React, { useEffect, useState } from "react";
import { addReceptionist,getReceptionist } from "../API/Patient";
import { FiUserPlus, FiMail, FiLock, FiShield, FiUsers, FiTrash2 } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function RegisterReceptionist() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Receptionist" });
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // load users from API on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getReceptionist();
        const data = res?.data ?? res ?? [];
        if (mounted) setReceptionists(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load users", err);
        if (mounted) setError("Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.email.trim()) return "Email is required.";
    // simple email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Email is invalid.";
    if (!form.password) return "Password is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = validate();
    if (errMsg) {
      alert(errMsg);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      };

      const res = await addReceptionist(payload);
      const created = res?.data ?? res ?? null;

      // refresh user list after successful add
      const refresh = await getReceptionist();
      const list = refresh?.data ?? refresh ?? [];
      setReceptionists(Array.isArray(list) ? list : []);

      // reset form
      setForm({ name: "", email: "", password: "", role: "Receptionist" });
    } catch (err) {
      console.error("Failed to add receptionist", err);
      setError("Failed to add receptionist");
      alert("Failed to add receptionist. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this receptionist?")) return;
    // note: delete on UI only — implement server-side delete if API available
    setReceptionists((prev) => prev.filter((r) => r.id !== id));
  };
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4 text-sm"
        >
          <IoArrowBack className="text-lg" />
          <span>Back to Home</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FiUsers className="text-blue-600 text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Staff Management</h2>
            <p className="text-sm text-slate-500 mt-1">Register and manage reception staff</p>
          </div>
        </div>
      </div>

      {/* Register Form */}
      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FiUserPlus className="text-blue-600 text-lg" />
          <h3 className="text-lg font-semibold text-slate-800">Register Receptionist</h3>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FiUserPlus className="text-slate-500 text-sm" />
              Name <span className="text-red-500">*</span>
            </span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter full name"
              className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FiMail className="text-slate-500 text-sm" />
              Email <span className="text-red-500">*</span>
            </span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="email@example.com"
              className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FiLock className="text-slate-500 text-sm" />
              Password <span className="text-red-500">*</span>
            </span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FiShield className="text-slate-500 text-sm" />
              Role <span className="text-red-500">*</span>
            </span>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="border border-slate-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option>Receptionist</option>
              <option>Manager</option>
            </select>
          </label>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm text-sm flex items-center gap-2"
            >
              <FiUserPlus className="text-base" />
              Add Receptionist
            </button>
          </div>
        </form>
      </section>

      {/* Receptionists List */}
      <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <FiUsers className="text-blue-600" />
              Registered Staff
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">{receptionists.length} {receptionists.length === 1 ? 'member' : 'members'}</p>
          </div>
        </div>

        <ul className="divide-y divide-slate-100">
          {receptionists.length === 0 ? (
            <li className="px-6 py-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-slate-100 rounded-full">
                  <FiUsers className="text-slate-400 text-3xl" />
                </div>
                <p className="text-slate-600 font-medium text-sm">No receptionists registered</p>
                <p className="text-xs text-slate-400">Add your first staff member above</p>
              </div>
            </li>
          ) : (
            receptionists.map((r) => (
              <li key={r.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {r.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-slate-800 text-sm">{r.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <FiMail className="text-slate-400" />
                      {r.email}
                      <span className="text-slate-300">•</span>
                      <FiShield className="text-slate-400" />
                      <span className="italic">{r.role}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-sm flex items-center gap-1.5 text-sm"
                    aria-label={`Delete ${r.name}`}
                  >
                    <FiTrash2 className="text-xs" />
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
