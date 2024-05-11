import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const ParameterRow = ({ parameter }) => (
  <TableRow>
    <TableCell colSpan={2} style={{ fontWeight: 'bold' }}>{parameter.parameter}</TableCell>
    <TableCell align="right">{parameter.value}</TableCell>
  </TableRow>
);
const Parameter = () => {
    const [parameterData,setParameterData] = useState([]);
const fetchDataa= async ()=> {
  const response = await axios.get("https://techno.pythonanywhere.com/webapp/externals_data");
  console.log(parameterData);
  setParameterData(response.data);
}
useEffect(()=> {
  fetchDataa();
},[])
  return (
    <div className='flex justify-center flex-col my-5 items-center'>
                    <h1 className='my-3 flex mx-auto justify-center text-3xl text-[#F7F7F7] mt-10 font-semibold'>Parameter Data</h1>

           <TableContainer component={Paper} style={{ maxWidth: 400, margin: 'auto' }}>
        <Table aria-label="parameter table">
          <TableBody>
            {parameterData?.map((parameter, index) => (
              <ParameterRow key={index} parameter={parameter} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Parameter