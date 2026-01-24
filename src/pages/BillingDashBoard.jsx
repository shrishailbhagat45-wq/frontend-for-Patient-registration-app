import React, { useState, useEffect } from "react";
import { getBillingItems } from "../API/Patient";
import { deleteItem } from "../API/Patient";
import  { addItem } from "../API/Patient";
import { updateItem } from "../API/Patient";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { FaPen } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



export default function BillingDashBoard() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const Dates=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"]
    const [iDelete,setIDelete]=useState(false)
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: "", price: "" });
    const [editingId, setEditingId] = useState(null);
    const [editItem, setEditItem] = useState({ name: "", price: "" });
    const [labelForXAxis,setLabelForXAxis]=useState("This Year");
    const [valueOfXAxisLabel, setValueOfXAxisLabel] = useState(months);


    const chartData = {
        labels: valueOfXAxisLabel,
        datasets: [
            {
                label: 'Billing Data',
                data: [12, 19, 3, 5, 2, 3, 4, 6, 8, 10, 11, 15],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };
    

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

    const handleXAxisChange = (e) => {
        const v = e.target.value;
        setLabelForXAxis(v);

        if (v === "This Year" || v === "Last Year") {
            setValueOfXAxisLabel(months);
        } else if (["Jan","Mar","May","Jul","Aug","Oct","Dec"].includes(v)) {
            setValueOfXAxisLabel(Dates);
        } else if (v === "Feb") {
            setValueOfXAxisLabel(Dates.slice(0,28));
        } else if (["Apr","Jun","Sep","Nov"].includes(v)) {
            setValueOfXAxisLabel(Dates.slice(0,30));
        } else {
            setValueOfXAxisLabel([]);
        }
    };

    return (
        <div className=" ">
            <Navbar/>

        <div className="max-w-2xl mx-auto mt-24 p-4 bg-white rounded-xl shadow-lg ">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700 text-shadow-sm ">Billing Dashboard</h2>
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
                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
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
                                            <MdCancel />
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
                                            className="text-white bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-yellow-800 font-medium rounded-lg text-sm px-4 py-2.5 text-center me-2 mb-2"
                                            title="Edit"
                                        >
                                            <FaPen />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-4 py-2.5 text-center me-2 mb-2"
                                            title="Delete"
                                        >
                                            <RiDeleteBinFill />
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
            <div></div>
        </div>
        <div className="px-4 py-4 max-w-3xl mx-auto mt-8 bg-white rounded-xl shadow-lg">
            <div className=" relative">
                <select name="" id="" value={labelForXAxis} onChange={handleXAxisChange} className="mb-4 px-2 border rounded-md">
                    <option value="This Year">This Year</option>
                    <option value="Last Year">Last Year</option>
                    {months.map((month, index) => (
                        <option key={index} value={month}>{month}</option>
                    ))}
                </select>
            </div>
            <div>
                {
                valueOfXAxisLabel.length!==0?
                <Bar data={chartData} />: <div>Loading...</div>
            }
            </div>
        </div>
    </div>
    );
}