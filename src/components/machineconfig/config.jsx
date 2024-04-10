import { Dialog } from "@mui/material";
import React, { useState, useEffect,useMemo } from "react";
import Select from "react-select";
import axios from "axios";

const Config = ({ selectedMachine, handleCloseView, openView }) => {
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedTools, setSelectedTools] = useState([]);
  const [toolCodeNames, setToolCodeNames] = useState([]);
  const [jobs, setJobs] = useState(null);
  const [toolCodes, setToolCodes] = useState([]);
  const [machineName, setMachineName] = useState("");


const [tools,setTools] = useState([]);
const toolOptions = useMemo(() => {
  // Extract all tool names from the tools data
  const allToolNames = tools.map(tool => Object.keys(tool)[0]);

  // Filter the tool codes based on the selected tool names
  const filteredToolCodes = tools.filter(tool => selectedTools.some(selectedTool => {
    const selectedToolName = selectedTool.value.trim().toLowerCase();
    const toolName = Object.keys(tool)[0].trim().toLowerCase();
    return toolName === selectedToolName;
  }));

  return filteredToolCodes.map((item) => {
    const toolName = Object.values(item)[0];
    return { value: toolName, label: toolName };
  });
}, [tools, selectedTools]);

  useEffect(() => {
    if (openView) {
      fetchData();
    }
  }, [openView]);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/jobs/");

      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };
   const fetchDataa = async () => {
    try {
      const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/tool_reply/");

      setTools(response.data);
      console.log(tools);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };
  useEffect(()=> {
  fetchDataa()
  },[])

  const handleJobChange = (selectedOption) => {
    setSelectedJob(selectedOption);
    fetchToolCodes(selectedOption.value);
    console.log(toolCodes)
//     setSelectedTools([]); // Reset selected tools when job changes
    setToolCodeNames([]); // Reset tool code names when job changes
  };

 const fetchToolCodes = async (partNo) => {
  try {
    const response = await axios.get(`https://techno.pythonanywhere.com/webapp/get-tool-codes/${partNo}`);
    const decodedToolCodes = response.data.map((tool) => ({
      value: tool,
      label: tool
    }));
    console.log(decodedToolCodes);
    setSelectedTools(decodedToolCodes);

    console.log("Tool Names:", decodedToolCodes);
  } catch (error) {
    console.error("Error fetching tool codes:", error);
  }
};


  const handleToolChange = (selectedOptions) => {
    setSelectedTools(selectedOptions);
    setToolCodeNames(Array(selectedOptions.length).fill("")); // Set empty tool code names based on selected tools
  };

  const handleToolCodeNameChange = (selectedOption, index) => {
  const newToolCodeNames = [...toolCodeNames];
  console.log(selectedOption)
  newToolCodeNames[index] = selectedOption.value; // Set the value of toolCodeNames to the selected option's value
  setTools(newToolCodeNames);
};

    console.log(toolCodeNames)

  const handleSubmit = async () => {
  try {
    const machineDataArray = selectedTools?.map((tool,index) => ({
      machine_id: selectedMachine.machine_id,
      machine_name: selectedMachine.machine_id,
      part_no: selectedJob.value,
      tool_code: Object.values(tools[index])[0]
    }));
    console.log("Data being sent:", machineDataArray);
    const responseDataArray = await Promise.all(machineDataArray.map(async machineData => {
      try {
        console.log("Machine data being sent:", machineData);
        const response = await axios.post("https://techno.pythonanywhere.com/webapp/api/machines/create", machineData);
        console.log("Machine data submitted:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error submitting machine data:", error);
        throw error; // Re-throw error to be caught by outer try-catch block
      }
    }));

    console.log("Machine data submitted:", responseDataArray);
    handleCloseView();
  } catch (error) {
    console.error("Error submitting machine data:", error);
  }
};

const uniqueJobs = jobs?.filter((job, index) => jobs?.findIndex(j => j.part_no === job.part_no) === index);

  return (
    <Dialog
      open={openView}
      onClose={handleCloseView}
      maxWidth="md"
      sx={{
        "& .MuiDialog-paper": {
          width: "70%",
          maxHeight: "130vh",
          paddingInline: "40px",
          padding: "20px",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          rowGap: "20px",
        },
        "& .MuiDialogTitle-root": {
          textAlign: "center",
        },
        "& .MuiDialogActions-root": {
          justifyContent: "center",
        },
      }}
      className="font-medium flex flex-col gap-y-4"
    >
      <h2 className="text-center font-bold text-2xl text-gray-800">
        Machine Configuration
      </h2>
      {selectedJob && (
        <p className="text-center text-lg font-semibold text-gray-800">
          Selected Job: {selectedJob.label}
        </p>
      )}
      <p>Selected Machine: {selectedMachine.id}</p>
      <div>
        <label>Select Job:</label>

        <Select options={uniqueJobs?.map(job => ({ value: job.part_no, label: job.part_no }))} value={selectedJob} onChange={handleJobChange} />
      </div>
      {selectedJob && (
        <div>
          <label>Select Tool:</label>
          <Select
            options={selectedTools.map(tool => ({ value: tool, label: tool }))}
            value={selectedTools}
             onChange={handleToolChange}
            isMulti={true}
            />

        </div>
      )}


{selectedJob && selectedTools.length > 0 && (
        <div>
          {selectedTools.map((selectedTool, index) => (
            <div key={index}>
              <label>Tool Code Name:</label>
              <Select
                options={toolOptions}
                value={toolOptions.find(option => option.value === toolCodeNames[index])}
                onChange={(selectedOption) => handleToolCodeNameChange(selectedOption, index)}
              />
            </div>
          ))}
        </div>
      )}
      <button
        className="px-5 py-2 bg-blue-500 rounded-md hover:bg-blue-700 font-semibold text-white w-[20%] mx-auto"
        onClick={handleSubmit}
      >
        Submit
      </button>
      <button
        className="px-5 py-2 bg-gray-300 rounded-md hover:bg-gray-400 font-semibold text-gray-800 w-[20%] mx-auto"
        onClick={handleCloseView}
      >
        Close Config
      </button>
    </Dialog>
  );
};

export default Config;
