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

const Resolve = () => {
    const [resolve,setResolve] = useState([]);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/rev");
      setResolve(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const breakdownGrid = [
    { field: "tool_code", headerText: "Tool code", width: "120", textAlign: "Center" },
    { field: "Date", headerText: "Date", width: "150", textAlign: "Center" },

  ];



  return (
    <div className="dark:text-gray-200 dark:bg-secondary-dark-bg m-2 pt-2 md:m-10 mt-24 md:p-10 bg-white rounded-3xl">
      <ToastContainer/>
      <GridComponent
        dataSource={resolve}
        width="auto"
        allowPaging
        allowSorting
        allowFiltering
        allowGrouping
        pageSettings={{ pageCount: 5 }}

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
