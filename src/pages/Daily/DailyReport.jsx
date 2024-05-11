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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { useRef } from 'react';

const ParameterRow = ({ parameter }) => (
  <TableRow>
    <TableCell colSpan={2} style={{ fontWeight: 'bold' }}>{parameter.parameter}</TableCell>
    <TableCell align="right">{parameter.value}</TableCell>
  </TableRow>
);

const CollapsibleTablePage = () => {
  const [data, setData] = useState([]);
  const tableRef = useRef(null);

  async function fetchData() {
    try {
      const response = await axios.get('https://techno.pythonanywhere.com/webapp/generate-report/');
      setData(response.data.report);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  const [parameterData,setParameterData] = useState([]);
const fetchDataa= async ()=> {
  const response = await axios.get("https://techno.pythonanywhere.com/webapp/externals_data");
  console.log(parameterData);
  setParameterData(response.data);
}
useEffect(()=> {
  fetchDataa();
},[])

  function Row({ row, index }) {
    const [open, setOpen] = useState(false);
    const rowStyle = index % 2 === 0 ? { backgroundColor: '#f2f2f2' } : { backgroundColor: '#ffffff' };

    return (
     <React.Fragment>
  <TableRow sx={{ '& > *': { borderBottom: 'unset' }, ...rowStyle }}>
    <TableCell>
      <IconButton
        aria-label="expand row"
        size="small"
        onClick={() => setOpen(!open)}
      >
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
    </TableCell>
    <TableCell component="th" scope="row">
      {row.machine_id}
    </TableCell>
    <TableCell align="center">{row.component_name}</TableCell>
    <TableCell align="center">{row.operation_no}</TableCell>
    <TableCell align="center">{row.cycle_time}</TableCell>
    <TableCell align="center">{row.shift_target}</TableCell>
    <TableCell align="center">{row.per_day_target}</TableCell>
    <TableCell align="center">{row.per_day_achieved}</TableCell>
    <TableCell align="center">{row.per_day_achieved_percentage}</TableCell>
  </TableRow>
  <TableRow sx={{ '& > *': { borderBottom: 'unset' }, ...rowStyle }}>
    <TableCell style={{ paddingBottom: 0, paddingTop: 0}} colSpan={10}>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ margin: 1 }}>
          
          <Typography variant="body1" gutterBottom component="div">
            <strong>Quantity Achieved Shift 1:</strong> {row.quantity_achieved_shift_1}, <strong>Shift 1 Percentage:</strong> {row.shift_1_percentage}%
          </Typography>
          <Typography variant="body1" gutterBottom component="div">
            <strong>Quantity Achieved Shift 2:</strong> {row.quantity_achieved_shift_2}, <strong>Shift 2 Percentage:</strong> {row.shift_2_percentage}%
          </Typography>
          <Typography variant="body1" gutterBottom component="div">
            <strong>Quantity Achieved Shift 3:</strong> {row.quantity_achieved_shift_3}, <strong>Shift 3 Percentage:</strong> {row.shift_3_percentage}%
          </Typography>
        </Box>
      </Collapse>
    </TableCell>
  </TableRow>
</React.Fragment>


    );
  }

  return (
    <div className='mx-5 mt-10 font-semibold'>
      <h1 className='my-3 flex mx-auto justify-center text-3xl text-[#F7F7F7] font-semibold'>Daily Report</h1>
      <TableContainer component={Paper}>
        <Table ref={tableRef} aria-label="collapsible table" id="table-to-xls">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Machine ID</TableCell>
              <TableCell align="right">Component Name</TableCell>
              <TableCell align="right">Operation Number</TableCell>
              <TableCell align="right">Shift Target</TableCell>

              <TableCell align="right">Qty Achieved</TableCell>
              <TableCell align="right">Per Day Target</TableCell>
              <TableCell align="right">Per Day Achieved</TableCell>
                            <TableCell align="right">Per Day Achieved Percentage</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <Row key={index} index={index} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <div className='m-5 flex justify-center text-white text-lg w-[20%] mx-auto bg-indigo-700 font-semibold py-3 rounded-md'>
          <ReactHTMLTableToExcel
        id="test-table-xls-button"
        className="download-table-xls-button"
        table="table-to-xls"
        filename="tablexls"
        sheet="tablexls"
        buttonText="Download as XLS"
        style={{Width: "20%"}}
      /> 
      </div> */}
      <DownloadTableExcel
                    filename="Report"
                    sheet="users"
                    currentTableRef={tableRef.current}
                >

                   <button className='flex justify-center mx-auto text-white bg-indigo-600 px-4  py-4 my-6 rounded-md'> Export excel </button>

                </DownloadTableExcel>
           <div className='mb-10'>
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
     
    </div>
  );
};

export default CollapsibleTablePage;
