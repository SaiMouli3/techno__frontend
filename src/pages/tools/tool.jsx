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
  Group
} from "@syncfusion/ej2-react-grids";
import { useQuery } from "@tanstack/react-query";
import AddTool from "../../components/toolsCRUD/toolAdd/Tooladd";
import { ToastContainer, toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
const Tool = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [toolName, setToolName] = useState("");
  const [maxLength, setMaxLength] = useState("");
  const [cost, setCost] = useState("");
  const [numTools, setNumTools] = useState(1);
  const [toolNumbers, setToolNumbers] = useState([]);
  const [toolCodes, setToolCodes] = useState({});

   const { data ,refetch} = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      try {
        const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/tools");
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
    if (args.requestType === "save") {
      try {
        // Iterate over the new tools and send a POST request for each tool
        for (const newTool of args.data) {
          await axios.post("https://techno.pythonanywhere.com/webapp/api/tools/create", newTool);
        }
        refetch();
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    } else if (args.requestType === "delete") {
      console.log(args.data[0].tool_name)
      try {
        await axios.get(`https://techno.pythonanywhere.com/webapp/delete-tools/${args.data[0].tool_name}/`);
        toast.success("Tool deleted successfully!!")
        refetch();
      } catch (error) {
        toast.error("Couldn't delete tool. Please try again");
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
        await axios.post("https://techno.pythonanywhere.com/webapp/api/tools/create", newTool);
      }
      refetch();
      setOpenAddDialog(false);
    } catch (error) {
      console.log("Error adding tools:", error);
    }
  };
  const {

    currentMode,
    activeMenu,
   
  } = useStateContext();
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
    <div className="dark:text-gray-200 dark:bg-secondary-dark-bg  m-2 pt-2 md:m-10 mt-24 md:p-10 bg-white rounded-3xl">
      <button className="px-5 py-3 bg-blue-500 text-white mr-2 my-2 rounded-md hover:bg-blue-700 font-semibold" onClick={handleOpenAddDialog}>Add Tool</button>
      <AddTool
        open={openAddDialog}
        handleClose={handleCloseAddDialog}
        handleAddTool={handleAddTool}
      />
      <div className="overflow-x-auto w-full">
        <GridComponent
        dataSource={data}
        width="auto"
        allowPaging
        allowSorting
        allowFiltering
        allowGrouping
        allowDeleting
        toolbar={['Delete']}
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
        actionComplete={handleActionComplete}
      >
        <ToastContainer className="z-[100001]"/>
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
        <Inject services={[Toolbar, Edit,Sort, Page, Filter, Group]} />
      </GridComponent>
      </div>
    </div>
  );
};

export default Tool;
