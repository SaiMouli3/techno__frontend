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
  Group,
} from "@syncfusion/ej2-react-grids";

const Employee = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/employees/");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
        fetchData();
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    } else if (args.requestType === "delete") {
      try {
        const csrfToken = getCsrfToken();
        await axios.delete(`https://techno.pythonanywhere.com/webapp/api/employees/${args.data[0].emp_ssn}`, {
        headers: {
        'X-CSRFToken': csrfToken
        }
    });

        fetchData();
      } catch (error) {
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
    allowDeleting: true,
    allowEditing: true,
    mode: "Dialog",
  };

  return (
    <div className="dark:text-gray-200 dark:bg-secondary-dark-bg m-2 pt-2 md:m-10 mt-24 md:p-10 bg-white rounded-3xl">
      <GridComponent
        dataSource={data}
        width="auto"
        allowPaging
        allowSorting
        allowFiltering
        allowGrouping
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
        toolbar={["Add", "Edit", "Delete", "Update", "Cancel"]}
        actionComplete={handleActionComplete}
      >
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
        <Inject services={[Toolbar, Edit, Page, Filter, Group]} />
      </GridComponent>
    </div>
  );
};

export default Employee;
