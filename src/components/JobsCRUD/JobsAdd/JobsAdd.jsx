import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

import axios from 'axios';

const AddJob = ({ open, handleClose, handleAddJob }) => {
  const [partNo, setPartNo] = useState("");
  const [componentName, setComponentName] = useState("");
  const [operationNumber, setOperationNumber] = useState("");
  const [tools, setTools] = useState([{ tool: "", length: "", holes: "" }]);
  const [toolOptions, setToolOptions] = useState([]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/tools/");
        setToolOptions(response.data);
      } catch (error) {
        console.error("Error fetching tools:", error);
      }
    };

    fetchTools();
  }, []);

  const handleAdd = async () => {
    if (
      partNo &&
      componentName &&
      operationNumber &&
      tools.length > 0
    ) {
      try {
        for (let i = 0; i < tools.length; i++) {
          const newJob = {
            part_no: partNo,
            component_name: componentName,
            operation_no: operationNumber,
            tool_code: tools[i].tool,
            no_of_holes: tools[i].holes,
            depth_of_cut: tools[i].length
          };
           console.log(newJob)

          const response = await axios.post(
            "https://techno.pythonanywhere.com/webapp/api/jobs/create",
            newJob
          );

          console.log(response.data)
        }

        handleClose();
      } catch (error) {
        console.error("Error adding job:", error);
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleToolChange = (index, event) => {
    const newTools = [...tools];
    newTools[index][event.target.name] = event.target.value;
    setTools(newTools);
  };

  const addTool = () => {
    setTools([...tools, { tool: "", length: "", holes: "" }]);
  };

  const removeTool = (index) => {
    const newTools = [...tools];
    newTools.splice(index, 1);
    setTools(newTools);
  };

  return (
    <div className="z-[100001]">
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Add New Job</DialogTitle>
        <DialogContent>
          <TextField
            label="Part Number"
            value={partNo}
            onChange={(e) => setPartNo(e.target.value)}
            variant="outlined"
            fullWidth
            size="large"
            margin="normal"
          />
          <TextField
            label="Component Name"
            value={componentName}
            onChange={(e) => setComponentName(e.target.value)}
            variant="outlined"
            fullWidth
            size="large"
            margin="normal"
          />
          <TextField
            label="Operation Number"
            value={operationNumber}
            onChange={(e) => setOperationNumber(e.target.value)}
            variant="outlined"
            fullWidth
            size="large"
            margin="normal"
          />
          {tools.map((tool, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Tool</InputLabel>
                  <Select
              value={tool.tool_code}  // Set the value to tool_code instead of tool
              onChange={(e) => handleToolChange(index, e)}
              name="tool"
              variant="outlined"
                    >
                    {toolOptions.map((option, index) => (
                      <MenuItem key={index} value={option.tool_code}>{option.tool_name}</MenuItem>
                    ))}
                  </Select>

                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <TextField
                  label={`Length for ${tool.tool}`}
                  value={tool.length}
                  onChange={(e) => handleToolChange(index, e)}
                  name="length"
                  variant="outlined"
                  fullWidth
                  size="large"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label={`Number of Holes for ${tool.tool}`}
                  value={tool.holes}
                  onChange={(e) => handleToolChange(index, e)}
                  name="holes"
                  variant="outlined"
                  fullWidth
                  size="large"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={1}>
                <Button
                  onClick={() => removeTool(index)}
                  color="primary"
                  top="50px"
                >
                  X
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button onClick={addTool}>Add Tool</Button>
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

export default AddJob;
