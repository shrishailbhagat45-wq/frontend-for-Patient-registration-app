import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {  getPatientById, } from "../API/Patient";
import { getBillingItems,createBill } from "../API/billing";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

export default function Billing() {
  const { patientId } = useParams(); // get single patient id from URL
  const doctorId = localStorage.getItem("doctorId");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [taxPercent, setTaxPercent] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch billing items
  const { data: items = [] } = useQuery({
    queryKey: ['billingItems'],
    queryFn: async () => {
      const itemsRes = await getBillingItems();
      const itemsData = itemsRes?.data ?? itemsRes ?? [];
      return Array.isArray(itemsData) ? itemsData : [];
    },
  });

  // Fetch patient data
  const { data: selectedPatient = null } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      if (!patientId) {
        setMessage({ type: "error", text: "Missing patient id in URL." });
        return null;
      }
      const patientRes = await getPatientById(patientId);
      const patientData = patientRes?.data ?? patientRes ?? [];
      return patientData;
    },
    enabled: !!patientId,
  });

  function addItemToBill() {
    if (!selectedItemId) return;
    const item = items.find((it) => String(it.id ?? it._id) === String(selectedItemId));
    if (!item) return;
    setBillItems((prev) => {
      const existing = prev.find((b) => String(b.id) === String(item.id ?? item._id));
      if (existing) {
        return prev.map((b) =>
          String(b.id) === String(item.id ?? item._id) ? { ...b, qty: b.qty + 1 } : b
        );
      }
      return [
        ...prev,
        {
          id: item.id ?? item._id,
          name: item.name,
          price: Number(item.price || 0),
          qty: 1,
        },
      ];
    });
  }

  function messageClose() {
    setMessage(null);
  }
  
  
  function updateQty(itemId, qty) {
    const q = Math.max(0, Math.floor(Number(qty) || 0));
    setBillItems((prev) =>
      prev
        .map((bi) => (String(bi.id) === String(itemId) ? { ...bi, qty: q } : bi))
        .filter((bi) => bi.qty > 0)
    );
  }

  function removeItem(itemId) {
    setBillItems((prev) => prev.filter((bi) => String(bi.id) !== String(itemId)));
  }

  const subtotal = billItems.reduce((s, it) => s + it.price * it.qty, 0);
  const taxAmount = +(subtotal * (Number(taxPercent) || 0) / 100).toFixed(2);
  const total = +(subtotal + taxAmount).toFixed(2);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    if (!patientId && !selectedPatient) {
      setMessage({ type: "error", text: "Missing patient." });
      return;
    }
    if (billItems.length === 0) {
      setMessage({ type: "error", text: "Add at least one billing item." });
      return;
    }
    


    const payload = {
      patientId: patientId,
      patientName: selectedPatient?.name ?? "Unknown",
      doctorId: doctorId,
      items: billItems.map((it) => ({ itemId: it.id, itemName: it.name, quantity: it.qty, price: it.price })),
      taxPercent: Number(taxPercent) || 0,
      taxAmount: Number(taxAmount) || 0,
      totalAmount: total,
      billNotes: notes,
    };

    const res = await createBill(payload);
    if (res && (res?.data || res)) {
      setMessage({ type: "success", text: "Bill created successfully." });
      toast.success("Bill created successfully");
      setBillItems([]);
    } else {
      setMessage({ type: "error", text: "Failed to create bill." });
      toast.error("Failed to create bill");
    }
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
        <Navbar />
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Create Patient Bill</h2>
        <p className="text-sm text-slate-500 mt-1">Generate a new bill for patient services</p>
      </div>      {message && (
        <div className={`mb-4 p-3 rounded-md relative border ${
            message.type === "error" 
              ? "bg-red-50 text-red-700 border-red-200" 
              : "bg-green-50 text-green-700 border-green-200"
          }`}
        >
          <button className="absolute right-3 top-3 text-sm hover:opacity-70" onClick={()=>messageClose()}>✕</button>
          <p className="text-sm font-medium pr-6">{message.text}</p>
        </div>
      )}      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Patient</label>
            <div className="w-full border border-slate-300 rounded-md px-3 py-2.5 bg-slate-50">
              {selectedPatient ? (
                <div className="text-sm font-medium text-slate-800">
                  <div><strong>{selectedPatient.name}</strong></div>
                </div>
              ) : (
                <div className="text-sm font-medium text-slate-500">Loading patient...</div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Billing Item</label>
            <div className="flex gap-2">
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">-- select item --</option>
                {items.map((it) => (
                  <option key={it.id ?? it._id} value={it.id ?? it._id}>
                    {it.name} — ₹{Number(it.price || 0).toFixed(2)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addItemToBill}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
              >
                Add
              </button>
            </div>
          </div>
        </div>
        </div>        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-[520px] w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-slate-700">Item</th>
                <th className="py-3 px-4 text-right w-28 font-semibold text-slate-700">Price</th>
                <th className="py-3 px-4 text-center w-28 font-semibold text-slate-700">Qty</th>
                <th className="py-3 px-4 text-right w-28 font-semibold text-slate-700">Total</th>
                <th className="py-3 px-4 text-center w-20 font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {billItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-sm">No items added yet</td>
                </tr>
              ) : (
                billItems.map((bi) => (
                  <tr key={bi.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-slate-800 font-medium">{bi.name}</td>
                    <td className="py-3 px-4 text-right text-slate-700">₹{bi.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="1"
                        value={bi.qty}
                        onChange={(e) => updateQty(bi.id, e.target.value)}
                        className="w-20 text-center border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700 font-semibold">₹{(bi.price * bi.qty).toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(bi.id)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>        <div className="flex flex-col md:flex-row gap-4 md:items-start">
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add any additional notes or comments..."
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          <div className="w-full md:w-72 border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between mb-3">
              <div className="text-sm text-slate-600">Subtotal</div>
              <div className="font-medium text-slate-800">₹{subtotal.toFixed(2)}</div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                className="w-20 border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="text-sm text-slate-600">Tax %</div>
              <div className="ml-auto text-right text-slate-700">₹{taxAmount.toFixed(2)}</div>
            </div>

            <hr className="my-3 border-slate-200" />
            <div className="flex justify-between font-semibold text-slate-800">
              <div>Total</div>
              <div className="text-lg">₹{total.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? "Creating..." : "Create Bill"}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}