import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* =========================
   ZOD SCHEMA
========================= */
const clinicSchema = z.object({
  clinicName: z.string().min(2, "Clinic name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  phone: z.string().regex(/^[0-9]{10}$/, "Enter valid 10-digit phone"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  password: z.string().min(6, "Minimum 6 characters"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  address: z.string().optional(),
});

/* =========================
   FLOATING INPUT (FINAL FIX)
========================= */
function FloatingInput({
  label,
  register,
  name,
  error,
  type = "text",
  watch,
}) {
  const [isFocused, setIsFocused] = useState(false);

  const value = watch(name); // ✅ RHF controls value
  const isActive = isFocused || value;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type={type}
          {...register(name)}
          placeholder=" "
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full border rounded-lg px-3 pt-5 pb-2 text-sm bg-white
          focus:outline-none focus:ring-2 transition-all
          ${
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-slate-200 focus:ring-blue-500"
          }`}
        />

        <label
          className={`absolute left-3 px-1 bg-white transition-all pointer-events-none
          ${
            isActive
              ? "top-1 text-xs text-blue-600"
              : "top-3.5 text-sm text-slate-400"
          }`}
        >
          {label}
        </label>
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1">{error.message}</p>
      )}
    </div>
  );
}

/* =========================
   MAIN COMPONENT
========================= */
export default function CreateClinic() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch, // ✅ IMPORTANT
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      clinicName: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      city: "",
      state: "",
      address: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await CreateClinic(data);

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      alert("Clinic created successfully!");

    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100">
      <div className="w-full max-w-md px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            HealSync360
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Start managing your clinic in seconds
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100"
        >
          <h2 className="text-lg font-semibold mb-6">
            Create your clinic
          </h2>

          <div className="mb-4">
            <FloatingInput
              label="Clinic Name"
              name="clinicName"
              register={register}
              error={errors.clinicName}
              watch={watch}
            />
          </div>

          <div className="flex gap-3 mb-4">
            <FloatingInput
              label="First Name"
              name="firstName"
              register={register}
              error={errors.firstName}
              watch={watch}
            />
            <FloatingInput
              label="Last Name"
              name="lastName"
              register={register}
              error={errors.lastName}
              watch={watch}
            />
          </div>

          <div className="mb-4">
            <FloatingInput
              label="Phone Number"
              name="phone"
              register={register}
              error={errors.phone}
              watch={watch}
            />
          </div>

          <div className="mb-4">
            <FloatingInput
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              watch={watch}
            />
          </div>

          <div className="mb-4">
            <FloatingInput
              label="Password"
              name="password"
              type="password"
              register={register}
              error={errors.password}
              watch={watch}
            />
          </div>

          <div className="flex gap-3 mb-4">
            <FloatingInput
              label="City"
              name="city"
              register={register}
              error={errors.city}
              watch={watch}
            />
            <FloatingInput
              label="State (optional)"
              name="state"
              register={register}
              error={errors.state}
              watch={watch}
            />
          </div>

          <div className="mb-4">
            <FloatingInput
              label="Address (optional)"
              name="address"
              register={register}
              error={errors.address}
              watch={watch}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium 
            hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
          >
            {loading ? "Creating..." : "Create Clinic & Continue →"}
          </button>

          <p className="text-xs text-center text-slate-400 mt-4">
            Try 7 days for free • No credit card required
          </p>
        </form>
      </div>
    </div>
  );
}