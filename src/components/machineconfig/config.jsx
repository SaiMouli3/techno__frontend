import { Dialog } from "@mui/material";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

const Config = ({ selectedMachine, handleCloseView, openView }) => {
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedTools, setSelectedTools] = useState([]);
  const [toolCodeNames, setToolCodeNames] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [toolCodes, setToolCodes] = useState([]);
  const [machineName, setMachineName] = useState("");

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

  const handleJobChange = (selectedOption) => {
    setSelectedJob(selectedOption);
    fetchToolCodes(selectedOption.value);
    setSelectedTools([]); // Reset selected tools when job changes
    setToolCodeNames([]); // Reset tool code names when job changes
  };

  const fetchToolCodes = async (partNo) => {
    try {
      const response = await axios.get(`https://techno.pythonanywhere.com/webapp/get-tool-codes/${partNo}`);
      setToolCodes(response.data);
    } catch (error) {
      console.error("Error fetching tool codes:", error);
    }
  };

  const handleToolChange = (selectedOptions) => {
    setSelectedTools(selectedOptions);
    setToolCodeNames(Array(selectedOptions.length).fill("")); // Set empty tool code names based on selected tools
  };

  const handleToolCodeNameChange = (e, index) => {
    const newToolCodeNames = [...toolCodeNames];
    newToolCodeNames[index] = e.target.value;
    setToolCodeNames(newToolCodeNames);
  };

  const handleSubmit = async () => {
  try {
    const machineDataArray = selectedTools.map(tool => ({
      machine_id: selectedMachine.machine_id,
      machine_name: selectedMachine.machine_id,
      part_no: selectedJob.value,
      tool_code: tool.value
    }));

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
        <Select options={jobs.map(job => ({ value: job.part_no, label: job.part_no }))} value={selectedJob} onChange={handleJobChange} />
      </div>
      {selectedJob && (
        <div>
          <label>Select Tool:</label>
          <Select
            options={toolCodes.map(tool => ({ value: tool.tool_code, label: tool.tool_code }))}
            value={selectedTools}
            onChange={handleToolChange}
            isMulti={true}
          />
        </div>
      )}
      {selectedJob && selectedTools.length > 0 && (
        <div>
          {selectedTools.map((tool, index) => (
            <div key={index}>
              <label>Tool Code Name ({tool.label}):</label>
              <input
                type="text"
                value={toolCodeNames[index]}
                onChange={(e) => handleToolCodeNameChange(e, index)}
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
