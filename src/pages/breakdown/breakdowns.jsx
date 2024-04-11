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
import AddBreakdown from "./Addbreakdown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BreakDown = () => {
  const [data, setData] = useState([]);
  const [openAddBreakdown, setOpenAddBreakdown] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/breakdown");

      setData(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(()=> {
  fetchData()},[]);


  const handleActionComplete = async (args) => {
    if (args.requestType === "save") {
      try {
        await axios.post("https://techno.pythonanywhere.com/webapp/api/breakdown/create", args.data);
        toast.success("BreakDown added successfully", {
        position: "top-center",
        autoClose: 1000,
        style: {
          width: "auto",
          style: "flex justify-center",
        },
        closeButton: false,
        progress: undefined,
      });
        fetchData();
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    } else if (args.requestType === "delete") {
    try {

      const toolCode = args.data[0].tool_code;
      await axios.delete(`https://techno.pythonanywhere.com/webapp/api/breakdown/${toolCode}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
      }
    }
  };

  const handleOpenAddBreakdown = () => {
    setOpenAddBreakdown(true);
  };

  const handleCloseAddBreakdown = () => {
    setOpenAddBreakdown(false);
  };

  const handleAddBreakdown = (newBreakdown) => {
   console.log(newBreakdown)
    axios.post('https://techno.pythonanywhere.com/webapp/api/breakdown/create', newBreakdown)
      .then(response => {
        console.log('Breakdown added successfully:', response.data);
        fetchData();
        handleCloseAddBreakdown();
      })
      .catch(error => {
        console.error('Error adding breakdown:', error.message);
      });
  };

  const handleBreakdownClick = (args) => {
    setSelectedBreakdown(args.data);
    setOpenView(true);
  };



  const breakdownGrid = [
     {field:"checkbox"},
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
const handleResolveBreakDown = (props) => {
  const { date,  tool_code } = props;
  console.log(tool_code);



  axios.get(`https://techno.pythonanywhere.com/webapp/api/break/${tool_code}/${date}`)
      .then(response => {
        toast.success('Breakdown resolved successfully:');
        fetchData();
      })
      .catch(error => {
      toast.error(error.message);
        console.error('Error adding breakdown:', error);
      });
};

  return (
    <div className="dark:text-gray-200 dark:bg-secondary-dark-bg m-2 pt-2 md:m-10 mt-24 md:p-10 bg-white rounded-3xl">
      <button className="px-5 py-3 bg-blue-500 text-white mr-2 my-2 rounded-md hover:bg-blue-700 font-semibold" onClick={handleOpenAddBreakdown}>Add breakdown</button>
      <ToastContainer/>
      <AddBreakdown
        open={openAddBreakdown}
        handleClose={handleCloseAddBreakdown}
        handleAddBreakdown={handleAddBreakdown}
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

        actionComplete={handleActionComplete}
        rowSelected={handleBreakdownClick}
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
         <ColumnDirective headerText="Resolve" width="150" template={(props) => (
                        <button className="bg-blue-500 rounded-sm py-2 px-4 text-white">
                            <button onClick={() => handleResolveBreakDown(props)}>Resolve</button>
                        </button>
                    )}></ColumnDirective>
        </ColumnsDirective>
        <Inject services={[Toolbar, Edit, Page, Group, Filter]} />
      </GridComponent>
 </div>


  );
};

export default BreakDown;
