import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { DownloadTableExcel } from 'react-export-table-to-excel';

const ParameterRow = ({ parameter }) => (
  <TableRow>
    <TableCell colSpan={2} style={{ fontWeight: 'bold' }}>{parameter.parameter}</TableCell>
    <TableCell align="right">{parameter.value}</TableCell>
  </TableRow>
);

const CollapsibleTablePage = () => {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const tableRef = useRef(null);

  async function fetchData() {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/generate-report/${selectedDate}/`);
      setData(response.data);
     
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);
  useEffect(()=> {
    fetchData();
  },[])

  
  function Row({ row, index }) {
    const [open, setOpen] = useState(false);
    const rowStyle = index % 2 === 0 ? { backgroundColor: '#f2f2f2' } : { backgroundColor: '#ffffff' };

    return (
     <React.Fragment>
  <TableRow sx={{ '& > *': { borderBottom: 'unset' }, ...rowStyle }}>
    {/* <TableCell>
      <IconButton
        aria-label="expand row"
        size="small"
        onClick={() => setOpen(!open)}
      >
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
    </TableCell> */}
    <TableCell component="th" scope="row">
      {row.machine_id}
    </TableCell>
    <TableCell align="center">{row.component_name}</TableCell>
    <TableCell align="center">{row.operation_no}</TableCell>
    <TableCell align="center">{row.shift_target}</TableCell>
    <TableCell align="center">{row.quantity_achieved_shift_1}</TableCell>
    <TableCell align="center">{row.shift_1_percentage}</TableCell>
    <TableCell align="center">{row.quantity_achieved_shift_2}</TableCell>
    <TableCell align="center">{row.shift_2_percentage}</TableCell>
    <TableCell align="center">{row.quantity_achieved_shift_3}</TableCell>
    <TableCell align="center">{row.shift_3_percentage}</TableCell>
    <TableCell align="center">{row.per_day_target}</TableCell>
    <TableCell align="center">{row.per_day_achieved}</TableCell>
    <TableCell align="center">{row.per_day_achieved_percentage}</TableCell>
  </TableRow>
</React.Fragment>
    );
  }

  return (
    <div className='mx-5 mt-10 font-semibold'>
      <h1 className='my-3 flex mx-auto justify-center text-3xl text-[#F7F7F7] font-semibold'>Daily Report</h1>
      <div className='flex w-[20%] gap-x-3 p-3 m-3 bg-white justify-center items-center mx-auto'>

            <label
              htmlFor="date"
              className="block text-lg font-medium text-gray-700"
            >
              Date:
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-sm shadow-sm focus:ring focus:ring-indigo-500"
            />
          </div>

      <TableContainer component={Paper}>
        <Table ref={tableRef} aria-label="collapsible table" id="table-to-xls">
          <TableHead>
            <TableRow>
              <TableCell>Machine ID</TableCell>
              <TableCell align="right">Component Name</TableCell>
              <TableCell align="right">Operation Number</TableCell>
              <TableCell align="right">Shift Target</TableCell>
              <TableCell align="right">Qty Achieved</TableCell>
              <TableCell align="right">Shift 1%</TableCell>
              <TableCell align="right">Qty Achieved</TableCell>
              <TableCell align="right">Shift 2%</TableCell>
              <TableCell align="right">Qty Achieved</TableCell>
              <TableCell align="right">Shift 3%</TableCell>
              <TableCell align="right">Per Day Target</TableCell>
              <TableCell align="right">Per Day Achieved</TableCell>
              <TableCell align="right">Per Day Achieved Percentage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, index) => (
              <Row key={index} index={index} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DownloadTableExcel filename="Report" sheet="users" currentTableRef={tableRef.current}>
        <button className='flex justify-center mx-auto text-white bg-indigo-600 px-4 py-4 my-6 rounded-md'> Export excel </button>
      </DownloadTableExcel>
    </div>
  );
};

export default CollapsibleTablePage;
