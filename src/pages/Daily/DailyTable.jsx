import React, { useState } from "react";
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
  PdfExport,
  ExcelExport,
  Group
} from "@syncfusion/ej2-react-grids";
import { useQuery } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DailyTable = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  let grid;

  const toolbarClick = (args) => {
   
    if (grid) {
      const id = args.item.properties.id;
      if (id && id.includes("Grid_") && id.includes("_excelexport")) {
        grid.excelExport();
      } else if (id && id.includes("Grid_") && id.includes("_pdfexport")) {
        grid.pdfExport();
      }
    }
  };

  const { data: dailyentry, refetch } = useQuery({
    queryKey: ["dailyentry"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/webapp/api/per/`);
        const data = response.data.map(item => ({
          ...item,
          efficiency: item.efficiency ? item.efficiency.toFixed(2) : '0.00'
        }));
        return data;
      } catch (error) {
        throw new Error("Error fetching data");
      }
    },
  });

 

 const MachinesGrid = [
  {
    field: "id",
    headerText: "ID",
    width: "150",
    textAlign: "Center",
    allowEditing: false,  // Make this field non-editable
  },
  {
    field: "emp_ssn",
    headerText: "Employee SSN",
    width: "150",
    textAlign: "Center",
    allowEditing: false,  // Make this field non-editable
  },
  {
    field: "emp_name",
    headerText: "Employee Name",
    width: "150",
    textAlign: "Center",
    allowEditing: false,  // Make this field non-editable
  },
  {
    field: "date",
    headerText: "Date",
    width: "150",
    textAlign: "Center",
    allowEditing: false,  // Make this field non-editable
  },
  {
    field: "shift_number",
    headerText: "Shift Number",
    width: "150",
    textAlign: "Center",
    allowEditing: false,  // Make this field non-editable
  },
  {
    field: "shift_duration",
    headerText: "Shift Duration",
    width: "150",
    textAlign: "Center",
    allowEditing: false,  // Make this field non-editable
  },
  {
    field: "machine_id",
    headerText: "Machine ID",
    width: "150",
    textAlign: "Center",
    allowEditing: false,  // Make this field non-editable
  },
  {
    field: "achieved",
    headerText: "Achieved",
    width: "150",
    textAlign: "Center",
    allowEditing: false,  // Make this field non-editable
  },
  {
    field: "target",
    headerText: "Target",
    width: "150",
    textAlign: "Center",
    allowEditing: false,  // Make this field non-editable
  },
  {
    field: "incentive_received",
    headerText: "Incentive Received",
    width: "150",
    textAlign: "Center",
    allowEditing: true,  // Make this field editable
  },
  {
    field: "remarks",
    headerText: "Remarks",
    width: "150",
    textAlign: "Center",
    allowEditing: false,  // Make this field non-editable
  },
  {
    field: "partial_shift",
    headerText: "Partial Shift",
    width: "150",
    textAlign: "Center",
    allowEditing: false,  // Make this field non-editable
  },
  {
    field: "efficiency",
    headerText: "Efficiency",
    width: "150",
    textAlign: "Center",
    allowEditing: false,  // Make this field non-editable
  },
];


  const filterData = () => {
    if (!startDate || !endDate) return dailyentry;
    const filteredData = dailyentry.filter(
      (item) =>
        new Date(item.date) >= new Date(startDate) &&
        new Date(item.date) <= new Date(endDate)
    );
    return filteredData;
  };

  const handleActionComplete = async (args) => {
  
    if (args.requestType === "delete") {
      try {
        const {id, date, emp_ssn, shift_number } = args.data[0];
         await axios.post(`${process.env.REACT_APP_URL}/webapp/performs/${encodeURIComponent(date)}/${encodeURIComponent(emp_ssn)}/${shift_number}/delete/`,{
         id: id
        });
        toast.success("Daily entry deleted successfully");
        refetch()
      } catch (error) {
        refetch();
        toast.error(error.message);
        
      }
    } else if (args.requestType === "save") {
    try {
      
      const {
        date,
        emp_ssn,
        target,
        achieved,
        machine_id,
        efficiency,
        incentive_received, 
      } = args.data;

      await axios.post(`${process.env.REACT_APP_URL}/webapp/performs/update-incentive/`, {
        date,
        emp_ssn,
        target,
        achieved,
        machine_id,
        efficiency,
        incentive_received: parseFloat(incentive_received).toFixed(2) // Format incentive_received
      });

      toast.success("Daily entry updated successfully");
      refetch();
    } catch (error) {
      refetch();
      toast.error(error.response ? error.response.data : error.message);
     
    }
  }
  };

  const editing = {
    allowDeleting: true,
    allowEditing: true,
    mode: "Dialog",
  };

  return (
    <div className="dark:text-gray-200 dark:bg-secondary-dark-bg m-2 pt-2 md:m-10 mt-24 md:p-10 bg-white rounded-3xl">
    <ToastContainer/>
      <GridComponent
        dataSource={filterData()}
        width="auto"
        id="Grid"
        allowPaging
        allowSorting
        allowFiltering
        allowGrouping
        allowExcelExport
        allowPdfExport
        editSettings={editing}
        pageSettings={{ pageCount: 5 }}
        actionComplete={handleActionComplete}
        toolbar={['Edit','Delete', 'ExcelExport', 'PdfExport']}
        toolbarClick={toolbarClick}
        sortSettings={{ columns: [{ field: 'id', direction: 'Descending' }] }}
        ref={(g) => (grid = g)}
      >
        <ColumnsDirective>
          {MachinesGrid.map((item, index) => (
            <ColumnDirective
              key={index}
              field={item.field}
              width={item.width}
              textAlign={item.textAlign}
              headerText={item.headerText}
              allowEditing={item.allowEditing}
            />
          ))}
        </ColumnsDirective>
        <Inject services={[Toolbar, Edit, Page, Filter, Sort, ExcelExport, PdfExport, Group]} />
      </GridComponent>
    </div>
  );
};

export default DailyTable;
