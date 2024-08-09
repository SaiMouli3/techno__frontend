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
import {useQuery} from '@tanstack/react-query'
import AddParameterForm from './AddParameter';

const ParameterRow = ({ parameter, onEdit,onDelete }) => (
  <TableRow>
    <TableCell>{parameter.parameter}</TableCell>
    <TableCell>{parameter.value}</TableCell>
    <TableCell align="right">
      <Button onClick={() => onEdit(parameter)}>Edit</Button>
    </TableCell>
    <TableCell align="right">
      <Button onClick={() => onDelete(parameter)}>Delete</Button>
    </TableCell>
  </TableRow>
);

const Parameter = () => {
  const [editedParameters, setEditedParameters] = useState({});
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  // const fetchData = async () => {
  //   const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/externals_data`);
  //   setParameterData(response.data);
  //   console.log(parameterData)
  // }
   const { data: parameterData,refetch } = useQuery({
    queryKey: ["parameters"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/externals_data`);
        return response.data; // Return the data from the response
      } catch (error) {
        throw new Error("Error fetching machines"); // Throw an error if request fails
      }
    },
  });

  const handleEdit = (parameter) => {
    setSelectedParameter(parameter);
    setOpenModal(true);
  }
  const handleDelete=async (parameter)=> {
   try {
     await axios.get(`${process.env.REACT_APP_URL}/webapp/externals/${parameter?.parameter}/delete/`)
     toast.success("Parameter deleted successfully!!")
     refetch()
   } catch (error) {
      
   }
  }

  const handleUpdate = async () => {
    
    try {
      await axios.post(`${process.env.REACT_APP_URL}/webapp/update_externals/`, [selectedParameter]);
      
      await refetch();
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

  const handleAddParameter = (type) => {
    setSelectedType(type);
    setAddModalOpen(true);
  }

  useEffect(() => {
    refetch();
  }, []);
  const handleClose=()=> {
    setAddModalOpen(false);
  }

  return (
    <div>
      <ToastContainer/>
<div className='w-full flex justify-center items-center mx-auto flex-col'>    <p className='text-lg text-white font-semibold uppercase mb-2'>Add Parameter</p>

 <div className='flex justify-center items-center font-semibold gap-x-4 flex-row'>
   <Button 
    variant="contained"
    sx={{ 
      px: 2, 
       width: "100px", 
      bgcolor: 'indigo.500', 
      color: 'white', 
      borderRadius: 'md',
      '&:hover': {
        bgcolor: 'indigo.600',
      },
      fontWeight:'500'
    }} 
    onClick={() => handleAddParameter("category")}
  >
     Category 
  </Button>
  <Button 
    variant="contained"
    sx={{ 
      px: 2, 
       width: "100px", 
      bgcolor: 'indigo.500', 
      color: 'white', 
      borderRadius: 'md',
       // Add margin top
      '&:hover': {
        bgcolor: 'indigo.600',
      },
      fontWeight: '500'
    }} 
    onClick={() => handleAddParameter("reason")}
  >
     Reason
  </Button>
 </div>
</div>

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
            {parameterData && parameterData?.map((parameter, index) => (
              <ParameterRow key={index} parameter={parameter} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
     
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 8,
            outline: 'none',
          }}
        >
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
          />    
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <Button variant="contained" onClick={handleUpdate} sx={{ marginRight: '1rem' }}>Update</Button>
            <Button variant="contained" onClick={() => setOpenModal(false)}>Close</Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 8,
            outline: 'none',
          }}
        >
          <AddParameterForm onAddParameter={handleAddParameter} selectedType={selectedType} handleClose = {handleClose} refetch={refetch} />
        </Box>
      </Modal>
    </div>
  );
}

export default Parameter;
