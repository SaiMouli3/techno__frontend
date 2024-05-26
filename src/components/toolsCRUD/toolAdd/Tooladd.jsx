import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const AddTool = ({ open, handleClose, handleAddTool,refetch }) => {
  const [toolName, setToolName] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [cost, setCost] = useState("");
  const [numTools, setNumTools] = useState(1);
  const [toolNumbers, setToolNumbers] = useState([1]);

  const [toolCodes, setToolCodes] = useState({}); 
  const handleAdd = () => {
    if (toolName && maxLength && cost && numTools && Object.keys(toolCodes).length === numTools) {
      const newTools = [];
      for (let i = 0; i < numTools; i++) {
        const newTool = {
          tool_code: toolCodes[i + 1], // Get tool code from state
          tool_name: toolName,
          max_life_expectancy_in_mm: parseFloat(maxLength),
          cost: parseFloat(cost),
          length_cut_so_far: 0, // Default value
          no_of_brk_points: 0, // Default value
          tool_efficiency: 0, // Initial value
          tool_number: i + 1,
        };
        newTools.push(newTool);
      }
      handleAddTool(newTools);
      setToolName("");
      setMaxLength("");
      setCost("");
      setNumTools(1);
      setToolNumbers([1]);
      setToolCodes({});
      refetch();
      handleClose();
      
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleNumToolsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setNumTools(value);
      setToolNumbers(Array.from({ length: value }, (_, i) => i + 1));
    }
  };

  const handleToolCodeChange = (toolNumber, value) => {
    setToolCodes({ ...toolCodes, [toolNumber]: value });
  };
  const { data} = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      try {
        const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/tools");
        return response.data; 
      } catch (error) {
        throw new Error("Error fetching machines"); 
      }
    },
  });
  const existingToolNames = data 
    ? Array.from(new Set(data.map(tool => tool.tool_name))) 
    : [];

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Add New Tool</DialogTitle>
      <DialogContent>
        <Autocomplete
          freeSolo
          options={existingToolNames}
          value={toolName}
          onChange={(event, newValue) => setToolName(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tool Name"
              variant="outlined"
              fullWidth
              margin="normal"
              size="large"
              onChange={(e) => setToolName(e.target.value)}
            />
          )}
        />
        <TextField
          label="Max Length in mm"
          value={maxLength}
          onChange={(e) => setMaxLength(e.target.value)}
          variant="outlined"
          fullWidth
          size="large"
          margin="normal"
        />
        <TextField
          label="Cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          variant="outlined"
          fullWidth
          size="large"
          margin="normal"
        />
        <TextField
          label="Number of Tools"
          type="number"
          value={numTools}
          onChange={handleNumToolsChange}
          variant="outlined"
          fullWidth
          size="large"
          margin="normal"
        />
        {/* Dynamically render input fields for tool codes */}
        {toolNumbers?.map((toolNumber) => (
          <TextField
            key={toolNumber}
            label={`Tool Code ${toolNumber}`}
            variant="outlined"
            fullWidth
            size="large"
            margin="normal"
            value={toolCodes[toolNumber] || ""}
            onChange={(e) => handleToolCodeChange(toolNumber, e.target.value)}
          />
        ))}
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

export default AddTool;
