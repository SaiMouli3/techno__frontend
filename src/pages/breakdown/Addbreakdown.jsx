import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Select from 'react-select';
import axios from "axios";

const AddBreakdown = ({ open, handleClose, handleAddBreakdown }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [empSSN, setEmpSSN] = useState("");
  const [toolCode, setToolCode] = useState("");
  const [machineId, setMachineId] = useState("");
  const [replacedBy, setReplacedBy] = useState("");
  const [reason, setReason] = useState(" ");
  const [changeTime, setChangeTime] = useState(0);
  const [noOfMinIntoShift, setNoOfMinIntoShift] = useState("");
  const [toolOptions, setToolOptions] = useState([]);
  const [machineOptions, setMachineOptions] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [toolss, setToolss] = useState(null);
  const [replacedTools, setReplacedTools] = useState([]);
  const [filteredToolOptions, setFilteredToolOptions] = useState([]);
  const [achieved, setAchieved] = useState(0);
  const [shiftNumber, setShiftNumber] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/api/employees/`);
      setEmployeeData(response.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchToolOptions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/api/tools/`);
        setToolOptions(response.data);
      } catch (error) {
        console.error("Error fetching tool options:", error);
      }
    };

    const fetchMachineOptions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/api/nmachines`);
        setMachineOptions(response.data);
      } catch (error) {
        console.error("Error fetching machine options:", error);
      }
    };

    fetchToolOptions();
    fetchMachineOptions();
  }, []);

  useEffect(() => {
    if (machineId) {
      const fetchToolOptionss = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/display-tool-codes/${encodeURIComponent(machineId.label)}`);
          setToolss(response.data["tool_codes"]);
        } catch (error) {
          console.error("Error fetching tool options:", error);
        }
      };
      fetchToolOptionss();
    }
  }, [machineId]);

  useEffect(() => {
    if (toolCode) {
      const fetchReplacedTools = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/breakdown/${toolCode.value}/tool-codes/`);
          setReplacedTools(response.data.tool_codes);
        } catch (error) {
          console.error("Error fetching replaced tools:", error);
        }
      };
      fetchReplacedTools();
    }
  }, [toolCode]);

  useEffect(() => {
    if (replacedTools.length > 0 && toolCode) {
      const updatedFilteredTools = replacedTools.filter(tool => tool !== toolCode.label);
      setFilteredToolOptions(updatedFilteredTools);
    }
  }, [replacedTools, toolCode]);

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setDate(currentDate);
  }, []);

  const handleAdd = () => {
    const missingFields = [];

    if (!date) missingFields.push("Date");
    if (!empSSN) missingFields.push("Employee SSN");
    if (!toolCode) missingFields.push("Tool Code");
    if (!machineId) missingFields.push("Machine ID");
    if (!replacedBy) missingFields.push("Replaced By");
    if (!changeTime) missingFields.push("Change Time");
    if (!noOfMinIntoShift) missingFields.push("Number of Minutes Into Shift");
    if (!shiftNumber) missingFields.push("Shift Number");

    if (missingFields.length > 0) {
      alert("Please fill in the following fields:\n" + missingFields.join("\n"));
    } else {
      const breakdownInfo = {
        date,
        emp_ssn: empSSN.label,
        tool_code: toolCode.label,
        machine_id: machineId.label,
        length_used: 0,
        expected_length_remaining: 0,
        replaced_by: replacedBy.label,
        reason,
        change_time: changeTime,
        achieved,
        no_of_min_into_shift: noOfMinIntoShift,
        shift_number: shiftNumber.value,
      };

      handleAddBreakdown(breakdownInfo);
      handleClose();
      setDate("");
      setEmpSSN("");
      setToolCode("");
      setMachineId("");
      setReplacedBy("");
      setReason("");
      setChangeTime(0);
      setNoOfMinIntoShift("");
      setShiftNumber(null);
    }
  };

  const shiftOptions = [
    { value: 1, label: 'Shift 1' },
    { value: 2, label: 'Shift 2' },
    { value: 3, label: 'Shift 3' },
  ];


  return (
    <div className="w-[400px] px-4">
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Breakdown Information</DialogTitle>
        <DialogContent>
          <div>
            <label htmlFor="date" className="block text-lg font-medium text-gray-700">Date:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 block w-[500px] border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="emp_ssn" className="block text-lg font-medium text-gray-700">Employee SSN:</label>
            <Select
              options={employeeData.map(emp => ({ label: emp.emp_ssn, value: emp.emp_ssn }))}
              value={empSSN}
              onChange={(selectedOption) => setEmpSSN(selectedOption)}
              isSearchable
              placeholder="Select Employee SSN"
            />
          </div>
          <div>
            <label htmlFor="machineId" className="block text-lg font-medium text-gray-700">Machine ID:</label>
            <Select
              options={machineOptions.map(machine => ({ label: machine.machine_id, value: machine.machine_id }))}
              value={machineId}
              onChange={(selectedOption) => setMachineId(selectedOption)}
              isSearchable
              placeholder="Select Machine ID"
            />
          </div>
          <div>
            <label htmlFor="toolCode" className="block text-lg font-medium text-gray-700">Tool Code:</label>
            <Select
              options={toolss?.map(tool => ({ label: tool, value: tool }))}
              value={toolCode}
              onChange={(selectedOption) => setToolCode(selectedOption)}
              isSearchable
              placeholder="Select Tool Code"
            />
          </div>
          <div>
            <label htmlFor="replacedBy" className="block text-lg font-medium text-gray-700">Replaced by:</label>
            <Select
              options={filteredToolOptions.map(tool => ({ label: tool, value: tool }))}
              value={replacedBy}
              onChange={(selectedOption) => setReplacedBy(selectedOption)}
              isSearchable
              placeholder="Replaced By"
            />
          </div>
          <div>
            <label htmlFor="reason" className="block text-lg font-medium text-gray-700">Reason:</label>
            <input
              type="text"
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full border-2 py-2 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="achieved" className="block text-lg font-medium text-gray-700">Achieved:</label>
            <input
              type="number"
              id="achieved"
              value={achieved}
              onChange={(e) => setAchieved(e.target.value)}
              className="mt-1 block w-full border-2 py-2 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="shiftNumber" className="block text-lg font-medium text-gray-700">Shift Number:</label>
            <Select
              options={shiftOptions}
              value={shiftNumber}
              onChange={(selectedOption) => setShiftNumber(selectedOption)}
              isSearchable
              placeholder="Select Shift"
            />
          </div>
          <div>
            <label htmlFor="changeTime" className="block text-lg font-medium text-gray-700">Change time:</label>
            <input
              type="number"
              id="changeTime"
              value={changeTime}
              onChange={(e) => setChangeTime(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="noOfMinIntoShift" className="block text-lg font-medium text-gray-700">Minutes into shift:</label>
            <input
              type="number"
              id="noOfMinIntoShift"
              value={noOfMinIntoShift}
              onChange={(e) => setNoOfMinIntoShift(e.target.value)}
              required
              className="mt-1 block w-full border-2 py-2 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleAdd} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddBreakdown;
