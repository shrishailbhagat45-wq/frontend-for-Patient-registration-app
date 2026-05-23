import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { FiEdit, FiTrash2 } from "react-icons/fi";

import { getServices, addService, updateService, deleteService as deleteServiceAPI } from "../API/billing";

// ======================
// ZOD SCHEMA
// ======================

const serviceSchema = z.object({
  serviceName: z.string().min(3, "Service name must be at least 3 characters"),

  actualPrice: z
    .number({
      invalid_type_error: "Actual price is required",
    })
    .min(0, "Actual price must be at least 0"),

  sellingPrice: z
    .number({
      invalid_type_error: "Selling price is required",
    })
    .min(1, "Selling price must be greater than 0"),
});

export default function Services() {
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
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceName: "",
      actualPrice: "",
      sellingPrice: "",
    },
  });

  // ======================
  // GET SERVICES
  // ======================

  const clinicId = localStorage.getItem("clinicId");

  const {
    data: services = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["services", clinicId],
    queryFn: () => getServices(clinicId),
    enabled: !!clinicId,
  });

  // ======================
  // ADD SERVICE
  // ======================

  const addServiceMutation = useMutation({
    mutationFn: addService,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["services", clinicId],
      });

      reset({
        serviceName: "",
        actualPrice: "",
        sellingPrice: "",
      });
    },

    onError: (error) => {
      console.log(error);
    },
  });

  // ======================
  // UPDATE SERVICE
  // ======================

  const updateServiceMutation = useMutation({
    mutationFn: ({ id, data }) => updateService(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["services", clinicId],
      });

      reset({
        serviceName: "",
        actualPrice: "",
        sellingPrice: "",
      });
      setEditId(null);
    },

    onError: (error) => {
      console.log(error);
    },
  });

  // ======================
  // DELETE SERVICE
  // ======================

  const deleteServiceMutation = useMutation({
    mutationFn: deleteServiceAPI,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["services", clinicId],
      });
    },

    onError: (error) => {
      console.log(error);
    },
  });

  // ======================
  // SUBMIT
  // ======================

  function onSubmit(data) {
    if (editId !== null) {
      updateServiceMutation.mutate({
        id: editId,
        data,
      });
    } else {
      addServiceMutation.mutate(data);
    }
  }

  // ======================
  // DELETE SERVICE
  // ======================

  function deleteService(id) {
    if (window.confirm("Are you sure you want to delete this service?")) {
      deleteServiceMutation.mutate(id);
    }
  }

  // ======================
  // EDIT SERVICE
  // ======================

  function editService(service) {
    reset({
      serviceName: service.serviceName,
      actualPrice: service.actualPrice,
      sellingPrice: service.sellingPrice,
    });
    setEditId(service._id);
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ====================== */}
        {/* FORM CARD */}
        {/* ====================== */}

        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-2xl font-bold text-slate-800 mb-5">
            Services Management
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            {/* ====================== */}
            {/* SERVICE NAME */}
            {/* ====================== */}

            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder=" "
                  {...register("serviceName")}
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
                  Service Name
                </label>
              </div>

              {errors.serviceName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.serviceName.message}
                </p>
              )}
            </div>

            {/* ====================== */}
            {/* ACTUAL PRICE */}
            {/* ====================== */}

            <div>
              <div className="relative">
                <input
                  type="number"
                  placeholder=" "
                  {...register("actualPrice", {
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
                  Actual Price
                </label>
              </div>

              {errors.actualPrice && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.actualPrice.message}
                </p>
              )}
            </div>

            {/* ====================== */}
            {/* SELLING PRICE */}
            {/* ====================== */}

            <div>
              <div className="relative">
                <input
                  type="number"
                  placeholder=" "
                  {...register("sellingPrice", {
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
                  Selling Price
                </label>
              </div>

              {errors.sellingPrice && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sellingPrice.message}
                </p>
              )}
            </div>

            {/* ====================== */}
            {/* BUTTON */}
            {/* ====================== */}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={addServiceMutation.isPending || updateServiceMutation.isPending}
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
                {addServiceMutation.isPending || updateServiceMutation.isPending
                  ? editId !== null
                    ? "Updating..."
                    : "Adding..."
                  : editId !== null
                    ? "Update"
                    : "Add Service"}
              </button>

              {editId !== null && (
                <button
                  type="button"
                  onClick={() => {
                    reset({
                      serviceName: "",
                      actualPrice: "",
                      sellingPrice: "",
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
                  <th className="text-left px-4 py-3">Service Name</th>

                  <th className="text-left px-4 py-3">Actual Price</th>

                  <th className="text-left px-4 py-3">Selling Price</th>

                  <th className="text-center px-4 py-3">Actions</th>
                </tr>
              </thead>

              {/* TABLE BODY */}

              <tbody className="text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8">
                      Loading...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-red-500">
                      Failed to fetch services
                    </td>
                  </tr>
                ) : services.length > 0 ? (
                  services.map((service) => (
                    <tr
                      key={service._id}
                      className="
                      border-b
                      hover:bg-slate-50
                    "
                    >
                      <td className="px-4 py-3">{service.serviceName}</td>

                      <td className="px-4 py-3">₹ {service.actualPrice}</td>

                      <td className="px-4 py-3">₹ {service.sellingPrice}</td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          {/* EDIT BUTTON */}

                          <button
                            onClick={() => editService(service)}
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
                            onClick={() => deleteService(service._id)}
                            disabled={deleteServiceMutation.isPending}
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
                      colSpan="4"
                      className="
                      text-center
                      py-8
                      text-slate-500
                      text-sm
                    "
                    >
                      No services added yet
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
