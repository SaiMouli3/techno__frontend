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
  Group
} from "@syncfusion/ej2-react-grids";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from 'react-router-dom';

const Resolve = () => {
  const location = useLocation();
  const breakdownData = location.state.breakdown;


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("")
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const breakdownGrid = [
    { field: "date", headerText: "Date", width: "120", textAlign: "Center" },
    { field: "length_used", headerText: "Length Used", width: "150", textAlign: "Center" },
    { field: "expected_length_remaining", headerText: "Expected Length Remaining", width: "200", textAlign: "Center" },
    { field: "replaced_by", headerText: "Replaced By", width: "150", textAlign: "Center" },
    { field: "reason", headerText: "Reason", width: "150", textAlign: "Center" },
    { field: "change_time", headerText: "Change Time", width: "150", textAlign: "Center" },
    { field: "no_of_min_into_shift", headerText: "Minutes Into Shift", width: "150", textAlign: "Center" },
    { field: "machine_id", headerText: "Machine ID", width: "150", textAlign: "Center" },
    { field: "tool_code", headerText: "Tool Code", width: "150", textAlign: "Center" }
  ];

  const editing = {
    allowAdding: true,
    allowDeleting: true,
    allowEditing: true,
    mode: "Dialog"
  };

  return (
    <div className="dark:text-gray-200 dark:bg-secondary-dark-bg m-2 pt-2 md:m-10 mt-24 md:p-10 bg-white rounded-3xl">
      <ToastContainer/>
      <GridComponent
        dataSource={[breakdownData]}
        width="auto"
        allowPaging
        allowSorting
        allowFiltering
        allowGrouping
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
        toolbar={["Add", "Edit", "Delete", "Update", "Cancel"]}
      >
        <ColumnsDirective>
          {breakdownGrid.map((item, index) => (
            <ColumnDirective
              key={index}
              field={item.field}
              width={item.width}
              textAlign={item.textAlign}
              headerText={item.headerText}
            />
          ))}
        </ColumnsDirective>
        <Inject services={[Toolbar, Edit, Page, Group, Filter]} />
      </GridComponent>
    </div>
  );
};

export default Resolve;
