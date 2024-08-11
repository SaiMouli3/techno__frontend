// import React, { useState } from "react";
// import {
//   Button,
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Paper,
//   TablePagination,
//   TextField,
// } from "@mui/material";
// import JobView from "../../components/JobsCRUD/JobsView/JobsView";
// import { JobsData } from "../../data";
// import AddJob from "../../components/JobsCRUD/JobsAdd/JobsAdd";


// const Jobs = () => {
//   const [data, setData] = useState(JobsData);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(7);
//   const [openView, setOpenView] = useState(false);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [openAddDialog, setOpenAddDialog] = useState(false); // State to control the visibility of the Add Job dialog

//   const handleAddJob = (newJob) => {
//     setData([...data, newJob]);
//     setOpenAddDialog(false); // Close the Add Job dialog after adding a job
//   };

//   const handleDeleteJob = (jobId) => {
//     setData(data.filter((job) => job.id !== jobId));
//   };

//   const handleViewJob = (job) => {
//     setSelectedJob(job);
//     setOpenView(true);
//   };

//   const handleCloseView = () => {
//     setOpenView(false);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleSearch = () => {
//     // Logic to filter data based on search term
    
//   };

//   const handleOpenAddDialog = () => {
//     setOpenAddDialog(true);
//   };

//   const handleCloseAddDialog = () => {
//     setOpenAddDialog(false);
//   };

//   return (
//     <div className="job-container">
//       <h1>JOBS MANAGEMENT</h1>
//       <div className="text-field-container">
//         <Button
//           className="add-button"
//           variant="contained"
//           color="primary"
//           top="20px"
//           onClick={handleOpenAddDialog} // Open the Add Job dialog when clicking the button
//         >
//           Add Job
//         </Button>
//         <TextField
//           className="text-field"
//           label="Search Job Name"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onKeyDown={handleSearch}
//         />
//       </div>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell className="table-header">Job ID</TableCell>
//               <TableCell className="table-header">Job Name</TableCell>
//               <TableCell className="table-header">Job Length</TableCell>
//               <TableCell className="table-header">No. of Holes</TableCell>
//               <TableCell className="table-header">Tool Code</TableCell>
//               <TableCell className="table-header">Action</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((row) => (
//                 <TableRow key={row.id}>
//                   <TableCell className="table-cell">{row.id}</TableCell>
//                   <TableCell className="table-cell">{row.name}</TableCell>
//                   <TableCell className="table-cell">{row.length}</TableCell>
//                   <TableCell className="table-cell">{row.holesCount}</TableCell>
//                   <TableCell className="table-cell">{row.toolCode}</TableCell>
//                   <TableCell>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() => handleDeleteJob(row.id)}
//                     >
//                       Delete
//                     </Button>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       style={{ marginLeft: 10 }}
//                       onClick={() => handleViewJob(row)}
//                     >
//                       View
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <TablePagination
//         className="job-pagination"
//         rowsPerPageOptions={[2, 4, 10, 15, { label: "All", value: -1 }]}
//         component="div"
//         count={data.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />

//       <JobView
//         open={openView}
//         handleClose={handleCloseView}
//         selectedJob={selectedJob}
//       />

//       {/* Render the AddJob component */}
//       <AddJob
//         open={openAddDialog}
//         handleClose={handleCloseAddDialog}
//         handleAddJob={handleAddJob}
//       />
//     </div>
//   );
// };

// export default Jobs;
