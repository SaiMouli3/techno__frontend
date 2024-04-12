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
    if (args.requestType === "save") {
      try {
        await axios.post("https://techno.pythonanywhere.com/webapp/api/employees/create/", args.data);
        refetch();
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    } else if (args.requestType === "delete") {
      try {
        const csrfToken = getCsrfToken();
        
        const response = await axios.get(`https://techno.pythonanywhere.com/webapp/api/employees/${args.data[0].emp_ssn}`, {
        headers: {
        'X-CSRFToken': csrfToken
        }
        
    });
console.log(response);
toast.success("Employee deleted successfully")
        
      } catch (error) {
        toast.error(error.message)
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

  const editing = {
    allowAdding: true,
    allowDeleting:true,
   
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
        allowGrouping
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
        toolbar={["Add","Delete"]}
        actionComplete={handleActionComplete}
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
