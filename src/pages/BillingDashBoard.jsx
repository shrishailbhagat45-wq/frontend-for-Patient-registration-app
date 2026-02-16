import { useState } from "react";
import { getBillingItems } from "../API/Patient";
import { deleteItem } from "../API/Patient";
import  { addItem } from "../API/Patient";
import { updateItem } from "../API/Patient";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { FaPen, FaMoneyBillWave, FaPlus, FaChartBar } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { MdCancel, MdSave } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



export default function BillingDashBoard() {
    const navigate = useNavigate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const Dates=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"]
    const [newItem, setNewItem] = useState({ name: "", price: "" });
    const [editingId, setEditingId] = useState(null);
    const [editItem, setEditItem] = useState({ name: "", price: "" });
    const [labelForXAxis,setLabelForXAxis] = useState("This Year");
    const [valueOfXAxisLabel, setValueOfXAxisLabel] = useState(months);
    const [isAdding, setIsAdding] = useState(false);
    const queryClient = useQueryClient();
    const { data: items = [], isLoading, refetch } = useQuery({
        queryKey: ['billingItems'],
        queryFn: async () => {
            console.log('Fetching billing items...');
            const res = await getBillingItems();
            console.log('getBillingItems response:', res);
            return res || [];
        },
    });    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.price) return;
        setIsAdding(true);
        try {
            const added = await addItem({ name: newItem.name, price: Number(newItem.price) });
            console.log('addItem response:', added);
            if (added && added.id) {
                await queryClient.invalidateQueries({ queryKey: ['billingItems'] });
                await refetch();
                setNewItem({ name: "", price: "" });
                toast.success("Item added successfully");
            } else {
                toast.error("Error in adding item");
            }
        } catch (error) {
            toast.error("Error in adding item");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (id) => {
        const deleted = await deleteItem(id);
        console.log('deleteItem response:', deleted);
        await queryClient.invalidateQueries({ queryKey: ['billingItems'] });
        await refetch();
        toast.success("Item deleted successfully");
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setEditItem({ name: item.name, price: item.price });
    };

    const handleEditSave = async (id) => {
        const updated = await updateItem(id, { ...editItem, price: Number(editItem.price) });
        console.log('updateItem response:', updated);
        await queryClient.invalidateQueries({ queryKey: ['billingItems'] });
        await refetch();
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
    };    const chartData = {
        labels: valueOfXAxisLabel,
        datasets: [
            {
                label: 'Revenue (₹)',
                data: [12, 19, 3, 5, 2, 3, 4, 6, 8, 10, 11, 15],
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                    color: '#374151'
                }
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    color: '#6B7280'
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    color: '#6B7280'
                }
            }
        }
    };    

    return (
        <div className="min-h-screen bg-white">
            <Navbar/>

            <div className="max-w-6xl mx-auto mt-20 px-4 py-8">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                        <button
                            onClick={() => navigate("/home")}
                            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-3"
                        >
                            <IoArrowBack className="text-xl" />
                            <span className="text-sm">Back to Home</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/20 rounded-lg">
                                <FaMoneyBillWave className="text-white text-3xl" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Billing Dashboard</h1>
                                <p className="text-blue-100 mt-1">Manage billing items and view revenue analytics</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Item Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FaPlus className="text-blue-600 text-xl" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Add New Billing Item</h2>
                    </div>
                    <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                Item Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Consultation, Injection"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
                                required
                            />
                        </div>
                        <div className="w-full sm:w-40">
                            <label className="block text-gray-700 font-medium mb-2 text-sm">
                                Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={newItem.price}
                                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isAdding}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                        >
                            {isAdding ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Adding...</span>
                                </>
                            ) : (
                                <>
                                    <FaPlus />
                                    <span>Add Item</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Items Table Section */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Billing Items</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {items.length} {items.length === 1 ? 'item' : 'items'} in total
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-blue-50 border-b border-blue-100">
                                    <th className="py-4 px-6 text-left font-semibold text-gray-700">Item Name</th>
                                    <th className="py-4 px-6 text-left font-semibold text-gray-700">Price (₹)</th>
                                    <th className="py-4 px-6 text-center font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={3} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-3">
                                                <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="text-gray-500">Loading billing items...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : items.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-gray-100 rounded-full">
                                                    <FaMoneyBillWave className="text-gray-400 text-4xl" />
                                                </div>
                                                <p className="text-gray-500 font-medium">No billing items found</p>
                                                <p className="text-sm text-gray-400">Add your first billing item above</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : items.map((item, index) =>
                                    editingId === item._id ? (
                                        <tr key={item._id} className="bg-blue-50 border-b border-blue-100">
                                            <td className="py-3 px-6">
                                                <input
                                                    type="text"
                                                    value={editItem.name}
                                                    onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                                                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                />
                                            </td>
                                            <td className="py-3 px-6">
                                                <input
                                                    type="number"
                                                    value={editItem.price}
                                                    onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                                                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleEditSave(item._id)}
                                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2 shadow-md"
                                                        title="Save"
                                                    >
                                                        <MdSave className="text-lg" />
                                                        <span className="text-sm font-medium">Save</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition flex items-center gap-2 shadow-md"
                                                        title="Cancel"
                                                    >
                                                        <MdCancel className="text-lg" />
                                                        <span className="text-sm font-medium">Cancel</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={item._id} className={`border-b border-gray-100 hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                            <td className="py-4 px-6 font-medium text-gray-800">{item.name}</td>
                                            <td className="py-4 px-6 text-gray-700">
                                                <span className="inline-flex items-center gap-1 font-semibold">
                                                    ₹{Number(item.price).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition shadow-md flex items-center gap-2"
                                                        title="Edit"
                                                    >
                                                        <FaPen className="text-sm" />
                                                        <span className="text-sm font-medium">Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-2 rounded-lg hover:from-red-500 hover:to-red-600 transition shadow-md flex items-center gap-2"
                                                        title="Delete"
                                                    >
                                                        <RiDeleteBinFill className="text-sm" />
                                                        <span className="text-sm font-medium">Delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FaChartBar className="text-blue-600 text-xl" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Revenue Analytics</h2>
                                <p className="text-sm text-gray-600">Track your billing performance</p>
                            </div>
                        </div>
                        <div>
                            <select
                                value={labelForXAxis}
                                onChange={handleXAxisChange}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium text-gray-700 cursor-pointer transition-all"
                            >
                                <option value="This Year">This Year</option>
                                <option value="Last Year">Last Year</option>
                                {months.map((month, index) => (
                                    <option key={index} value={month}>{month}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        {valueOfXAxisLabel.length !== 0 ? (
                            <Bar data={chartData} options={chartOptions} />
                        ) : (
                            <div className="flex items-center justify-center py-12">
                                <div className="flex flex-col items-center gap-3">
                                    <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="text-gray-500">Loading chart data...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}