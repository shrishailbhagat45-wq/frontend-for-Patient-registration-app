import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { FiEdit, FiTrash2 } from "react-icons/fi";

import {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine as deleteMedicineAPI,
} from "../API/billing";

// ======================
// ZOD SCHEMA
// ======================

const medicineSchema = z.object({
  medicineName: z.string().min(2, "Medicine name must be at least 2 characters"),

  quantity: z
    .number({
      invalid_type_error: "Quantity is required",
    })
    .min(0, "Quantity must be at least 0"),

  actualPricePerTablet: z
    .number({
      invalid_type_error: "Actual price per tablet is required",
    })
    .min(0, "Actual price per tablet must be at least 0"),

  sellingPricePerTablet: z
    .number({
      invalid_type_error: "Selling price per tablet is required",
    })
    .min(1, "Selling price per tablet must be greater than 0"),
});

export default function Medicines() {
  // ======================
  // STATES
  // ======================

  const [editId, setEditId] = useState(null);

  // ======================
  // QUERY CLIENT
  // ======================

  const queryClient = useQueryClient();

  // ======================
  // REACT HOOK FORM
  // ======================

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      medicineName: "",
      quantity: "",
      actualPricePerTablet: "",
      sellingPricePerTablet: "",
    },
  });

  // ======================
  // GET MEDICINES
  // ======================

  const clinicId = localStorage.getItem("clinicId");

  const {
    data: medicines = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["medicines", clinicId],
    queryFn: () => getMedicines(clinicId),
    enabled: !!clinicId,
  });

  // ======================
  // ADD MEDICINE
  // ======================

  const addMedicineMutation = useMutation({
    mutationFn: addMedicine,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medicines", clinicId],
      });

      reset({
        medicineName: "",
        quantity: "",
        actualPricePerTablet: "",
        sellingPricePerTablet: "",
      });

      toast.success("Medicine added successfully!");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Error adding medicine");
    },
  });

  // ======================
  // UPDATE MEDICINE
  // ======================

  const updateMedicineMutation = useMutation({
    mutationFn: ({ id, data }) => updateMedicine(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medicines", clinicId],
      });

      reset({
        medicineName: "",
        quantity: "",
        actualPricePerTablet: "",
        sellingPricePerTablet: "",
      });
      setEditId(null);

      toast.success("Medicine updated successfully!");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Error updating medicine");
    },
  });

  // ======================
  // DELETE MEDICINE
  // ======================

  const deleteMedicineMutation = useMutation({
    mutationFn: deleteMedicineAPI,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medicines", clinicId],
      });

      toast.success("Medicine deleted successfully!");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Error deleting medicine");
    },
  });

  // ======================
  // SUBMIT
  // ======================

  function onSubmit(data) {
    if (editId !== null) {
      updateMedicineMutation.mutate({
        id: editId,
        data,
      });
    } else {
      addMedicineMutation.mutate(data);
    }
  }

  // ======================
  // DELETE MEDICINE HANDLER
  // ======================

  function deleteMedicine(id) {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      deleteMedicineMutation.mutate(id);
    }
  }

  // ======================
  // EDIT MEDICINE
  // ======================

  function editMedicine(medicine) {
    reset({
      medicineName: medicine.medicineName,
      quantity: medicine.quantity,
      actualPricePerTablet: medicine.actualPricePerTablet,
      sellingPricePerTablet: medicine.sellingPricePerTablet,
    });
    setEditId(medicine._id);
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* ====================== */}
        {/* FORM CARD */}
        {/* ====================== */}

        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-2xl font-bold text-slate-800 mb-5">
            Medicines Management
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-5 gap-4"
          >
            {/* ====================== */}
            {/* MEDICINE NAME */}
            {/* ====================== */}

            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder=" "
                  {...register("medicineName")}
                  className="
                  peer
                  w-full
                  border
                  border-slate-300
                  rounded-lg
                  px-3
                  pt-5
                  pb-1.5
                  text-sm
                  outline-none
                  focus:border-blue-500
                "
                />

                <label
                  className="
                  absolute left-3 top-1.5
                  text-xs text-slate-500
                  transition-all

                  peer-placeholder-shown:top-3
                  peer-placeholder-shown:text-sm
                  peer-placeholder-shown:text-slate-400

                  peer-focus:top-1.5
                  peer-focus:text-xs
                  peer-focus:text-blue-500
                "
                >
                  Medicine Name
                </label>
              </div>

              {errors.medicineName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.medicineName.message}
                </p>
              )}
            </div>

            {/* ====================== */}
            {/* QUANTITY */}
            {/* ====================== */}

            <div>
              <div className="relative">
                <input
                  type="number"
                  placeholder=" "
                  {...register("quantity", {
                    valueAsNumber: true,
                  })}
                  className="
                  peer
                  w-full
                  border
                  border-slate-300
                  rounded-lg
                  px-3
                  pt-5
                  pb-1.5
                  text-sm
                  outline-none
                  focus:border-blue-500
                "
                />

                <label
                  className="
                  absolute left-3 top-1.5
                  text-xs text-slate-500
                  transition-all

                  peer-placeholder-shown:top-3
                  peer-placeholder-shown:text-sm
                  peer-placeholder-shown:text-slate-400

                  peer-focus:top-1.5
                  peer-focus:text-xs
                  peer-focus:text-blue-500
                "
                >
                  Quantity
                </label>
              </div>

              {errors.quantity && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            {/* ====================== */}
            {/* ACTUAL PRICE PER TABLET */}
            {/* ====================== */}

            <div>
              <div className="relative">
                <input
                  type="number"
                  placeholder=" "
                  {...register("actualPricePerTablet", {
                    valueAsNumber: true,
                  })}
                  className="
                  peer
                  w-full
                  border
                  border-slate-300
                  rounded-lg
                  px-3
                  pt-5
                  pb-1.5
                  text-sm
                  outline-none
                  focus:border-blue-500
                "
                />

                <label
                  className="
                  absolute left-3 top-1.5
                  text-xs text-slate-500
                  transition-all

                  peer-placeholder-shown:top-3
                  peer-placeholder-shown:text-sm
                  peer-placeholder-shown:text-slate-400

                  peer-focus:top-1.5
                  peer-focus:text-xs
                  peer-focus:text-blue-500
                "
                >
                  Actual Price/Tablet
                </label>
              </div>

              {errors.actualPricePerTablet && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.actualPricePerTablet.message}
                </p>
              )}
            </div>

            {/* ====================== */}
            {/* SELLING PRICE PER TABLET */}
            {/* ====================== */}

            <div>
              <div className="relative">
                <input
                  type="number"
                  placeholder=" "
                  {...register("sellingPricePerTablet", {
                    valueAsNumber: true,
                  })}
                  className="
                  peer
                  w-full
                  border
                  border-slate-300
                  rounded-lg
                  px-3
                  pt-5
                  pb-1.5
                  text-sm
                  outline-none
                  focus:border-blue-500
                "
                />

                <label
                  className="
                  absolute left-3 top-1.5
                  text-xs text-slate-500
                  transition-all

                  peer-placeholder-shown:top-3
                  peer-placeholder-shown:text-sm
                  peer-placeholder-shown:text-slate-400

                  peer-focus:top-1.5
                  peer-focus:text-xs
                  peer-focus:text-blue-500
                "
                >
                  Selling Price/Tablet
                </label>
              </div>

              {errors.sellingPricePerTablet && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sellingPricePerTablet.message}
                </p>
              )}
            </div>

            {/* ====================== */}
            {/* BUTTON */}
            {/* ====================== */}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={
                  addMedicineMutation.isPending ||
                  updateMedicineMutation.isPending
                }
                className="
                flex-1
                h-[46px]
                bg-blue-600
                hover:bg-blue-700
                transition-all
                text-white
                rounded-lg
                text-sm
                font-medium
              "
              >
                {addMedicineMutation.isPending ||
                updateMedicineMutation.isPending
                  ? editId !== null
                    ? "Updating..."
                    : "Adding..."
                  : editId !== null
                    ? "Update"
                    : "Add Medicine"}
              </button>

              {editId !== null && (
                <button
                  type="button"
                  onClick={() => {
                    reset({
                      medicineName: "",
                      quantity: "",
                      actualPricePerTablet: "",
                      sellingPricePerTablet: "",
                    });
                    setEditId(null);
                  }}
                  className="
                  px-4
                  h-[46px]
                  bg-gray-600
                  hover:bg-gray-700
                  transition-all
                  text-white
                  rounded-lg
                  text-sm
                  font-medium
                "
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ====================== */}
        {/* TABLE */}
        {/* ====================== */}

        <div className="bg-white rounded-xl shadow-md mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* TABLE HEAD */}

              <thead className="bg-slate-800 text-white text-sm">
                <tr>
                  <th className="text-left px-4 py-3">Medicine Name</th>

                  <th className="text-left px-4 py-3">Quantity</th>

                  <th className="text-left px-4 py-3">Actual Price/Tablet</th>

                  <th className="text-left px-4 py-3">Selling Price/Tablet</th>

                  <th className="text-center px-4 py-3">Actions</th>
                </tr>
              </thead>

              {/* TABLE BODY */}

              <tbody className="text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      Loading...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-red-500">
                      Failed to fetch medicines
                    </td>
                  </tr>
                ) : medicines.length > 0 ? (
                  medicines.map((medicine) => (
                    <tr
                      key={medicine._id}
                      className="
                      border-b
                      hover:bg-slate-50
                    "
                    >
                      <td className="px-4 py-3">{medicine.medicineName}</td>

                      <td className="px-4 py-3">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          {medicine.quantity}
                        </span>
                      </td>

                      <td className="px-4 py-3">₹ {medicine.actualPricePerTablet}</td>

                      <td className="px-4 py-3">₹ {medicine.sellingPricePerTablet}</td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          {/* EDIT BUTTON */}

                          <button
                            onClick={() => editMedicine(medicine)}
                            className="
                            p-2
                            bg-yellow-100
                            text-yellow-600
                            rounded-md
                            hover:bg-yellow-200
                          "
                          >
                            <FiEdit size={16} />
                          </button>

                          {/* DELETE BUTTON */}

                          <button
                            onClick={() => deleteMedicine(medicine._id)}
                            disabled={deleteMedicineMutation.isPending}
                            className="
                            p-2
                            bg-red-100
                            text-red-600
                            rounded-md
                            hover:bg-red-200
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                          "
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="
                      text-center
                      py-8
                      text-slate-500
                      text-sm
                    "
                    >
                      No medicines added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
