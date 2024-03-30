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
import axios from "axios";

const AddBreakdown = ({ open, handleClose, handleAddBreakdown }) => {
  const [date, setDate] = useState("");
  const [toolCode, setToolCode] = useState("");
  const [machineId, setMachineId] = useState("");
  const [lengthUsed, setLengthUsed] = useState("");
  const [expectedLengthRemaining, setExpectedLengthRemaining] = useState("");
  const [replacedBy, setReplacedBy] = useState("");
  const [reason, setReason] = useState("");
  const [changeTime, setChangeTime] = useState("");
  const [noOfMinIntoShift, setNoOfMinIntoShift] = useState("");
  const [toolOptions, setToolOptions] = useState([]);
  const [machineOptions, setMachineOptions] = useState([]);

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
      toolCode &&
      machineId &&

      replacedBy &&
      reason &&
      changeTime &&
      noOfMinIntoShift
    ) {
      const breakdownInfo = {
        date,
        tool_code: toolCode,
        machine_id: machineId,
        length_used: 10,
        expected_length_remaining: 20,
        replaced_by: replacedBy,
        reason,
        change_time: changeTime,
        no_of_min_into_shift: noOfMinIntoShift,
      };
      handleAddBreakdown(breakdownInfo);
      handleClose();
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Breakdown Information</DialogTitle>
      <DialogContent>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          variant="outlined"
          fullWidth
          size="large"
          margin="normal"
        />
        <TextField
          select
          label="Tool Code"
          value={toolCode}
          onChange={(e) => setToolCode(e.target.value)}
          variant="outlined"
          fullWidth
          size="large"
          margin="normal"
        >
          {toolOptions.map((toolOption) => (
            <MenuItem key={toolOption.tool_code} value={toolOption.tool_code}>
              {toolOption.tool_code}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Machine ID"
          value={machineId}
          onChange={(e) => setMachineId(e.target.value)}
          variant="outlined"
          fullWidth
          size="large"
          margin="normal"
        >
          {machineOptions.map((machineOption) => (
            <MenuItem key={machineOption.machine_id} value={machineOption.machine_id}>
              {machineOption.machine_id}
            </MenuItem>
          ))}
        </TextField>
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
        <TextField
          select
          label="Replaced By"
          value={replacedBy}
          onChange={(e) => setReplacedBy(e.target.value)}
          variant="outlined"
          fullWidth
          size="large"
          margin="normal"
        >
          {toolOptions.map((toolOption) => (
            <MenuItem key={toolOption.tool_code} value={toolOption.tool_code}>
              {toolOption.tool_code}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          variant="outlined"
          fullWidth
          size="large"
          margin="normal"
        />
        <TextField
          label="Change Time"
          type="time"
          value={changeTime}
          onChange={(e) => setChangeTime(e.target.value)}
          variant="outlined"
          fullWidth
          size="large"
          margin="normal"
        />
        <TextField
          label="Minutes Into Shift"
          type="number"
          value={noOfMinIntoShift}
          onChange={(e) => setNoOfMinIntoShift(e.target.value)}
          variant="outlined"
          fullWidth
          size="large"
          margin="normal"
        />
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
  );
};

export default AddBreakdown;
