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
} from "@syncfusion/ej2-react-grids";
import Config from "../../components/machineconfig/config";

const Machine = () => {
  const [data, setData] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [openView, setOpenView] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/nmachines");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleActionComplete = async (args) => {
    // Your code for saving or deleting data
  };

  const MachinesGrid = [
    {
      field: "machine_id",
      headerText: "Machine ID",
      width: "150",
      textAlign: "Center",
    },
  ];

  const editing = {
    allowAdding: true,
    mode: "Dialog",
  };

  const handleMachineClick = (args) => {
    setSelectedMachine(args.data);
    setOpenView(true);
  };

  const handleCloseView = () => {
    setOpenView(false);
  };


  return (
    <div className="dark:text-gray-200 dark:bg-secondary-dark-bg m-2 pt-2 md:m-10 mt-24 md:p-10 bg-white rounded-3xl">
      <GridComponent
        dataSource={data}
        width="auto"
        allowPaging
        allowSorting
        allowFiltering
        allowAdding
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
        toolbar={['Add']}
        actionComplete={handleActionComplete}
        rowSelected={handleMachineClick}
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
      {openView && selectedMachine && (
        <Config
          selectedMachine={selectedMachine}
          handleCloseView={handleCloseView}
          openView={openView}
        />
      )}
    </div>
  );
};

export default Machine;
