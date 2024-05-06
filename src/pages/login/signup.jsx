import React, { useState, useEffect } from "react";
import Select from "react-select";
import { BsEye, BsEyeSlash } from "react-icons/bs"; // Import eye icons from react-icons
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const fetchData = async () => {
    try {
      const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/employees/");
      setEmployeeData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match",{
        position: "top-center",
        autoClose: 1000,
        style: {
          width: "auto",
          style: "flex justify-center",
        },
        closeButton: false,
        progress: undefined,
        hideProgressBar:true
      })
      return;
    }
    try {
      const data = {
        username: employeeName,
        password: password,
        role: role.label,
      };
     
      console.log(data);
      const response = await axios.post("https://techno.pythonanywhere.com/webapp/sign-up/", data);
      console.log(response);
      toast.success(response.data.message,{
        position: "top-center",
        autoClose: 1000,
        style: {
          width: "auto",
          style: "flex justify-center",
        },
        closeButton: false,
        progress: undefined,
        hideProgressBar:true
      })
      
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full px-8 py-6 bg-white shadow-md rounded-lg">
        <form className="space-y-6" onSubmit={submitHandler}>
          <div>
            <label htmlFor="employeeName" className="block text-lg font-medium text-gray-700">
              User Name:
            </label>
            <input
              type="text"
              name="employeeName"
              id="employeeName"
              required
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="mt-1 block w-full border border-gray-400 py-2 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
            />
          </div>
          <ToastContainer className="z-[10001]"/>
          <div>
            <label htmlFor="role" className="block text-lg font-medium text-gray-700">
              Role:
            </label>
            <Select
              options={[
                { value: "supervisor", label: "Supervisor" },
                { value: "user", label: "User" },
                { value: "admin", label: "Admin" }
              ]}
              value={role}
              onChange={(selectedOption) => setRole(selectedOption)}
              placeholder="Select Role"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-700">
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-400 py-2 rounded-md shadow-sm focus:ring focus:ring-indigo-500 pr-10" // Added paddingRight for the eye icon
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-3 bg-transparent focus:outline-none"
              >
                {showPassword ? <BsEyeSlash /> : <BsEye />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700">
              Confirm Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                required
                value={password}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-400 py-2 rounded-md shadow-sm focus:ring focus:ring-indigo-500 pr-10" // Added paddingRight for the eye icon
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-3 bg-transparent focus:outline-none"
              >
                {showPassword ? <BsEyeSlash /> : <BsEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
