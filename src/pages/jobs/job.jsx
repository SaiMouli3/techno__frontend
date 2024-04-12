import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  GridComponent,
  Inject,
  ColumnsDirective,
  ColumnDirective,
  Toolbar,
  Edit,
  Page,
  Filter,
  Sort,
  Group,
} from "@syncfusion/ej2-react-grids";
import { useQuery } from "@tanstack/react-query";
import AddJob from "../../components/JobsCRUD/JobsAdd/JobsAdd";

const Job = () => {
 
  const [openAddDialog, setOpenAddDialog] = useState(false);

  useEffect(() => {
    refetch();
  }, [openAddDialog]);
 const { data ,refetch} = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      try {
        const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/jobs");
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
        await axios.delete(`https://techno.pythonanywhere.com/webapp/api/jobs/${args.data[0].id}`);
        refetch()
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const handleAddJob = async (newJob) => {
    try {
    console.log(newJob)
//      await axios.post("https://techno.pythonanywhere.com/webapp/api/jobs/create", newJob);
      // After adding, you can fetch updated data from the backend
      refetch();
    } catch (error) {
      console.error("Error adding data:", error);
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
    allowEditing: true,
    mode: "Dialog",
  };

  return (
    <div className="dark:text-gray-200 dark:bg-secondary-dark-bg m-2  pt-2  md:m-10 mt-24  md:p-10 bg-white rounded-3xl">
      <button className="px-5 py-3 bg-blue-500 text-white mr-2 my-2 rounded-md hover:bg-blue-700 font-semibold" onClick={handleOpenAddDialog}>Add Job</button>
      <AddJob
        open={openAddDialog}
        handleClose={handleCloseAddDialog}
        handleAddJob={handleAddJob}
      />
      <GridComponent
        dataSource={data}
        width="auto"
        allowPaging
        allowSorting
        allowFiltering
        allowGrouping
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}

        actionComplete={handleActionComplete}
      >
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
        <Inject services={[Toolbar, Edit,Sort, Page, Filter, Group]} />
      </GridComponent>
    </div>
  );
};

export default Job;
