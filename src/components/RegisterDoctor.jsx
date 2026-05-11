import { addDoctor, getDoctor } from "../API/user";
import {
  FiUserPlus,
  FiMail,
  FiLock,
  FiShield,
  FiUsers,
  FiTrash2,
  FiPhone,
} from "react-icons/fi";
import { MdOutlineMedicalServices } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const SPECIALIZATIONS = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "Psychiatrist",
  "Gynecologist",
  "ENT Specialist",
  "Ophthalmologist",
  "Dentist",
  "Other",
];

const doctorSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Email is invalid")
    .trim(),

  password: z.string().min(1, "Password is required"),

  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[\d\s\-]{7,15}$/, "Phone number is invalid")
    .trim(),

  specialization: z.string().min(1, "Specialization is required"),

  role: z.literal("Doctor"),
});

export default function RegisterDoctor() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchSpecializations, setSearchSpecializations] = useState([]);
  const [searchOn, setSearchOn] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      specialization: "",
      role: "Doctor",
    },
  });

  // Fetch doctors
  const {
    data: doctors = [],
    isLoading: loading,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const res = await getDoctor(localStorage.getItem("doctorId"));

      const data = res?.data ?? res ?? [];

      return Array.isArray(data) ? data : [];
    },
    onError: (err) => {
      console.error("Failed to load doctors", err);
    },
  });

  // Add doctor
  const addMutation = useMutation({
    mutationFn: async (payload) => {
      return await addDoctor(payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });

      reset();

      setSearchSpecializations([]);
      setSearchOn(false);
    },

    onError: (err) => {
      console.error("Failed to add doctor", err);

      alert("Failed to add doctor");
    },
  });

  const onSubmit = (data) => {
    addMutation.mutate(data);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this doctor?")) return;

    queryClient.setQueryData(["doctors"], (old) =>
      old.filter((d) => d.id !== id)
    );
  };

  // Search specialization
  const handleSearch = (e) => {
    const value = e.target.value;

    setValue("specialization", value);

    if (!value.trim()) {
      setSearchSpecializations([]);
      setSearchOn(false);
      return;
    }

    setSearchOn(true);

    const results = SPECIALIZATIONS.filter((spec) =>
      spec.toLowerCase().includes(value.toLowerCase())
    );

    setSearchSpecializations(results);
  };

  // Select specialization
  const handleSelectSpecialization = (value) => {
    setValue("specialization", value);

    setSearchSpecializations([]);

    setSearchOn(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mt-4 gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <MdOutlineMedicalServices className="text-blue-600 text-2xl" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-800">
              Doctor Management
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Register and manage clinic doctors
            </p>
          </div>
        </div>
      </div>

      {/* Register Form */}
      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FiUserPlus className="text-blue-600 text-lg" />

          <h3 className="text-lg font-semibold text-slate-800">
            Register Doctor
          </h3>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Name */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-slate-700 mb-1.5">
              Name *
            </span>

            <input
              {...register("name")}
              placeholder="Enter full name"
              className={`border rounded-md px-3 py-2 text-sm ${
                errors.name ? "border-red-400" : "border-slate-300"
              }`}
            />

            {errors.name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </label>

          {/* Email */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-slate-700 mb-1.5">
              Email *
            </span>

            <input
              {...register("email")}
              type="email"
              placeholder="email@example.com"
              className={`border rounded-md px-3 py-2 text-sm ${
                errors.email ? "border-red-400" : "border-slate-300"
              }`}
            />

            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </label>

          {/* Password */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-slate-700 mb-1.5">
              Password *
            </span>

            <input
              {...register("password")}
              type="password"
              placeholder="Enter password"
              className={`border rounded-md px-3 py-2 text-sm ${
                errors.password ? "border-red-400" : "border-slate-300"
              }`}
            />

            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </label>

          {/* Phone */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-slate-700 mb-1.5">
              Phone Number *
            </span>

            <input
              {...register("phoneNumber")}
              type="tel"
              placeholder="+91 98765 43210"
              className={`border rounded-md px-3 py-2 text-sm ${
                errors.phoneNumber
                  ? "border-red-400"
                  : "border-slate-300"
              }`}
            />

            {errors.phoneNumber && (
              <p className="text-xs text-red-500 mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </label>

          {/* Specialization */}
          <label className="flex flex-col relative">
            <span className="text-sm font-medium text-slate-700 mb-1.5">
              Specialization *
            </span>

            <input
              type="text"
              {...register("specialization")}
              onChange={handleSearch}
              placeholder="Search specialization"
              className={`border rounded-md px-3 py-2 text-sm ${
                errors.specialization
                  ? "border-red-400"
                  : "border-slate-300"
              }`}
            />

            {/* Search Results */}
            {searchOn && (
              <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg z-20 max-h-48 overflow-y-auto">
                {searchSpecializations.length > 0 ? (
                  searchSpecializations.map((item) => (
                    <div
                      key={item}
                      onClick={() =>
                        handleSelectSpecialization(item)
                      }
                      className="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer"
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-slate-400">
                    No specialization found
                  </div>
                )}
              </div>
            )}

            {errors.specialization && (
              <p className="text-xs text-red-500 mt-1">
                {errors.specialization.message}
              </p>
            )}
          </label>

          {/* Role */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-slate-700 mb-1.5">
              Role
            </span>

            <input
              {...register("role")}
              readOnly
              className="border border-slate-200 rounded-md px-3 py-2 text-sm bg-slate-50 text-slate-500"
            />
          </label>

          {/* Submit */}
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium text-sm disabled:opacity-50"
            >
              {addMutation.isPending ? "Adding..." : "Add Doctor"}
            </button>
          </div>
        </form>
      </section>

      {/* Doctors List */}
      <section className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <FiUsers className="text-blue-600" />
            Registered Doctors
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {doctors.length} doctor(s)
          </p>
        </div>

        <ul className="divide-y divide-slate-100">
          {loading ? (
            <li className="px-6 py-8 text-center text-sm text-slate-400">
              Loading...
            </li>
          ) : doctors.length === 0 ? (
            <li className="px-6 py-8 text-center text-sm text-slate-400">
              No doctors registered
            </li>
          ) : (
            doctors.map((d) => (
              <li
                key={d.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50"
              >
                <div>
                  <div className="font-medium text-slate-800">
                    {d.name}
                  </div>

                  <div className="text-sm text-slate-500 mt-1">
                    {d.email} • {d.phoneNumber} •{" "}
                    {d.specialization}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(d.id)}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm flex items-center gap-1"
                >
                  <FiTrash2 />
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}