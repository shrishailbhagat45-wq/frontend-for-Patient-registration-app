import { useState } from "react";
import { addReceptionist, getReceptionist, deleteUser, updateUserById } from "../API/user";
import { FiUserPlus, FiMail, FiLock, FiShield, FiUsers, FiTrash2, FiRefreshCw, FiEdit2, FiX } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function RegisterReceptionist() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Receptionist" });
  const [editingId, setEditingId] = useState(null);

  // Fetch receptionists using useQuery
  const { 
    data: receptionists = [], 
    refetch,
  } = useQuery({
    queryKey: ['receptionists'],
    queryFn: async () => {
      const res = await getReceptionist();
      const data = res?.data ?? res ?? [];
      return Array.isArray(data) ? data : [];
    },
    retry: 3,
    refetchOnWindowFocus: false,
  });

  // Add receptionist mutation
  const addMutation = useMutation({
    mutationFn: async (payload) => {
      return await addReceptionist(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receptionists'] });
      setForm({ name: "", email: "", password: "", role: "Receptionist" });
      toast.success("Receptionist added successfully!");
    },
    onError: (err) => {
      console.error("Failed to add receptionist", err);
      toast.error(err?.response?.data?.message || "Failed to add receptionist");
    }
  });

  // Update receptionist mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await updateUserById(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receptionists'] });
      setForm({ name: "", email: "", password: "", role: "Receptionist" });
      setEditingId(null);
      toast.success("Receptionist updated successfully!");
    },
    onError: (err) => {
      console.error("Failed to update receptionist", err);
      toast.error(err?.response?.data?.message || "Failed to update receptionist");
    }
  });

  // Delete receptionist mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receptionists'] });
      toast.success('Receptionist deleted successfully');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete receptionist');
    },
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Email is invalid.";
    // Password is only required when adding new receptionist
    if (!editingId && !form.password) return "Password is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = validate();
    if (errMsg) {
      toast.error(errMsg);
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
    };

    // Only include password if it's provided (for add or update)
    if (form.password) {
      payload.password = form.password;
    }

    if (editingId) {
      // Update existing receptionist
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      // Add new receptionist
      payload.doctorId = localStorage.getItem("doctorId");
      payload.clinicId = localStorage.getItem("clinicId");
      addMutation.mutate(payload);
    }
  };

  const handleEdit = (receptionist) => {
    setForm({
      name: receptionist.name,
      email: receptionist.email,
      password: "", // Don't populate password for security
      role: receptionist.role,
    });
    setEditingId(receptionist._id);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setForm({ name: "", email: "", password: "", role: "Receptionist" });
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this receptionist?")) return;
    deleteMutation.mutate(id);
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiUserPlus className="text-blue-600 text-lg" />
            <h3 className="text-lg font-semibold text-slate-800">
              {editingId ? "Edit Receptionist" : "Register Receptionist"}
            </h3>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
              title="Cancel Edit"
            >
              <FiX className="text-lg" />
            </button>
          )}
        </div>

        {editingId && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Editing mode:</strong> Leave password blank to keep the current password
            </p>
          </div>
        )}

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
              Password {!editingId && <span className="text-red-500">*</span>}
              {editingId && <span className="text-xs text-slate-500">(optional)</span>}
            </span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required={!editingId}
              placeholder={editingId ? "Leave blank to keep current password" : "Enter password"}
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
          </label>          <div className="sm:col-span-2 flex justify-end gap-3">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={addMutation.isPending || updateMutation.isPending}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingId ? <FiEdit2 className="text-base" /> : <FiUserPlus className="text-base" />}
              {editingId 
                ? (updateMutation.isPending ? "Updating..." : "Update Receptionist")
                : (addMutation.isPending ? "Adding..." : "Add Receptionist")
              }
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
          <button
            type="button"
            onClick={() => refetch()}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
            title="Refresh"
          >
            <FiRefreshCw className="text-base" />
          </button>
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
              <li key={r._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition">
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
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(r)}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-1.5 text-sm"
                    aria-label={`Edit ${r.name}`}
                  >
                    <FiEdit2 className="text-xs" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    disabled={deleteMutation.isPending}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors shadow-sm flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Delete ${r.name}`}
                  >
                    <FiTrash2 className="text-xs" />
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
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
