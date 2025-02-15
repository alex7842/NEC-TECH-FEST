import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const UserDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: location.state?.name || "",
    email: location.state?.email || "",
    college: location.state?.college || "",
    phone: location.state?.phone || "",
    department: location.state?.department || "",
    city: "",
    year: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isPhoneValid = userData.phone.length === 10 && /^\d+$/.test(userData.phone);
  const isFormValid =
    userData.name &&
    userData.email &&
    userData.college &&
    isPhoneValid &&
    userData.department &&
    userData.city &&
    userData.year;

  const handleNext = async (e) => {
    e.preventDefault();
    try {
      if (isFormValid) {
        const response = await axios.get("http://localhost:5200/api/user/validateuser", { params: userData });
        if (response.data.message === "User Created Successfully") {
          navigate("/registration/eventselection", { state: userData });
        } else {
          setModalMessage("An error occurred. Please try again.");
          setShowModal(true);
        }
      }
    } catch (err) {
      if (err.message === "Network Error") {
        setModalMessage("Network Error. Please try again.");
        setShowModal(true);
      }
      else if (err.response.data === "Too many requests from the same IP, please try again after 5 minute.") {
        setModalMessage(err.response.data || "An error occurred. Please try again.");
        setShowModal(true);
      }
      else if (err.response) {
        setModalMessage(err?.response?.data?.message || "An error occurred. Please try again.");
        setShowModal(true);
      }
      console.log(err);
    }
  };

  return (
    <motion.div className="min-h-screen flex flex-col items-center p-4 sm:p-8 bg-gradient-to-br from-[#1E0F2D] via-[#2A1B3D] to-[#14092A] text-purple-200">
      <div className="relative z-10 w-full max-w-4xl px-4 sm:px-6 py-12">
        <motion.div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold bg-gradient-to-r from-purple-300 via-pink-400 to-purple-100 text-transparent bg-clip-text mb-4">
            Registration Form
          </h1>
        </motion.div>
        <motion.div className="bg-[#2A1B3D] rounded-xl p-6 sm:p-8 shadow-2xl border border-purple-700/30">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-100 mb-8 text-center">
            User Details
          </h2>
          <form className="space-y-6">
            {["name", "email", "college", "phone", "city"].map((field) => (
              <div key={field}>
                <label className="block text-purple-300 font-semibold mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={userData[field]}
                  onChange={handleChange}
                  maxLength={field === "phone" ? "10" : undefined}
                  className="w-full bg-[#3B2A4F] border rounded-lg px-4 py-3 text-purple-200 focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            ))}

            <div>
              <label className="block text-purple-300 font-semibold mb-2">Department</label>
              <select
                name="department"
                value={userData.department}
                onChange={handleChange}
                className="w-full bg-[#3B2A4F] border rounded-lg px-4 py-3 text-purple-200 focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Department</option>
                {["CSE", "IT", "AI&DS", "EEE", "ECE", "MECH", "CIVIL", "ARTS & SCIENCE", "Others"].map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-purple-300 font-semibold mb-2">Year</label>
              <select
                name="year"
                value={userData.year}
                onChange={handleChange}
                className="w-full bg-[#3B2A4F] border rounded-lg px-4 py-3 text-purple-200 focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Year</option>
                {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleNext}
              disabled={!isFormValid}
              className="w-full py-4 px-6 rounded-xl text-xl font-bold bg-purple-700 text-white hover:bg-purple-800 disabled:bg-gray-600">
              Proceed to Events
            </button>
          </form>
        </motion.div>
      </div>

      {/* Modal for Errors */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-red-600">Error</h3>
            <p className="text-gray-700 mt-2">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserDetails;
