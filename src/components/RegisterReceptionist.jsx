import React, { useEffect, useState } from "react";

const STORAGE_KEY = "receptionists";

export default function RegisterReceptionist() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Receptionist",
  });
  const [receptionists, setReceptionists] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setReceptionists(raw ? JSON.parse(raw) : []);
    } catch {
      setReceptionists([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(receptionists));
    } catch (err) {
      console.error("Failed to save receptionists", err);
    }
  }, [receptionists]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.email.trim()) return "Email is required.";
    // simple email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Email is invalid.";
    if (!form.password) return "Password is required.";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      alert(err);
      return;
    }
    const newRec = {
      id: Date.now().toString(),
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
    };
    setReceptionists((prev) => [newRec, ...prev]);
    setForm({ name: "", email: "", password: "", role: "Receptionist" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this receptionist?")) return;
    setReceptionists((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Register Receptionist</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Name</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Role</span>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="border rounded px-3 py-2 bg-white"
            >
              <option>Receptionist</option>
              <option>Manager</option>
            </select>
          </label>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Receptionist
            </button>
          </div>
        </form>
      </section>

      <section className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Receptionists ({receptionists.length})</h3>
        </div>

        <ul className="divide-y">
          {receptionists.length === 0 ? (
            <li className="px-6 py-6 text-center text-gray-500">No receptionists registered.</li>
          ) : (
            receptionists.map((r) => (
              <li key={r.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-sm text-gray-500">
                    {r.email} — <span className="italic">{r.role}</span>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    aria-label={`Delete ${r.name}`}
                  >
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
