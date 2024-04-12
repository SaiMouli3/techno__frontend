import React from "react";
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
} from "@syncfusion/ej2-react-grids";
import { useQuery } from "@tanstack/react-query";

const DailyTable = () => {
 


 

  
 const { data: dailyentry } = useQuery({
    queryKey: ["dailyentry"],
    queryFn: async () => {
      try {
        const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/per/");

        return response.data; 
      } catch (error) {
        throw new Error("Error fetching machines");
      }
    },
  });
 
  const MachinesGrid = [
    {
      field: "id",
      headerText: " ID",
      width: "150",
      textAlign: "Center",
    },
     {
      field: "emp_ssn",
      headerText: "Employee SSN",
      width: "150",
      textAlign: "Center",
    },
     {
      field: "date",
      headerText: "Date",
      width: "150",
      textAlign: "Center",
    },
     {
      field: "shift_number",
      headerText: " Shift number",
      width: "150",
      textAlign: "Center",
    },
     {
      field: "shift_duration",
      headerText: "Shift duration",
      width: "150",
      textAlign: "Center",
    },
     {
      field: "machine_id",
      headerText: "Machine ID",
      width: "150",
      textAlign: "Center",
    },
     {
      field: "achieved",
      headerText: "Acheived",
      width: "150",
      textAlign: "Center",
    },
     {
      field: "target",
      headerText: "Target",
      width: "150",
      textAlign: "Center",
    },
     {
      field: "partial_shift",
      headerText: "Partial Shift",
      width: "150",
      textAlign: "Center",
    },
     
  ];

  
 


  return (
    <div className="dark:text-gray-200 dark:bg-secondary-dark-bg m-2 pt-2 md:m-10 mt-24 md:p-10 bg-white rounded-3xl overflow-x-auto flex whitespace-nowrap">
      <GridComponent
        dataSource={dailyentry}
        width="auto"
        allowPaging
        allowSorting
        allowFiltering
        allowAdding
        pageSettings={{ pageCount: 5 }}
    
        
      >
        <ColumnsDirective>
          {MachinesGrid.map((item, index) => (
            <ColumnDirective
              key={index}
              field={item.field}
              width={item.width}
              textAlign={item.textAlign}
              headerText={item.headerText}
            />
          ))}
        </ColumnsDirective>
        <Inject services={[Toolbar, Edit, Page, Filter]} />
      </GridComponent>
      
    </div>
  );
};

export default DailyTable;
