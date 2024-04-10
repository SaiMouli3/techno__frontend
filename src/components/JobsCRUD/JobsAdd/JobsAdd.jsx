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
  Snackbar,
} from "@mui/material";
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';

const AddJob = ({ open, handleClose, handleAddJob }) => {
  const [partNo, setPartNo] = useState("");
  const [componentName, setComponentName] = useState("");
  const [operationNumber, setOperationNumber] = useState("");
  const [tools, setTools] = useState([{ tool: null, length: "", holes: "" }]); // Initialize with null
  const [toolOptions, setToolOptions] = useState([]);
  const [filteredToolOptions, setFilteredToolOptions] = useState([]);
  const [jobAdded, setJobAdded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/tools/");
        const uniqueTools = response.data.reduce((acc, current) => {
          const existingTool = acc.find((tool) => tool.tool_name === current.tool_name);
          if (!existingTool) {
            return [...acc, current];
          } else {
            return acc;
          }
        }, []);
        setToolOptions(uniqueTools);
        setFilteredToolOptions(uniqueTools);
      } catch (error) {
        console.error("Error fetching tools:", error);
      }
    };

    fetchTools();
  }, []);

  useEffect(() => {
    const filteredOptions = toolOptions.filter(option =>
      option.tool_name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setFilteredToolOptions(filteredOptions);
  }, [searchTerm, toolOptions]);

  const handleAdd = async () => {
    if (partNo && componentName && operationNumber && tools.length > 0) {
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
          const response = await axios.post("https://techno.pythonanywhere.com/webapp/api/jobs/create", newJob);
          console.log(response.data);
        }
        setJobAdded(true);
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
    setTools([...tools, { tool: null, length: "", holes: "" }]); // Initialize with null
  };

  const removeTool = (index) => {
    const newTools = [...tools];
    newTools.splice(index, 1);
    setTools(newTools);
  };

  const handleCloseSnackbar = () => {
    setJobAdded(false);
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
                  <div className={`relative ${isFocused ? 'bg-transparent' : 'bg-white'}`}>
                    <Autocomplete
                      disablePortal
                      id={`combo-box-demo-${index}`}
                      options={filteredToolOptions}
                      getOptionLabel={(option) => option.tool_name}
                      value={tool.tool}
                      onChange={(event, newValue) => handleToolChange(index, { target: { name: "tool", value: newValue } })}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tool"
                          className="w-full"
                          InputProps={{ className: 'focus:bg-transparent' }}
                        />
                      )}
                    />
                  </div>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label={`Depth of Cut in mm`}
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
                  label={`Number of Holes`}
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
                <Button onClick={() => removeTool(index)} color="primary">
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
      <Snackbar
        open={jobAdded}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Job added successfully"
      />
    </div>
  );
};

export default AddJob;
