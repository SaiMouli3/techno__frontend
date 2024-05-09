import React from 'react';
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
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const data = [
  {
    "machine_no": "M001",
    "components": ["ComponentA", "ComponentB"],
    "operation_no": "OP001",
    "cycle_time": 10,
    "shift_targets": [100, 120, 110],
    "qty_achieved": [95, 115, 105],
    "per_day_target": 300,
    "per_day_achieved": 290
  },
  {
    "machine_no": "M002",
    "components": ["ComponentC"],
    "operation_no": "OP002",
    "cycle_time": 15,
    "shift_targets": [90, 100, 95],
    "qty_achieved": [88, 98, 93],
    "per_day_target": 250,
    "per_day_achieved": 239
  },
  {
    "machine_no": "M003",
    "components": ["ComponentA"],
    "operation_no": "OP001",
    "cycle_time": 12,
    "shift_targets": [110, 130, 120],
    "qty_achieved": [105, 125, 115],
    "per_day_target": 320,
    "per_day_achieved": 310
  },
  {
    "machine_no": "M004",
    "components": ["ComponentB"],
    "operation_no": "OP002",
    "cycle_time": 18,
    "shift_targets": [95, 105, 100],
    "qty_achieved": [92, 102, 97],
    "per_day_target": 270,
    "per_day_achieved": 260
  },
  {
    "machine_no": "M005",
    "components": ["ComponentA", "ComponentC"],
    "operation_no": "OP001",
    "cycle_time": 14,
    "shift_targets": [105, 120, 110],
    "qty_achieved": [100, 118, 108],
    "per_day_target": 330,
    "per_day_achieved": 320
  }
]

const CollapsibleTablePage = () => {
  return (
    <div className='m-10'>
      <h1>Collapsible Table Page</h1>
      <CollapsibleTable />
    </div>
  );
};

export default CollapsibleTablePage;

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
          {row.machine_no}
        </TableCell>
        <TableCell align="right">{row.operation_no}</TableCell>
        <TableCell align="right">{row.cycle_time}</TableCell>
        <TableCell align="right">{row.shift_targets.join(', ')}</TableCell>
        <TableCell align="right">{row.qty_achieved.join(', ')}</TableCell>
        <TableCell align="right">{row.per_day_target}</TableCell>
        <TableCell align="right">{row.per_day_achieved}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Components
              </Typography>
              <Typography component="div">
                {row.components.join(', ')}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export function CollapsibleTable() {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table" id="table-to-xls">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Machine No</TableCell>
              <TableCell align="right">Operation No</TableCell>
              <TableCell align="right">Cycle Time</TableCell>
              <TableCell align="right">Shift Targets</TableCell>
              <TableCell align="right">Qty Achieved</TableCell>
              <TableCell align="right">Per Day Target</TableCell>
              <TableCell align="right">Per Day Achieved</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <Row key={index} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ReactHTMLTableToExcel
        id="test-table-xls-button"
        className="download-table-xls-button"
        table="table-to-xls"
        filename="tablexls"
        sheet="tablexls"
        buttonText="Download as XLS"
      />
    </div>
  );
}
