// AddJob component
import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  
  Grid,
  Snackbar,
} from "@mui/material";
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';

const AddJob = ({ open, handleClose, handleAddJob }) => {
  const [partNo, setPartNo] = useState("");
  const [componentName, setComponentName] = useState("");
  const [operationNumber, setOperationNumber] = useState("");
  const [tools, setTools] = useState([{ tool: null, length: "", holes: "" }]);
  const [toolOptions, setToolOptions] = useState([]);
  const [filteredToolOptions, setFilteredToolOptions] = useState([]); // State to hold filtered tool options
  const [jobAdded, setJobAdded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State to hold search term

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/api/tools/`);
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
    // Filter tool options based on search term
    const filteredOptions = toolOptions.filter(option =>
      option.tool_name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setFilteredToolOptions(filteredOptions);
  }, [searchTerm, toolOptions]);

  const handleAdd = async () => {
    if (partNo && componentName && operationNumber && tools.length > 0) {
      try {
        for (let i = 0; i < tools.length; i++) {
        const toolName = tools[i].tool.tool_name;
          const newJob = {
            part_no: partNo,
            component_name: componentName,
            operation_no: operationNumber,
            tool_name: toolName,
            no_of_holes: tools[i].holes,
            depth_of_cut: tools[i].length
          };
          console.log(newJob)
          const response = await axios.post(`${process.env.REACT_APP_URL}/webapp/api/jobs/create`, newJob);
          console.log(response.data);
        }
        setJobAdded(true); // Set job added status to true
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
    setTools([...tools, { tool: null, length: "", holes: "" }]);
  };

  const removeTool = (index) => {
    const newTools = [...tools];
    newTools.splice(index, 1);
    setTools(newTools);
  };

  const handleCloseSnackbar = () => {
    setJobAdded(false); // Reset job added status when Snackbar is closed
  };

  return (
    <div className="z-[100001] py-5">
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" fullHeight={true} maxHeight="lg">
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
            <Grid container spacing={2} key={index} >
              <Grid item xs={4}>
                <FormControl fullWidth margin="normal">
{/*                   <InputLabel>Tool</InputLabel> */}
{/*                   <Select */}
{/*                     value={tool.tool} */}
{/*                     onChange={(e) => handleToolChange(index, e)} */}
{/*                     name="tool" */}
{/*                     variant="outlined" */}
{/*                   > */}
{/*                     {filteredToolOptions.map((option) => ( */}
{/*                       <MenuItem key={option.tool_code} value={option.tool_code}> */}
{/*                         {option.tool_name} */}
{/*                       </MenuItem> */}
{/*                     ))} */}
{/*                   </Select> */}
<Autocomplete
      disablePortal
      className="h-30"
      clearOnBlur
      blurOnSelect
      id="combo-box-demo"
      options={filteredToolOptions}
      getOptionLabel={(option) => option.tool_name}
      value={tool.tool}
      onChange={(event, newValue) => handleToolChange(index, { target: { name: "tool", value: newValue } })}
      renderInput={(params) => <TextField {...params} label="Tool" />}
sx={{ '& .MuiInputBase-root.Mui-focused': { backgroundColor: 'transparent' } }}    />
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
      {/* Snackbar to display job added message */}
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
