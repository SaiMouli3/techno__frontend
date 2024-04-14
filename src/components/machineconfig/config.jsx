import { Dialog } from "@mui/material";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";
const Config = ({ selectedMachine, handleCloseView, openView }) => {
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedTools, setSelectedTools] = useState([]);
  const [toolCodeNames, setToolCodeNames] = useState([]);
  const [jobs, setJobs] = useState(null);
  const [target,setTarget] = useState(null)
  const [tools, setTools] = useState([]);

  useEffect(() => {
    if (openView) {
      fetchData();
    }
  }, [openView]);

  useEffect(() => {
    fetchDataa();
  }, []);

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
    } catch (error) {
      console.error("Error fetching tools:", error);
    }
  };
  const [machineId,setMachineId] = useState(selectedMachine.machine_id);

  const [configured,setConfigured] = useState(false);
  const { data: machiness } = useQuery({
    queryKey: ["machineconfig"],
    queryFn: async () => {
      try {
        const response = await axios.get(`https://techno.pythonanywhere.com/webapp/machines/${machineId}`);
        setConfigured(true)
        
        return response.data; // Return the data from the response
      } catch (error) {
        throw new Error("Error fetching machines"); // Throw an error if request fails
      }
    },
  });

  const handleJobChange = (selectedOption) => {
    setSelectedJob(selectedOption);
    fetchToolCodes(selectedOption.value);
    setToolCodeNames([]);
  };

  const fetchToolCodes = async (partNo) => {
    try {
      const response = await axios.get(`https://techno.pythonanywhere.com/webapp/get-tool-codes/${partNo}`);
      const decodedToolCodes = response.data.map((tool) => ({
        value: tool,
        label: tool
      }));
      setSelectedTools(decodedToolCodes);
    } catch (error) {
      console.error("Error fetching tool codes:", error);
    }
  };

  const getToolCodeNames = (selectedTool) => {
    if (!selectedTool) return [];
  const tool = tools?.find((item) => item.tool_name.toLowerCase() === selectedTool.value.toLowerCase());

    return tool ? tool.tool_codes : [];
  };

  const handleToolChange = (selectedOptions) => {
    setSelectedTools(selectedOptions);
    setToolCodeNames(Array(selectedOptions.length).fill(""));
  };

   const handleToolCodeNameChange = (selectedOption, index) => {
    const newToolCodeNames = [...toolCodeNames];
    console.log(newToolCodeNames)
    newToolCodeNames[index] = selectedOption.value;
    setToolCodeNames(newToolCodeNames);
  };

  const handleSubmit = async () => {
    try {
    
      const numSelectedTools = selectedTools.length;
      console.log(numSelectedTools)
      const machineDataArray = selectedTools?.map((tool, index) => ({
        machine_id: selectedMachine.machine_id,
        machine_name: selectedMachine.machine_id,
        target:target,
        numOfTools: numSelectedTools,
        part_no: selectedJob.value,
        tool_code: toolCodeNames[index]
      }));
      const responseDataArray = await Promise.all(machineDataArray.map(async machineData => {
        try {
          console.log(machineData)
          const response = await axios.post("https://techno.pythonanywhere.com/webapp/api/machines/create", machineData);
          
          toast.success("Machine configured successfully", {
        position: "top-center",
        autoClose: 1000,
        style: {
          width: "auto",
          style: "flex justify-center",
        },
        closeButton: false,
        progress: undefined,
      });
      
          return response.data;
        }
        
        catch (error) {
          console.error("Error submitting machine data:", error);
          throw error;
        }
      }));
          console.log(responseDataArray)  
      handleCloseView();
      setSelectedJob(null);
      setMachineId(null)
      setSelectedTools([]);
      setToolCodeNames([])
    } catch (error) {
      console.error("Error submitting machine data:", error);
    }
  };

  const uniqueJobs = jobs?.filter((job, index) => jobs?.findIndex(j => j.part_no === job.part_no) === index);
   const handleDelete = async () => { 
      try {
        const response = await axios.get(`https://techno.pythonanywhere.com/webapp/machinesss/${selectedMachine.machine_id}`);
        
        toast.success("Machine deleted successfully")
        setTimeout(()=> {
          handleCloseView()
        },[3000])
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    
  }
  return (
    <Dialog
      open={openView}
      onClose={handleCloseView}
      maxWidth="md"
      sx={{
        "& .MuiDialog-paper": {
          width: "70%",
          height:"full",
          
          paddingInline: "40px",
          padding: "20px",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          rowGap: "20px",
          overflowY:"auto"
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
      <ToastContainer className="z-[1000001]"/>
      <p>Selected Machine: {selectedMachine.machine_id}</p>
      <div>
        <label>Select Job:</label>
        {
          configured ? <div className="w-full py-2 px-2 rounded-md border-[1px] border-black/30">{machiness.part_no}</div> :         <Select options={uniqueJobs?.map(job => ({ value: job.part_no, label: job.part_no }))} value={selectedJob} onChange={handleJobChange} />

        }
      </div>
      <div>
        <label>{configured? "Target" : "Enter target:"}</label>
          {
            configured ?  <div className="w-full py-2 px-2 rounded-md border-[1px] border-black/30">{machiness.target}</div> : <input
                type="target"
                placeholder="Enter target"
                value={target}
                  onChange={(e)=> {
                    setTarget(e.target.value)
                  }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[2px] focus:ring-blue-500"
              />
          }
         
      </div>
      {!configured &&selectedJob && (
        <div>
          <label>Select Tool:</label>
          <Select options={selectedTools.map(tool => ({ value: tool, label: tool }))} value={selectedTools} onChange={handleToolChange} isMulti={true} />
        </div>
      )}
      {configured && (
  <div>
    <label>Tool Code Name:</label>
    <div className="w-full py-2 px-2 rounded-md border-[1px] border-black/30">
      {machiness?.tool_code?.map((code, index) => (
        <div key={index}>{code}</div>
      ))}
    </div>
  </div>
)}
      {!configured && selectedJob && selectedTools.length > 0 && (
        <div>
          {selectedTools.map((selectedTool, index) => (
            <div key={index}>
              <label>Tool Code Name:{selectedTool.value}</label>
<Select
  options={getToolCodeNames(selectedTool).map((code) => ({ value: code, label: code }))}
  value={{ value: toolCodeNames[index], label: toolCodeNames[index] }}
  onChange={(selectedOption) => handleToolCodeNameChange(selectedOption, index)}
/>


            </div>
          ))}
        </div>
      )}
     <div className="flex flex-row my-2 gap-x-3">
       <button className="px-5 py-2 bg-blue-500 rounded-md hover:bg-blue-700 font-semibold text-white w-[20%] mx-auto" onClick={handleSubmit}>Submit</button>
            <button className="px-5 py-2 bg-gray-300 rounded-md hover:bg-gray-400 font-semibold text-gray-800 w-[20%] mx-auto" onClick={()=>setConfigured(false)}>Update Config</button>
                   <button className="px-5 py-2 bg-red-500 rounded-md hover:bg-red-700 font-semibold text-white w-[20%] mx-auto" onClick={handleDelete}>Delete machine</button>

                  <button className="px-5 py-2 bg-gray-300 rounded-md hover:bg-gray-400 font-semibold text-gray-800 w-[20%] mx-auto" onClick={handleCloseView}>Close Config</button>

     </div>

    </Dialog>
  );
};

export default Config;
