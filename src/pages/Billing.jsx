import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBillingItems, getPatientById, createBill } from "../API/Patient";
import Navbar from "../components/Navbar";

export default function Billing() {
  const { patientId } = useParams(); // get single patient id from URL
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
      items: billItems.map((it) => ({ item: it.id, quantity: it.qty, price: it.price })),
      taxPercent: Number(taxPercent) || 0,
      taxAmount: Number(taxAmount) || 0,
      totalAmount: total,
      billNotes: notes,
    };

    const res = await createBill(payload);
    if (res && (res?.data || res)) {
      setMessage({ type: "success", text: "Bill created successfully." });
      setBillItems([]);
    } else {
      setMessage({ type: "error", text: "Failed to create bill." });
    }
  }
  

  return (
    <div>
        <Navbar />
    <div className="max-w-4xl mx-auto p-4 mt-20">
      <h2 className="text-2xl font-semibold mb-4">Create Patient Bill</h2>

      {message && (
        <div className={`mb-4 p-3 rounded relative ${
            message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800"
          } `}
        >
          <button className=" absolute right-0 px-4" onClick={()=>messageClose()}>X</button>
          {message.text}
          
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Patient</label>
            <div className="w-full border rounded px-3 py-2 bg-gray-50">
              {selectedPatient ? (
                <div className="text-lg font-medium text-gray-800">
                  <div><strong>{selectedPatient.name}</strong></div>
                </div>
              ) : (
                <div className="text-sm font-medium text-gray-500">Loading patient...</div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Billing Item</label>
            <div className="flex gap-2">
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="flex-1 border rounded px-2 py-2"
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
                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded mt-10">
          <table className="min-w-[520px] w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Item</th>
                <th className="p-3 text-right w-28">Price</th>
                <th className="p-3 text-center w-28">Qty</th>
                <th className="p-3 text-right w-28">Total</th>
                <th className="p-3 text-center w-20">Action</th>
              </tr>
            </thead>
            <tbody>
              {billItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-3 text-gray-500">No items added.</td>
                </tr>
              ) : (
                billItems.map((bi) => (
                  <tr key={bi.id} className="border-t">
                    <td className="p-3">{bi.name}</td>
                    <td className="p-3 text-right">₹{bi.price.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="1"
                        value={bi.qty}
                        onChange={(e) => updateQty(bi.id, e.target.value)}
                        className="w-20 text-center border rounded px-2 py-1"
                      />
                    </td>
                    <td className="p-3 text-right">₹{(bi.price * bi.qty).toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(bi.id)}
                        className="text-sm text-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:items-start">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="w-full md:w-72 border rounded p-4 bg-white shadow">
            <div className="flex justify-between mb-2">
              <div className="text-sm text-gray-600">Subtotal</div>
              <div className="font-medium">₹{subtotal.toFixed(2)}</div>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <input
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                className="w-20 border rounded px-2 py-1"
              />
              <div className="text-sm text-gray-600">Tax %</div>
              <div className="ml-auto text-right">₹{taxAmount.toFixed(2)}</div>
            </div>

            <hr className="my-2" />
            <div className="flex justify-between font-semibold">
              <div>Total</div>
              <div>₹{total.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            {loading ? "Creating..." : "Create Bill"}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}