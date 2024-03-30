import "./topbox.css";
import axios from "axios";
import { useState, useEffect } from "react";

const Topbox = () => {
  const [topEmployees, setTopEmployees] = useState([]);

  useEffect(() => {
    fetchTopEmployees();
  }, []);

  const fetchTopEmployees = async () => {
    try {
      const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/top_employees");
      setTopEmployees(response.data);
    } catch (error) {
      console.error("Error fetching top employees:", error);
    }
  };

  return (
    <div className="topBox">
      <h1>Top Most Employees</h1>
      <div className="list">
        {topEmployees.map((employee, index) => (
          <div className="listItem" key={index}>
            <div className="user">
              <div className="userTexts">
                <span className="username">{employee.emp_name}</span>
                <span className="email">{employee.emp_ssn}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h2>Performance</h2>
    </div>
  );
};

export default Topbox;
