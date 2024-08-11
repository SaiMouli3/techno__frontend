import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box } from '@mui/material';
const AddParameterForm = ({ onAddParameter, selectedType,handleClose,refetch }) => {
  const [newParameter, setNewParameter] = useState({
    parameter: '',
    value: '',
    type: selectedType || 'category', // Set initial type based on selectedType prop
  });

  const handleChange = (e) => {
    setNewParameter({ ...newParameter, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     
      const response = await axios.post(`${process.env.REACT_APP_URL}/webapp/create_external/`, newParameter);
    
      onAddParameter(response.data);
      refetch()
      toast.success("Parameter added successfully", {
        position: "top-center",
        autoClose: 1000,
        style: {
          width: "auto",
          style: "flex justify-center",
        },
        closeButton: false,
        progress: undefined,
      });
      setNewParameter({ // Reset form fields after successful submission
        parameter: '',
        value: '',
        type: selectedType || 'category', // Reset type to selectedType or default to 'category'
      });
      setTimeout(()=> {
        handleClose()
      },2000)
    } catch (error) {
      console.error("Error adding parameter:", error);
      toast.error("Failed to add parameter", {
        position: "top-center",
        autoClose: 1000,
        style: {
          width: "auto",
          style: "flex justify-center",
        },
        closeButton: false,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
              <ToastContainer/>

        <TextField label="Parameter" name="parameter" value={newParameter.parameter} onChange={handleChange} fullWidth sx={{marginBlock:'5px'}} />
        <TextField label="Value" name="value" value={newParameter.value} onChange={handleChange} fullWidth sx={{marginBlock:'5px'}} />
        <TextField label="Type" name="type" value={newParameter.type} onChange={handleChange} fullWidth sx={{marginBlock:'5px'}} >
         
        </TextField>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <Button variant="contained" type="submit" sx={{ marginRight: '1rem' }}>Add</Button>
          <Button variant="contained" onClick={handleClose}>Close</Button>
        </Box>
      </form>
    </>
  );
}

export default AddParameterForm;
