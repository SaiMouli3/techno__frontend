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
import AddTool from "../../components/toolsCRUD/toolAdd/Tooladd";

const Tool = () => {
  const [data, setData] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [toolName, setToolName] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [cost, setCost] = useState("");
  const [numTools, setNumTools] = useState(1);
  const [toolNumbers, setToolNumbers] = useState([]);
  const [toolCodes, setToolCodes] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/webapp/api/tools/");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleActionComplete = async (args) => {
    if (args.requestType === "save") {
      try {
        // Iterate over the new tools and send a POST request for each tool
        for (const newTool of args.data) {
          await axios.post("http://127.0.0.1:8000/webapp/api/tools/create", newTool);
        }
        fetchData();
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    } else if (args.requestType === "delete") {
      try {
        await axios.delete(`http://127.0.0.1:8000/webapp/api/tools/${args.data[0].id}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const toolGrid = [
    {
      field: "tool_code",
      headerText: "Tool Code",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "tool_name",
      headerText: "Tool Name",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "max_life_expectancy_in_mm",
      headerText: "Max Life Expectancy",
      width: "200",
      textAlign: "Center",
    },
    {
      field: "cost",
      headerText: "Cost",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "length_cut_so_far",
      headerText: "Length Cut So Far",
      width: "200",
      textAlign: "Center",
    },
    {
      field: "no_of_brk_points",
      headerText: "No of Break Points",
      width: "200",
      textAlign: "Center",
    },
    {
      field: "tool_efficiency",
      headerText: "Tool Efficiency",
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

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddTool = async (newTools) => {
    try {
      for (const newTool of newTools) {
        await axios.post("http://127.0.0.1:8000/webapp/api/tools/create", newTool);
      }
      fetchData();
      setOpenAddDialog(false);
    } catch (error) {
      console.error("Error adding tools:", error);
    }
  };

  const handleAdd = async () => {
    if (toolName && maxLength && cost && numTools && Object.keys(toolCodes).length === numTools) {
      const newTools = [];
      for (let i = 0; i < numTools; i++) {
        const newTool = {
          tool_code: toolCodes[i + 1], // Get tool code from state
          tool_name: toolName,
          max_life_expectancy_in_mm: parseFloat(maxLength),
          cost: parseFloat(cost),
          length_cut_so_far: 0, // Default value
          no_of_brk_points: 0, // Default value
          tool_efficiency: 100, // Initial value
          tool_number: i + 1,
        };
        newTools.push(newTool);
      }
      try {
        await handleAddTool(newTools);
        setToolName("");
        setMaxLength("");
        setCost("");
        setNumTools(1);
        setToolNumbers([]);
        setToolCodes({});
      } catch (error) {
        console.error("Error adding tools:", error);
        alert("Error adding tools. Please try again.");
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleToolCodeChange = (toolNumber, value) => {
    setToolCodes({ ...toolCodes, [toolNumber]: value });
  };

  const handleNumToolsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setNumTools(value);
      setToolNumbers(Array.from({ length: value }, (_, i) => i + 1));
    }
  };

  return (
    <div className="dark:text-gray-200 dark:bg-secondary-dark-bg m-2 pt-2 md:m-10 mt-24 md:p-10 bg-white rounded-3xl">
      <button className="px-5 py-3 bg-blue-500 text-white mr-2 my-2 rounded-md hover:bg-blue-700 font-semibold" onClick={handleOpenAddDialog}>Add Tool</button>
      <AddTool
        open={openAddDialog}
        handleClose={handleCloseAddDialog}
        handleAddTool={handleAddTool}
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
        toolbar={["Add", "Edit", "Delete", "Update", "Cancel"]}
        actionComplete={handleActionComplete}
      >
        <ColumnsDirective>
          {toolGrid.map((item, index) => (
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

export default Tool;
