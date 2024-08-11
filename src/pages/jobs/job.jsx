import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  GridComponent,
  Inject,
  ColumnsDirective,
  ColumnDirective,
  Toolbar,

  Page,
  Filter,
  Sort,
  Group,
} from "@syncfusion/ej2-react-grids";
import { useQuery } from "@tanstack/react-query";
import AddJob from "../../components/JobsCRUD/JobsAdd/JobsAdd";
import { ToastContainer, toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
 
} from "@mui/material";
const HandleJobPop = ({ open, handleClose, data }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Tools</DialogTitle>
      <DialogContent>
        <div>
          {data?.map((toolCode, index) => (
            <div key={index} className="flex flex-row font-semibold">
              <span >{index+1}.</span><p>&nbsp;&nbsp;{toolCode}</p>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Job = () => {
 
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openPop,setOpenPop] = useState(false);

  useEffect(() => {
    refetch();
  }, [openAddDialog]);
 const { data ,refetch} = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/api/jobs`);
       
        return response.data; 
      } catch (error) {
        throw new Error("Error fetching machines"); 
      }
    },
  });
  useEffect(()=>{
   refetch()
  },[data,refetch])

  const handleActionComplete = async (args) => {
    if (args.requestType === "delete") {
      try {
        await axios.get(`${process.env.REACT_APP_URL}/webapp/delete-job/${args.data[0].part_no}`);
        toast.success("Job deleted successfully!!")
        refetch()
      } catch (error) {
        toast.error(error.message)
      }
    }
  };

  const handleAddJob = async (newJob) => {
    try {
    
      refetch();
    } catch (error) {
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const jobGrid = [

    {
      field: "part_no",
      headerText: "Part No",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "component_name",
      headerText: "Component Name",
      width: "150",
      textAlign: "Center",
    },

    {
      field: "operation_no",
      headerText: "Operation No",
      width: "150",
      textAlign: "Center",
    }

  ];

  const editing = {
    allowDeleting: true,
   
    mode: "Dialog",
  };
  const [selectedJob,setSelectedJob] = useState([]);
  const [dataa,setData] = useState([])
  const rowSelected = async (args) => {
    
    setSelectedJob(args.data); // Save selected job data
      

    const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/get-tool-codes1/${args.data["part_no"]}/${args.data["operation_no"]}`)
  
    setData(response.data)
    setOpenPop(true); // Open the dialog
  };

  return (
    <div className="dark:text-gray-200 dark:bg-secondary-dark-bg m-2  pt-2  md:m-10 mt-24  md:p-10 bg-white rounded-3xl">
      <button className="px-5 py-3 bg-blue-500 text-white mr-2  rounded-md hover:bg-blue-700 font-semibold" onClick={handleOpenAddDialog}>Add Job</button>
      <AddJob
        open={openAddDialog}
        handleClose={handleCloseAddDialog}
        handleAddJob={handleAddJob}
      />
      <HandleJobPop
        open={openPop}
        handleClose={() => setOpenPop(false)}
        data={dataa} // Pass selected job data to the dialog
      />
      <GridComponent
        dataSource={data}
        width="auto"
        allowPaging
        allowSorting
        allowFiltering
        allowGrouping
        allowDeleting
        toolbar={['Delete']}
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
        rowSelected={rowSelected}

        actionComplete={handleActionComplete}
      >
        <ToastContainer className="z-[1000001"/>
        <ColumnsDirective>
          {jobGrid.map((item, index) => (
            <ColumnDirective
              key={index}
              field={item.field}
              width={item.width}
              textAlign={item.textAlign}
              headerText={item.headerText}
            />
          ))}
        </ColumnsDirective>
        <Inject services={[Toolbar,Sort, Page, Filter, Group]} />
      </GridComponent>
    </div>
  );
};

export default Job;
