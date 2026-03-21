import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { IoArrowBack } from "react-icons/io5";
import {
  FiUser,
  FiMail,
  FiShield,
  FiEdit2,
  FiSave,
  FiX,
  FiLock,
  FiPhone,
  FiCalendar,
  FiBriefcase,
} from "react-icons/fi";
import { getUserById,updateUser,updatePassword } from "../API/user";

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get user data from localStorage (set during login)
  const [user, setUser] = useState({});

  const [editForm, setEditForm] = useState({ ...user });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const res=await getUserById(localStorage.getItem("Id"));
    if(res){
      const userData = res;
      setUser(userData);
      setEditForm(userData);
    }
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateUser(editForm);
      setUser(editForm);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // Validate passwords
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await updatePassword(passwordForm);
      console.log("updatePassword response:", res);
      if(res && res.success){
        setIsChangingPassword(false);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        toast.success("Password changed successfully!");
      } else{
        toast.error(res.error || "Failed to change password");
      }
    } catch (error) {
      console.error("Failed to change password", error);
      toast.error(`${error.response?.data?.message || "Failed to change password"}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditForm({ ...user });
    setIsEditing(false);
  };

  const cancelPasswordChange = () => {
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
    setIsChangingPassword(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 pt-16 sm:pt-20 px-3 sm:px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4 text-xs sm:text-sm"
            >
              <IoArrowBack className="text-base" />
              <span>Back to Home</span>
            </button>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">My Profile</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              View and manage your account details
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-6 sm:py-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div className="text-white">
                  <h3 className="text-lg sm:text-xl font-semibold">{user.name || "User"}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <FiShield className="text-blue-200" />
                    <span className="text-blue-100 text-xs sm:text-sm">{user.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-4 sm:p-6">
              {!isEditing ? (
                /* View Mode */
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-800 uppercase tracking-wide">
                      Account Information
                    </h4>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <FiEdit2 className="text-sm" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="p-2 bg-white rounded-md flex-shrink-0">
                        <FiUser className="text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Full Name</p>
                        <p className="text-sm font-medium text-slate-800 mt-0.5 break-words">{user.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="p-2 bg-white rounded-md flex-shrink-0">
                        <FiMail className="text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Email</p>
                        <p className="text-sm font-medium text-slate-800 mt-0.5 break-all">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="p-2 bg-white rounded-md flex-shrink-0">
                        <FiPhone className="text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Phone</p>
                        <p className="text-sm font-medium text-slate-800 mt-0.5">
                          {user.phoneNumber || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="p-2 bg-white rounded-md flex-shrink-0">
                        <FiBriefcase className="text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Specialization</p>
                        <p className="text-sm font-medium text-slate-800 mt-0.5">
                          {user.specialization || user.speciality || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="p-2 bg-white rounded-md flex-shrink-0">
                        <FiCalendar className="text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Joined</p>
                        <p className="text-sm font-medium text-slate-800 mt-0.5">
                          {new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
                      Edit Information
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="text-slate-400 text-sm" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-800 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="text-slate-400 text-sm" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-800 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiPhone className="text-slate-400 text-sm" />
                        </div>
                        <input
                          type="tel"
                          name="phoneNumber"
                          minLength={10}
                          maxLength={10}
                          pattern="[0-9]{10}"
                          value={editForm.phoneNumber}
                          onChange={handleEditChange}
                          placeholder="Enter phone number"
                          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-800 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Specialization
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiBriefcase className="text-slate-400 text-sm" />
                        </div>
                        <input
                          type="text"
                          name="specialization"
                          value={editForm.specialization || ""}
                          onChange={handleEditChange}
                          placeholder="Enter your specialization"
                          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-800 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                    <button
                      onClick={cancelEdit}
                      className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors flex items-center justify-center sm:justify-start gap-1.5"
                    >
                      <FiX className="text-sm" />
                      <span className="hidden sm:inline">Cancel</span>
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      type="submit"
                      className="px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center sm:justify-start gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiSave className="text-sm" />
                      {loading ? "Saving..." : <span className="hidden sm:inline">Save Changes</span>}
                      {loading && <span className="sm:hidden">Saving...</span>}
                      {!loading && <span className="sm:hidden">Save</span>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Password Section */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6">
              {!isChangingPassword ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-md">
                      <FiLock className="text-slate-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">Password</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Last changed: Not available
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-slate-100 rounded-md">
                      <FiLock className="text-slate-500" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800">Change Password</h4>
                  </div>

                  {passwordError && (
                    <div className="px-3 py-2 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                      {passwordError}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-800 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password (min 6 characters)"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-800 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-slate-800 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={cancelPasswordChange}
                      className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1.5"
                    >
                      <FiX className="text-sm" />
                      Cancel
                    </button>
                    <button
                      onClick={handleChangePassword}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiLock className="text-sm" />
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Logout Section */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Sign Out</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sign out from your account on this device
                  </p>
                </div>
                <button
                  onClick={() => {
                    localStorage.clear();
                    toast.success("Logged out successfully");
                    navigate("/login");
                  }}
                  className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
