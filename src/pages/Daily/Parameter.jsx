import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ParameterRow = ({ parameter, onEdit }) => (
  <TableRow>
    <TableCell>{parameter.parameter}</TableCell>
    <TableCell>{parameter.value}</TableCell>
    <TableCell align="right">
      <Button onClick={() => onEdit(parameter)}>Edit</Button>
    </TableCell>
  </TableRow>
);

const Parameter = () => {
  const [parameterData, setParameterData] = useState([]);
  const [editedParameters, setEditedParameters] = useState({});
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchData = async () => {
    const response = await axios.get("https://techno.pythonanywhere.com/webapp/externals_data");
    setParameterData(response.data);
  }

  const handleEdit = (parameter) => {
    setSelectedParameter(parameter);
    setOpenModal(true);
  }

  const handleUpdate = async () => {
    // Filter out only the edited parameters
    console.log(selectedParameter)
    // Send request to update URL with editedParamsToSend
    try {
      await axios.post("https://techno.pythonanywhere.com/webapp/update_externals/", [selectedParameter]);
      // Update parameterData after successful update
      await fetchData();
       toast.success("Parameter updated successfully", {
        position: "top-center",
        autoClose: 1000,
        style: {
          width: "auto",
          style: "flex justify-center",
        },
        closeButton: false,
        progress: undefined,
      });
      setOpenModal(false);
      setEditedParameters({}); // Clear edited parameters state
    } catch (error) {
      console.error("Error updating parameter:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <TableContainer component={Paper} sx={{ maxWidth: '30%',display:'flex',alignItems:'center',justifyContent:'center',marginInline:'auto',marginBlock:'10px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parameter</TableCell>
              <TableCell>Value</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parameterData.map((parameter, index) => (
              <ParameterRow key={index} parameter={parameter} onEdit={handleEdit} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ToastContainer/>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
  <Box sx={{ 
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)', 
    width: 400, 
    bgcolor: 'background.paper', 
    boxShadow: 24, 
    p: 4,
    borderRadius: 8, // Example: adding border radius
    outline: 'none' // Example: removing default outline
  }}>
    <TextField label="Parameter" sx={{marginBlock:'5px'}} value={selectedParameter?.parameter} disabled fullWidth />
<TextField 
            label="Value" 
            value={selectedParameter?.value}
            sx={{marginBlock:'5px'}} 
            onChange={(e) => {
              setSelectedParameter({ ...selectedParameter, value: e.target.value });
              setEditedParameters({ ...editedParameters, [selectedParameter.id]: true });
            }} 
            fullWidth 
          />    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
      <Button variant="contained" onClick={handleUpdate} sx={{ marginRight: '1rem' }}>Update</Button>
      <Button variant="contained" onClick={() => setOpenModal(false)}>Close</Button>
    </Box>
  </Box>
</Modal>

    </div>
  );
}

export default Parameter;
