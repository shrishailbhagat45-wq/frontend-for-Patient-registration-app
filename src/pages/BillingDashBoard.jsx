import React, { useState, useEffect } from "react";
import { getBillingItems } from "../API/Patient";
import { deleteItem } from "../API/Patient";
import  { addItem } from "../API/Patient";
import { updateItem } from "../API/Patient";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

// Replace these with your actual API endpoints
const API_BASE = "https://your-api-url.com";








export default function BillingDashBoard() {
    const [iDelete,setIDelete]=useState(false)
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: "", price: "" });
    const [editingId, setEditingId] = useState(null);
    const [editItem, setEditItem] = useState({ name: "", price: "" });

    useEffect(() => {
        getBillingItems().then(setItems);
    }, []);

    useEffect(()=>{
        getBillingItems().then(setItems)
        setIDelete(false)
    },[iDelete,newItem,editItem])

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.price) return;
        const added = await addItem({ name: newItem.name, price: Number(newItem.price) });
        if (added && added.id) {
            setItems([...items, added]);
            setNewItem({ name: "", price: "" });
            toast.success("Item added successfully");
        } else {
            toast.error("Error in adding item");
        }
    };

    const handleDelete = async (id) => {
        const res=await deleteItem(id);
        setIDelete(true)
        setItems(items.filter((item) => item.id !== id));
        toast.success("Item deleted successfully");

    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setEditItem({ name: item.name, price: item.price });
    };

    const handleEditSave = async (id) => {
        const updated = await updateItem(id, { ...editItem, price: Number(editItem.price) });
        setItems(items.map((item) => (item._id === id ? updated : item)));
        setEditingId(null);
        setEditItem({ name: "", price: "" });
    };

    return (
        <div className=" ">
            <Navbar/>

        <div className="max-w-2xl mx-auto mt-24 p-4 bg-white rounded-xl shadow-lg ">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Billing Dashboard</h2>
            <form
                onSubmit={handleAdd}
                className="flex flex-col sm:flex-row gap-3 mb-6 items-center"
            >
                <input
                    type="text"
                    placeholder="Item Name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Add Item
                </button>
            </form>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg">
                    <thead>
                        <tr className="bg-blue-50">
                            <th className="py-3 px-2 text-left font-semibold text-gray-700">Item Name</th>
                            <th className="py-3 px-2 text-left font-semibold text-gray-700">Price (₹)</th>
                            <th className="py-3 px-2 text-center font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) =>
                            editingId === item._id ? (
                                <tr key={item._id} className="bg-blue-50">
                                    <td className="py-2 px-2">
                                        <input
                                            type="text"
                                            value={editItem.name}
                                            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                                            className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </td>
                                    <td className="py-2 px-2">
                                        <input
                                            type="number"
                                            value={editItem.price}
                                            onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                                            className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </td>
                                    <td className="py-2 px-2 flex gap-2 justify-center">
                                        <button
                                            onClick={() => handleEditSave(item._id)}
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                                            title="Save"
                                        >
                                            {/* Save Icon */}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                                            title="Cancel"
                                        >
                                            {/* Cancel Icon */}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={item._id} className="hover:bg-blue-50 transition">
                                    <td className="py-2 px-2">{item.name}</td>
                                    <td className="py-2 px-2">{item.price}</td>
                                    <td className="py-2 px-2 flex gap-2 justify-center">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                                            title="Edit"
                                        >
                                            {/* Edit Icon */}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h2v2h2v-2h2v-2h-2v-2h-2v2H9v2z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                            title="Delete"
                                        >
                                            {/* Delete Icon */}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            )
                        )}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center py-6 text-gray-500">
                                    No billing items found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    );
}