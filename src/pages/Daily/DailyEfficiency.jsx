import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField } from "@mui/material";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { useQuery } from "@tanstack/react-query";
import Select from 'react-select'

const DailyEfficiency = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [empSSN, setEmpSSN] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [averageEfficiency, setAverageEfficiency] = useState(null);
  const [incentive, setIncentive] = useState(null);

  const { data: dailyentry } = useQuery({
    queryKey: ["dailyentry"],
    queryFn: async () => {
      try {
        const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/per/");
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
        const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/employees/");
        return response.data;
      } catch (error) {
        throw new Error("Error fetching data");
      }
    },
  });

  const { data: incentiveData, isLoading: incentiveLoading } = useQuery({
    queryKey: ["incentive", empSSN, startDate, endDate],
    queryFn: async () => {
      try {
        console.log(`https://techno.pythonanywhere.com/webapp/calculate-incentive/${empSSN}/${startDate}/${endDate}/`);
        const response = await axios.get(`https://techno.pythonanywhere.com/webapp/calculate-incentive/${empSSN.label}/${startDate}/${endDate}/`);
        console.log(response)
        return response.data;
      } catch (error) {
        throw new Error("Error fetching data");
      }
    },
    enabled: !!empSSN && !!startDate && !!endDate, // Enable query when all required parameters are present
  });

  const filterData = () => {
    if (!startDate || !endDate) return;
    const filteredData = dailyentry.filter(
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

  useEffect(() => {
    if (incentiveData) {
      setIncentive(incentiveData?.incentive_received);
    }
  }, [incentiveData]);

  const handleSubmit = () => {
    filterData();
    calculateAverageEfficiency();
  };

 const showSubmitButton = () => {
  return (averageEfficiency === null || incentiveLoading) && (!!empSSN || !!startDate || !!endDate);
};



  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="dark:text-gray-200 dark:bg-secondary-dark-bg m-2 flex flex-col justify-center items-center  h-full pt-2 md:m-10 mt-24 md:p-10 bg-white rounded-3xl overflow-x-auto w-[600px]">
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
              className="mt-1 block w-[500px] border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
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
              className="mt-1 block w-[500px] border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="emp_ssn"
              className="block text-lg font-medium text-gray-700"
            >
              Employee SSN:
            </label>
            <Select
              options={employeeSSNS?.map(emp => ({ label: emp.emp_ssn, value: emp.emp_ssn }))}
              value={empSSN}
              onChange={(selectedOption) => setEmpSSN(selectedOption)}
              isSearchable
              placeholder="Select Employee SSN"
            />
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
              <p><b>Efficiency</b>: {averageEfficiency === NaN ? "0" : averageEfficiency}</p>
              <p><b>Incentive</b>: {incentive}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyEfficiency;
