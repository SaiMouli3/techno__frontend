import React, {  useEffect } from "react";
import axios from "axios";
import {
  GridComponent,
  Inject,
  ColumnsDirective,
  ColumnDirective,
  Toolbar,
  Edit,
  Page,
  Sort,
  Filter,
  Group,
} from "@syncfusion/ej2-react-grids";
import { useQuery } from "@tanstack/react-query";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Employee = () => {
 let grid;
  
 
   const { data: dataa ,refetch} = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      try {
        const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/employees");
        return response.data; 
      } catch (error) {
        throw new Error("Error fetching machines"); 
      }
    },
  });
  useEffect(()=>{
   refetch()
  },[dataa,refetch])

  const getCsrfToken = () => {
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrftoken='));
  if (csrfCookie) {
    return csrfCookie.split('=')[1];
  }
  return null;
    };


 const handleActionComplete = async (args) => {
  console.log(args.data)
  if (args.requestType === "save") {
    try {
      if (args.action === "add") {
         const newData = { ...args.data, emp_efficiency: 0 };
        await axios.post("https://techno.pythonanywhere.com/webapp/api/employees/create/", newData);
      } else if (args.action === "edit") {
        console.log(args.data)
        const response = await axios.post(`https://techno.pythonanywhere.com/webapp/api/employees/update/${args.data.emp_ssn}/`, args.data);
        console.log(response)
      }
      // Refresh data after adding or updating
      refetch();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  } else if (args.requestType === "delete") {
    try {
      const csrfToken = getCsrfToken();
      const response = await axios.delete(`https://techno.pythonanywhere.com/webapp/api/employees/${args.data[0].emp_ssn}`, {
        headers: {
          'X-CSRFToken': csrfToken
        }
      });
      console.log(response);
      toast.success("Employee deleted successfully");
    } catch (error) {
      toast.error(error.message);
      console.error("Error deleting data:", error);
    }
  }
 
};


  const employeesGrid = [
    {
      field: "emp_ssn",
      headerText: "SSN",
      width: "150",
      textAlign: "Center",
      isPrimaryKey:true
    },
    {
      field: "emp_name",
      headerText: "Name",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "emp_designation",
      headerText: "Designation",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "emp_shed",
      headerText: "Shed",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "emp_dept",
      headerText: "Department",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "emp_efficiency",
      headerText: "Efficiency",
      width: "150",
      textAlign: "Center",
    },
  ];
  const actionBegin = (args) => {
    console.log(grid)
  if (args.requestType === "add") {
    const cols = grid.columnModel;
    for (const col of cols) {
      if (col.field === "emp_efficiency") {
        col.visible = false;
      }
    }
  } else {
    const cols = grid?.columnModel;
    for (const col of cols) {
      if (col.field === "emp_efficiency") {
        col.visible = true;
      }
    }
  }
};

const dataBound = () => {
        if (grid) {
            const column = grid.columns[0];
            column.isPrimaryKey = true;
        }
    };
  const editing = {
    allowAdding: true,
    allowDeleting:true,
     allowEditing:true,
    mode: "Dialog",
  };

  return (
    <div className="dark:text-gray-200 dark:bg-secondary-dark-bg m-2 pt-2 md:m-10 mt-24 md:p-10 bg-white rounded-3xl">
      <GridComponent
        dataSource={dataa}
        width="auto"
        allowPaging
        allowSorting
        allowFiltering
        dataBound={dataBound}
        allowGrouping
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
        toolbar={["Add","Delete"]}
        actionBegin={actionBegin}
        actionComplete={handleActionComplete}
          ref={g => grid = g}
      >
        <ToastContainer className="z-[100001]"/>
        <ColumnsDirective>
          {employeesGrid.map((item, index) => (
            <ColumnDirective
              key={index}
              field={item.field}
              width={item.width}
              textAlign={item.textAlign}
              headerText={item.headerText}
            />
          ))}
        </ColumnsDirective>
        <Inject services={[Toolbar, Edit, Page, Filter,Sort, Group]} />
      </GridComponent>
    </div>
  );
};

export default Employee;
