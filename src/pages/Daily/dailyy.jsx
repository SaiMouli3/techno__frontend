import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dailyy = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [submittedData, setSubmittedData] = useState(null);
  const [showHoursInput, setShowHoursInput] = useState(false);
  const [hours, setHours] = useState(8);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [machineData, setMachineData] = useState([]);
  const [reason, setReason] = useState({ label: "No Remarks", value: "No Remarks" });
  const [employeeData, setEmployeeData] = useState([]);
  const [targetData, setTargetData] = useState([]);
  const [reasonOptions, setReasonOptions] = useState([]);
  const [partNumber, setPartNumber] = useState({});

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/api/employees/`);
      setEmployeeData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { data: machiness } = useQuery({
    queryKey: ["daily"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/api/machines`);
        return response.data;
      } catch (error) {
        throw new Error("Error fetching machines");
      }
    },
  });

  const machineOptions = machiness?.map((machine) => ({
    label: `${machine.machine_name} - ${machine.machine_id}`,
    value: machine.id,
  }));

  const filterDuplicateMachineOptions = (options) => {
    const uniqueOptions = [];
    const uniqueMachineIds = new Set();

    options.forEach((option) => {
      if (!uniqueMachineIds.has(option.label)) {
        uniqueMachineIds.add(option.label);
        uniqueOptions.push(option);
      }
    });

    return uniqueOptions;
  };

  const handleData = () => {
    const formData = {
      employeeName,
      selectedShift,
      selectedMachines,
    };
    setSubmittedData(formData);

    const initialData = selectedMachines.map((machine) => ({
      label: machine.label,
      achieved: 0,
      target: targetData[machine.label],
    }));
    setMachineData(initialData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const postRequests = [];
      const shiftNumberMap = {
        shift1: 1,
        shift2: 2,
        shift3: 3,
      };

      machineData.forEach((machine) => {
        const machineId = machine.label.split(" - ")[1];

        const formData = {
          date: date,
          emp_ssn: employeeName.value,
          shift_number: shiftNumberMap[selectedShift],
          shift_duration: 8,
          machine_id: machineId,
          achieved: machine.achieved,
          target: machine.target,
          partial_shift: hours,
          remarks: reason.label,
          efficiency: 0,
          incentive_received: 0,
        };

        postRequests.push(
          axios.post(`${process.env.REACT_APP_URL}/webapp/api/submit-performance`, formData)
        );
      });

      await Promise.all(postRequests);

      toast.success("Daily entry added successfully", {
        position: "top-center",
        autoClose: 1000,
        style: {
          width: "auto",
          style: "flex justify-center",
        },
        closeButton: false,
        progress: undefined,
      });

      setTimeout(() => {
        setSelectedShift("");
        setEmployeeName("");
        setSelectedMachines([]);
        setSubmittedData(null);
      }, 3000);
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 1000,
        style: {
          width: "auto",
          style: "flex justify-center",
        },
        closeButton: false,
        progress: undefined,
      });
      console.error("Error:", error);
    }
  };

  const handleMachineChange = async (selectedOptions) => {
    setSelectedMachines(selectedOptions);
    setMachineData([]);

    const fetchedTargetData = {};
    const partNumberData = {};
    try {
      await Promise.all(
        selectedOptions.map(async (machine) => {
          const machineLabelParts = machine.label.split('-');
          const middleHyphenIndex = Math.floor(machine.label.length / 2);
          let hyphenIndex = machine.label.lastIndexOf('-', middleHyphenIndex);
          if (hyphenIndex === -1) {
            hyphenIndex = machine.label.indexOf('-', middleHyphenIndex);
          }
          const machineLabel = machine.label.substring(hyphenIndex + 1).trim();

          const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/target/${encodeURIComponent(machineLabel)}/`);
          const response1 = await axios.get(`${process.env.REACT_APP_URL}/webapp/api/machine_jobs/${encodeURIComponent(machineLabel)}/`);
          fetchedTargetData[machine.label] = response.data.target;
          partNumberData[machine.label] = response1.data;
        })
      );
      setTargetData(fetchedTargetData);
      setPartNumber(partNumberData);
    } catch (error) {
      toast.error("Error fetching target data");
    }
  };

  const handleInputChange = (index, key, value) => {
    const updatedData = [...machineData];
    updatedData[index][key] = value;
    setMachineData(updatedData);
  };

  const { data: parameterData } = useQuery({
    queryKey: ["parameters"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/externals_data`);
        return response.data;
      } catch (error) {
        throw new Error("Error fetching parameters");
      }
    },
  });

  useEffect(() => {
    if (parameterData) {
      const filteredData = parameterData.filter(item => !item.parameter.toLowerCase().includes("category"));
      const options = filteredData.map(item => ({
        value: item.parameter,
        label: item.parameter,
      }));
      setReasonOptions(options);
    }
  }, [parameterData]);

  if (submittedData) {
    return (
      <div className="min-h-screen py-8 px-4">
        <h1 className="text-3xl text-white font-bold text-center mb-8">
          Daily Submissions
        </h1>
        <ToastContainer className="z-[10001]" />

        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-4">
          {submittedData && (
            <>
              <p className="text-lg mb-2 font-semibold">
                Shift: {submittedData.selectedShift}
              </p>
            </>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {selectedMachines.map((machine, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-2">Machine: {machine.label}</h3>
                  <h5>Part number: {partNumber && partNumber[machine.label]?.part_no}</h5>
                  <h5>Operation number: {partNumber && partNumber[machine.label]?.operation_no}</h5>

                  <input
                    type="number"
                    placeholder="Achieved"
                    value={machineData[index]?.achieved || ""}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                    onChange={(e) => handleInputChange(index, 'achieved', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Target"
                    value={targetData[machine.label]}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                    onChange={(e) => handleInputChange(index, 'target', e.target.value)}
                  />
                </div>
              ))}
              <label className="flex items-center mt-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  onChange={() => setShowHoursInput(!showHoursInput)}
                />
                Partial Shift
              </label>
              {showHoursInput && (
                <input
                  type="number"
                  placeholder="Number of Minutes into shift"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                />
              )}
              <div>
                <label
                  htmlFor="Reason"
                  className="block text-lg font-medium text-gray-700"
                >
                  Remarks:
                </label>
                <Select
                  options={reasonOptions}
                  value={reason}
                  onChange={(selectedOption) => setReason(selectedOption)}
                  isSearchable
                  placeholder="Select Reason"
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full px-8 py-6 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Daily Entry Form
        </h2>

        <form className="space-y-6">
          <div>
            <label
              htmlFor="date"
              className="block text-lg font-medium text-gray-700"
            >
              Date:
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
            />
          </div>
          <div>
  <label
    htmlFor="employeeName"
    className="block text-lg font-medium text-gray-700"
  >
    Employee SSN:
  </label>
  <Select
    options={employeeData.map(emp => ({ label: `${emp.emp_ssn} - ${emp.emp_name}`, value: emp.emp_ssn }))}
    value={employeeName}
    onChange={(selectedOption) => setEmployeeName(selectedOption)}
    isSearchable
    placeholder="Select Employee SSN"
  />
</div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Shift:</label>
            <div className="flex items-center space-x-4">
              <label htmlFor="shift1" className="flex items-center">
                <input
                  type="radio"
                  id="shift1"
                  value="shift1"
                  checked={selectedShift === "shift1"}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="mr-2"
                />
                Shift 1
              </label>
              <label htmlFor="shift2" className="flex items-center">
                <input
                  type="radio"
                  id="shift2"
                  value="shift2"
                  checked={selectedShift === "shift2"}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="mr-2"
                />
                Shift 2
              </label>
              <label htmlFor="shift3" className="flex items-center">
                <input
                  type="radio"
                  id="shift3"
                  value="shift3"
                  checked={selectedShift === "shift3"}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="mr-2"
                />
                Shift 3
              </label>
            </div>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Machines:
            </label>
            <Select
              options={filterDuplicateMachineOptions(machineOptions || [])}
              value={selectedMachines}
              onChange={handleMachineChange}
              isMulti
              placeholder="Select Machines"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
              menuPlacement="auto"
              menuPortalTarget={document.body}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              isSearchable
              isClearable
            />
          </div>
          <button
            onClick={handleData}
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dailyy;
