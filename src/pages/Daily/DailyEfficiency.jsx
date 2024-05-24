import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import EmployeeIncentivePage from "./EmployeeIncentivePage";

const DailyEfficiency = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [empSSN, setEmpSSN] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [averageEfficiency, setAverageEfficiency] = useState(null);
  const [incentives, setIncentives] = useState([]);
  const [includeBaseIncentive, setIncludeBaseIncentive] = useState(false);

  const { data: dailyentry } = useQuery({
    queryKey: ["dailyentry"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/api/per/`);
        return response.data;
      } catch (error) {
        throw new Error("Error fetching data");
      }
    },
  });

  const { data: employeeSSNS } = useQuery({
    queryKey: ["dailyemployees"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/api/employees/`);
        return response.data;
      } catch (error) {
        throw new Error("Error fetching data");
      }
    },
  });

  useEffect(() => {
    const fetchIncentivesForAllEmployees = async () => {
      if (startDate && endDate) {
        const incentivePromises = employeeSSNS?.map(emp =>
          axios.get(`${process.env.REACT_APP_URL}/webapp/calculate-incentive/${emp.emp_ssn}/${startDate}/${endDate}/`)
        );
        const incentiveResponses = await Promise.all(incentivePromises);
        const incentivesData = incentiveResponses.map(res => res.data);
        setIncentives(incentivesData);
      }
      
    };

    fetchIncentivesForAllEmployees();
  }, [employeeSSNS, startDate, endDate]);

  const filterData = () => {
    if (!startDate || !endDate) return;
    const filteredData = dailyentry?.filter(
      (item) =>
        item.emp_ssn === empSSN.label &&
        new Date(item.date) >= new Date(startDate) &&
        new Date(item.date) <= new Date(endDate)
    );
    setFilteredData(filteredData);
  };

  const calculateAverageEfficiency = () => {
    if (!filteredData || filteredData.length === 0) return null;
    let totalEfficiencySum = 0;
    filteredData.forEach(entry => {
      const x = entry.target * (entry.partial_shift / entry.shift_duration);
      const efficiency = (entry.achieved / x) * 100;
      totalEfficiencySum += efficiency;
    });
    const averageEfficiency = totalEfficiencySum / filteredData.length;
    setAverageEfficiency(averageEfficiency);
  };

  useEffect(() => {
    filterData();
  }, [empSSN, startDate, endDate]);

  useEffect(() => {
    calculateAverageEfficiency();
  }, [filteredData]);

  const handleSubmit = () => {
    filterData();
    calculateAverageEfficiency();
  };

  const showSubmitButton = () => {
    return (averageEfficiency === null || !incentives.length) && (!!empSSN || !!startDate || !!endDate);
  };

  return (
    <div className="w-full h-full flex flex-col gap-y-3 justify-center items-center">
      <div className="dark:text-gray-200 dark:bg-secondary-dark-bg m-2 flex flex-col justify-center items-center  h-full pt-2 md:m-10 mt-24 md:p-10 bg-white rounded-3xl w-[550px]">
        <div className="bg-white flex flex-col gap-y-4">
          <div>
            <label
              htmlFor="date"
              className="block text-lg font-medium text-gray-700"
            >
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="mt-1 block w-[480px] border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-lg font-medium text-gray-700"
            >
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="mt-1 block w-[480px] border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              checked={includeBaseIncentive} 
              onChange={() => setIncludeBaseIncentive(!includeBaseIncentive)} 
              className="mr-2" 
            />
            <label htmlFor="baseIncentive" className="text-sm text-gray-700 dark:text-gray-300">Include base incentive</label>
          </div>
          {showSubmitButton() && (
            <div>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
              >
                Submit
              </button>
            </div>
          )}
          {averageEfficiency !== null && (
            <div className="text-[20px]">
              <p><b>Efficiency</b>: {isNaN(averageEfficiency) ? "0" : averageEfficiency}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {incentives.map((data, index) => (
          <EmployeeIncentivePage 
            key={index} 
            data={data} 
            employee={employeeSSNS[index]}
            includeBaseIncentive={includeBaseIncentive} 
            setIncludeBaseIncentive={setIncludeBaseIncentive} 
          />
        ))}
      </div>
    </div>
  );
};

export default DailyEfficiency;
