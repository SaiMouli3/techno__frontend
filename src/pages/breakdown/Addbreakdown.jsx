import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@mui/material";
import Select from 'react-select'
import axios from "axios";

const AddBreakdown = ({ open, handleClose, handleAddBreakdown }) => {
  const [date, setDate] = useState("");
  const [emp_ssn, setEmpSSN] = useState("");
  const [toolCode, setToolCode] = useState("");
  const [machineId, setMachineId] = useState("");
  const [lengthUsed, setLengthUsed] = useState("");
  const [expectedLengthRemaining, setExpectedLengthRemaining] = useState("");
  const [replacedBy, setReplacedBy] = useState("");
  const [reason, setReason] = useState(" ");
  const [changeTime, setChangeTime] = useState(0);
  const [noOfMinIntoShift, setNoOfMinIntoShift] = useState("");
  const [toolOptions, setToolOptions] = useState([]);
  const [machineOptions, setMachineOptions] = useState([]);
  
   const [employeeData, setEmployeeData] = useState([]);
  const fetchData = async () => {
    try {
      const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/employees/");
      setEmployeeData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(()=> {
    fetchData();
  },[])
  useEffect(() => {
    const fetchToolOptions = async () => {
      try {
        const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/tools/");
        setToolOptions(response.data);
      } catch (error) {
        console.error("Error fetching tool options:", error);
      }
    };

    const fetchMachineOptions = async () => {
      try {
        const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/machines");
        setMachineOptions(response.data);
      } catch (error) {
        console.error("Error fetching machine options:", error);
      }
    };

    fetchToolOptions();
    fetchMachineOptions();
  }, []);

  const handleAdd = () => {

    if (
      date &&
      emp_ssn &&
      toolCode &&
      machineId &&

      replacedBy &&
     
      changeTime &&
      noOfMinIntoShift
    ) {
      console.log(emp_ssn)
      const breakdownInfo = {
        date,
        emp_ssn: emp_ssn.label,
        tool_code: toolCode.label,
        machine_id: machineId.label,
        length_used: 10,
        expected_length_remaining: 20,
        replaced_by: replacedBy.label,
        reason: reason,
        change_time: changeTime,
        no_of_min_into_shift: noOfMinIntoShift,
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
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div className="w-[400px] px-4">
    <Dialog open={open} onClose={handleClose} >
      <DialogTitle>Add Breakdown Information</DialogTitle>
      <DialogContent>
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
    options={employeeData.map(emp => ({ label: emp.emp_ssn, value: emp.emp_ssn }))}
    value={emp_ssn} // Use the employeeName state variable as the value prop
    onChange={(selectedOption) => setEmpSSN(selectedOption)} // Update the employeeName state variable with the selected SSN
    isSearchable
    placeholder="Select Employee SSN"
  />

</div>
<div>
  <label
    htmlFor="Tool Code"
    className="block text-lg font-medium text-gray-700"
  >
    Tool Code:
  </label>
 <Select
    options={toolOptions.map(tool => ({ label: tool.tool_code, value: tool.tool_code }))}
    value={toolCode} 
    onChange={(selectedOption) => setToolCode(selectedOption)} // Update the employeeName state variable with the selected SSN
    isSearchable
    placeholder="Select Tool Code"
  />

</div>
<div>
  <label
    htmlFor="Machine ID"
    className="block text-lg font-medium text-gray-700"
  >
    Machine ID:
  </label>
 <Select
    options={machineOptions.map(machine => ({ label: machine.machine_id, value: machine.machine_id }))}
    value={machineId} 
    onChange={(selectedOption) => setMachineId(selectedOption)} // Update the employeeName state variable with the selected SSN
    isSearchable
    placeholder="Select Machine ID"
  />

</div>
        
        
{/*         <TextField */}
{/*           label="Length Used" */}
{/*           type="number" */}
{/*           value={lengthUsed} */}
{/*           onChange={(e) => setLengthUsed(e.target.value)} */}
{/*           variant="outlined" */}
{/*           fullWidth */}
{/*           size="large" */}
{/*           margin="normal" */}
{/*         /> */}
{/*         <TextField */}
{/*           label="Expected Length Remaining" */}
{/*           type="number" */}
{/*           value={expectedLengthRemaining} */}
{/*           onChange={(e) => setExpectedLengthRemaining(e.target.value)} */}
{/*           variant="outlined" */}
{/*           fullWidth */}
{/*           size="large" */}
{/*           margin="normal" */}
{/*         /> */}
        <div>
  <label
    htmlFor="Replaced By"
    className="block text-lg font-medium text-gray-700"
  >
    Replaced by:
  </label>
 <Select
    options={toolOptions.map(tool => ({ label: tool.tool_code, value: tool.tool_code }))}
    value={replacedBy} 
    onChange={(selectedOption) => setReplacedBy(selectedOption)} // Update the employeeName state variable with the selected SSN
    isSearchable
    placeholder="Replaced By"
  />

</div>
        <div>

            <label
              htmlFor="reason"
              className="block text-lg font-medium text-gray-700"
            >
              Reason:
            </label>
            <input
              type="text"
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              
              className="mt-1 block w-full border-2 py-2 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
            />
          </div>
        <div>

            <label
              htmlFor="number"
              className="block text-lg font-medium text-gray-700"
            >
              Change time:
            </label>
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

            <label
              htmlFor="number"
              className="block text-lg font-medium text-gray-700"
            >
              Minutes into shift:
            </label>
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
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleAdd} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
    </div>
  );
};

export default AddBreakdown;
