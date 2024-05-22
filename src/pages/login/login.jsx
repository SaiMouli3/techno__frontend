import "./login.css";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/reducers/userReducers";
const Login = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/api/employees/`);
      setEmployeeData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);
  const dispatch = useDispatch()
   const submitHandler = async (e) => {
    e.preventDefault();
    try {
      
      const data = {
        username: employeeName,
        password: password,
        role: role.label,
      };
      const response = await axios.post(`${process.env.REACT_APP_URL}/webapp/api/check-credentials/`, data);
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 1000,
          style: {
            width: "auto",
            display: "flex",
            justifyContent: "center",
          },
          closeButton: false,
          progress: undefined,
          hideProgressBar: true,
        });

        const userData = {
          username: data.username,
          role: data.role
        };
        dispatch(userActions.setUserInfo(userData));
        localStorage.setItem('account', JSON.stringify(userData));
        navigate("/home");
      } else {
        toast.error(response.data.message, {
          position: "top-center",
          autoClose: 1000,
          style: {
            width: "auto",
            display: "flex",
            justifyContent: "center",
          },
          closeButton: false,
          progress: undefined,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
        autoClose: 1000,
        style: {
          width: "auto",
          display: "flex",
          justifyContent: "center",
        },
        closeButton: false,
        progress: undefined,
        hideProgressBar: true,
      });
    }
  };


  return (
    <div className="flex justify-center flex-col items-center h-screen">
      
      <div className="max-w-md w-full px-8 py-6 bg-white shadow-md rounded-lg">
        <form className="space-y-6" onSubmit={submitHandler} method="post">
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
          <ToastContainer className="z-[100001]"/>
          <div>
            <label htmlFor="role" className="block text-lg font-medium text-gray-700">
              Role:
            </label>
            <Select
              options={[
                { value: "supervisor", label: "Supervisor" },
                { value: "incharge", label: "Incharge" },
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
            className="w-full bg-indigo-600 text-white py-3  rounded-md hover:bg-indigo-700"
          >
            Sign In
          </button>
         
        </form>
      </div>
      {/* <div>
         <button
            onClick={()=>navigate("/sign-up")}
            className="w-full bg-indigo-600 px-10 font-semibold text-white py-3 my-5 rounded-md hover:bg-indigo-700"
          >
             Register user
          </button>
      </div> */}
    </div>
  );
};

export default Login;
