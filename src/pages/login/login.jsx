import "./login.css";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

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

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const data = {
        username: employeeName,
        password: password,
        role: role.label,
      };
      console.log(data)
      const response = await axios.post("https://techno.pythonanywhere.com/webapp/login/", data);
      console.log(response);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full px-8 py-6 bg-white shadow-md rounded-lg">
        <form className="space-y-6" onSubmit={submitHandler} method="post">
          <div>
            <label htmlFor="employeeName" className="block text-lg font-medium text-gray-700">
              Employee SSN:
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
            <input
              type="password"
              name="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-400 py-2 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
            />
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

export default Login;
