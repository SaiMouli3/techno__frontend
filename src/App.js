import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { useStateContext } from "./context/ContextProvider";
import Navbarr from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/home/home";
import Employee from "./pages/employees/employees";
import Machine from "./pages/machines/machine";
import Job from './pages/jobs/job';
import Tool from "./pages/tools/tool";
import BreakDown from "./pages/breakdown/breakdowns";
import Homepage from "./pages/home/homepage";
import ToolCharts from "./pages/Toolchart/ToolCharts";
import Jobs from "./pages/jobs/jobs";
import Daily from "./pages/Daily/dailyy";
import Charts from "./pages/chart2/chart"
import Resolve from './pages/breakdown/Resolve'
import DailyTable from "./pages/Daily/DailyTable";
import DailyEfficiency from "./pages/Daily/DailyEfficiency";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/login/login";
import SignUp from "./pages/login/signup";
import AddUser from "./pages/login/AddUser";
import CollapsibleTablePage from "./pages/Daily/DailyReport";
import Parameter from "./pages/Daily/Parameter";

const App = () => {
  const dispatch = useDispatch();
  const { currentMode, activeMenu } = useStateContext();
  const user = useSelector((state) => state.user);
  const loggedInUser = localStorage.getItem("account");
  // const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in from localStorage and dispatch necessary actions
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      console.log("Yess")
      dispatch({ type: "SET_USER_INFO", payload: userData });
    } else {
      // navigate("/login");
    }
  }, [dispatch, loggedInUser]);
  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <BrowserRouter>
        <div className="flex relative bg-main-dark-bg">
          {activeMenu && loggedInUser ? (
            <div className="w-72 fixed z-[100001] sidebar ">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 ">
              <Sidebar />
            </div>
          )}
          <div
            className={
              activeMenu && loggedInUser
                ? "bg-main-dark-bg min-h-screen overflow-x-auto md:ml-72 w-full "
                : "bg-main-dark-bg  w-full min-h-screen flex-2 "
            }
          >
            {loggedInUser && <div className="fixed md:static bg-main-dark-bg navbar w-full ">
              <Navbarr />
            </div>}
            <div>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/toolchart" element={<ToolCharts />} />
                {user?.userInfo?.role === "Admin" && (
  <>
    <Route path="/employees" element={<Employee />} />
    <Route path="/jobs" element={<Job />} />
    <Route path="/tools" element={<Tool />} />
    <Route path="/breakdown" element={<BreakDown />} />
    <Route path="/job" element={<Jobs />} />
    <Route path="/dailyentry" element={<Daily />} />
    <Route path="/daily-report" element={<CollapsibleTablePage/>}/>
    <Route path="/dailyentrytable" element={<DailyTable />} />
    <Route path="/dailyentryefficiency" element={<DailyEfficiency />} />
    <Route path="/machines" element={<Machine />} />
    <Route path="/chart2" element={<Charts />} />
    <Route path="/resolve" element={<Resolve />} />
    <Route path="/parameters" element={<Parameter/>}/>
  </>
)}

{user?.userInfo?.role === "Supervisor" && (
  <>
    <Route path="/dailyentry" element={<Daily />} />
    <Route path="/daily-report" element={<CollapsibleTablePage/>}/>
    <Route path="/dailyentrytable" element={<DailyTable />} />
    <Route path="/dailyentryefficiency" element={<DailyEfficiency />} />
    <Route path="/machines" element={<Machine />} />
    <Route path="/chart2" element={<Charts />} />
  </>
)}
{user?.userInfo?.role === "Incharge" && (
  <>
    <Route path="/tools" element={<Tool />} />
    <Route path="/breakdown" element={<BreakDown />} />
    <Route path="/resolve" element={<Resolve />} />
    <Route path="/chart2" element={<Charts />} />
    <Route path="/analytics" element="Analytics" />
    <Route path="/reports" element="Reports" />
    <Route path="/employees" element={<Employee />} />
    <Route path="/jobs" element={<Job />} />
    <Route path="/machines" element={<Machine />} />
  </>
)}
  <Route path="/sign-up" element={<SignUp />} />

                <Route path="/home" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
{user?.userInfo?.role === "Admin" &&                            <Route path="/add-user" element={<AddUser/>}/>}
                <Route
                  path="/"
                  element={
                    loggedInUser ? (
                      <Navigate to="/home" />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
