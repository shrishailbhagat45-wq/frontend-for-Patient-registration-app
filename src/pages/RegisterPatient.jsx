import { useState } from "react";
import { createPatient,getPatients } from "../API/Patient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";

const RegisterPatient = () => {
    const [form, setForm] = useState({
        name: "",
        gender: "",
        age: "",
        phoneNumber: "",
        weight: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        const response=await createPatient(form);
        navigate("/home");
        if(response.status===201){
            toast.success("Patient Registered Successfully");
        }else{
            toast.error("Error in registering patient");
        }
    };

    return (
        <>
        <div>
            <Navbar/>
        </div>
        <div className="min-h-screen bg-gray-100 mt-10 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Register Patient
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 mb-1" htmlFor="name">
                            Name
                        </label>
                        <input
                            className="w-full px-3 py-2 border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black bg-gray-100"
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1" htmlFor="gender">
                            Gender
                        </label>
                        <select
                            className="w-full px-3 py-2 border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black bg-gray-100 "
                            id="gender"
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1" htmlFor="age">
                            Age
                        </label>
                        <input
                            className="w-full px-3 py-2 border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black  bg-gray-100"
                            type="number"
                            id="age"
                            name="age"
                            value={form.age}
                            onChange={handleChange}
                            min="1"
                            max={120} // Assuming a realistic age range
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1" htmlFor="phoneNumber">
                            Phone Number
                        </label>
                        <input
                            className="w-full px-3 py-2 border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black bg-gray-100"
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            minLength={10}
                            maxLength={10}
                            required
                            pattern="[0-9]{10}"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1" htmlFor="weight">
                            Weight (kg)
                        </label>
                        <input
                            className="w-full px-3 py-2 border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black bg-gray-100"
                            type="number"
                            id="weight"
                            name="weight"
                            value={form.weight}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded font-semibold text-md"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    </>
    );
};

export default RegisterPatient;