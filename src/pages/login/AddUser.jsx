import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddUser = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        username: username,
        password: password,
        role: role,
      };
      // Send the userData to your backend to add the user
      // Example: axios.post("/api/addUser", userData);
      // Assuming you have a backend route to handle adding users

      // For demonstration purposes, simulate success with a toast message
      toast.success("User added successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });

      // Clear form fields after successful submission
      setUsername("");
      setPassword("");
      setRole("");
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user. Please try again later.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full px-8 py-6 bg-white shadow-md rounded-lg">
        <form className="space-y-6" onSubmit={handleSubmit} method="post">
          <div>
            <label htmlFor="username" className="block text-lg font-medium text-gray-700">
              Username:
            </label>
            <input
              type="text"
              name="username"
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full border border-gray-400 py-2 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-lg font-medium text-gray-700">
              Role:
            </label>
            <input
              type="text"
              name="role"
              id="role"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full border border-gray-400 py-2 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
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
            Add User
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddUser;
