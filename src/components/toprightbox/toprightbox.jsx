import "./topright.css";
import axios from "axios";
import { useState, useEffect } from "react";

const TopRightbox = () => {
  const [leastEmployees, setLeastEmployees] = useState([]);

  useEffect(() => {
    fetchLeastEmployees();
  }, []);

  const fetchLeastEmployees = async () => {
    try {
      const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/least_employee");
      setLeastEmployees(response.data);
    } catch (error) {
      console.error("Error fetching least employees:", error);
    }
  };

  return (
    <div className="toprightBox">
      <h1>Top Least Employees</h1>
      <div className="list">
        {leastEmployees.map((employee, index) => (
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
    </div>
  );
};

export default TopRightbox;
