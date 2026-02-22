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
    };        return (
        <div className="min-h-screen bg-slate-50">
            <Navbar/>

            <div className="max-w-7xl mx-auto pt-20 px-4 md:px-8 lg:px-12 pb-8">
                {/* Header Section */}
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
                            <FaMoneyBillWave className="text-blue-600 text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">Billing Dashboard</h1>
                            <p className="text-sm text-slate-500 mt-1">Manage billing items and view revenue analytics</p>
                        </div>
                    </div>
                </div>                {/* Add Item Section */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FaPlus className="text-blue-600 text-lg" />
                        <h2 className="text-lg font-semibold text-slate-800">Add New Billing Item</h2>
                    </div>
                    <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Item Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Consultation, Injection"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                                required
                            />
                        </div>
                        <div className="flex-1 sm:flex-none sm:w-40">
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={newItem.price}
                                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div className="flex-1 sm:flex-none sm:w-auto sm:self-end">
                            <button
                                type="submit"
                                disabled={isAdding}
                                className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap text-sm"
                            >
                                {isAdding ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                        </div>
                    </form>
                </div>{/* Items Table Section */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800">Billing Items</h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {items.length} {items.length === 1 ? 'item' : 'items'} in total
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="py-3 px-6 text-left text-sm font-semibold text-slate-700">Item Name</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold text-slate-700">Price (₹)</th>
                                    <th className="py-3 px-6 text-center text-sm font-semibold text-slate-700">Actions</th>
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
                                    </tr>                                ) : items.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-slate-100 rounded-full">
                                                    <FaMoneyBillWave className="text-slate-400 text-3xl" />
                                                </div>
                                                <p className="text-slate-600 font-medium text-sm">No billing items found</p>
                                                <p className="text-xs text-slate-400">Add your first billing item above</p>
                                            </div>
                                        </td>
                                    </tr>                                ) : items.map((item, index) =>
                                    editingId === item._id ? (
                                        <tr key={item._id} className="bg-blue-50 border-b border-slate-200">
                                            <td className="py-3 px-6">
                                                <input
                                                    type="text"
                                                    value={editItem.name}
                                                    onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                />
                                            </td>
                                            <td className="py-3 px-6">
                                                <input
                                                    type="number"
                                                    value={editItem.price}
                                                    onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleEditSave(item._id)}
                                                        className="bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition flex items-center gap-1.5 shadow-sm text-sm"
                                                        title="Save"
                                                    >
                                                        <MdSave className="text-base" />
                                                        <span className="font-medium">Save</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="bg-slate-400 text-white px-3 py-1.5 rounded-md hover:bg-slate-500 transition flex items-center gap-1.5 shadow-sm text-sm"
                                                        title="Cancel"
                                                    >
                                                        <MdCancel className="text-base" />
                                                        <span className="font-medium">Cancel</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={item._id} className={`border-b border-slate-100 hover:bg-slate-50 transition`}>
                                            <td className="py-3 px-6 font-medium text-slate-800 text-sm">{item.name}</td>
                                            <td className="py-3 px-6 text-slate-700 text-sm">
                                                <span className="inline-flex items-center gap-1 font-semibold">
                                                    ₹{Number(item.price).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="bg-amber-500 text-white px-3 py-1.5 rounded-md hover:bg-amber-600 transition shadow-sm flex items-center gap-1.5 text-sm"
                                                        title="Edit"
                                                    >
                                                        <FaPen className="text-xs" />
                                                        <span className="font-medium">Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition shadow-sm flex items-center gap-1.5 text-sm"
                                                        title="Delete"
                                                    >
                                                        <RiDeleteBinFill className="text-xs" />
                                                        <span className="font-medium">Delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>                {/* Chart Section */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FaChartBar className="text-blue-600 text-lg" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">Revenue Analytics</h2>
                                <p className="text-sm text-slate-500">Track your billing performance</p>
                            </div>
                        </div>
                        <div>
                            <select
                                value={labelForXAxis}
                                onChange={handleXAxisChange}
                                className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium text-slate-700 cursor-pointer transition-colors"
                            >
                                <option value="This Year">This Year</option>
                                <option value="Last Year">Last Year</option>
                                {months.map((month, index) => (
                                    <option key={index} value={month}>{month}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
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