import React, { useState, useEffect,useMemo } from "react";
import Select from "react-select";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";

const Daily = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [selectedShift, setSelectedShift] = useState("");

  const [selectedMachines, setSelectedMachines] = useState([]);
    const [selectedMachiness, setSelectedMachiness] = useState([]);


  const { data: machiness, isLoading, isError } = useQuery({
    queryKey: ["machines"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "https://techno.pythonanywhere.com/webapp/api/machines"
        );
        return response.data; // Return the data from the response
      } catch (error) {
        throw new Error("Error fetching machines"); // Throw an error if request fails
      }
    },
  });
  const machineOptions = machiness?.map((machine) => ({
    label: `${machine.machine_name} - ${machine.machine_id}`,
    value: machine.id,
  }));

  const [submittedData, setSubmittedData] = useState(null);
  const [target, setTarget] = useState(0);
  const [achieved, setAchieved] = useState(0);
  const [showHoursInput, setShowHoursInput] = useState(false);
  const [hours, setHours] = useState(8);
  const [date, setDate] = useState("");
  const [machineData, setMachineData] = useState([]);
  const [breakdown, setBreakdown] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/employees/");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(()=> {
    fetchData();
  },[])

  const handleData = () => {
  // Check if all required fields are filled
  if (!date || !employeeName || !selectedShift || selectedMachines.length === 0) {
    toast.error("Please fill in all the required fields", {
      position: "top-center",
      autoClose: 2000,
      style: {
        width: "auto",
        justifyContent: "center",
      },
    });
    return;
  }

  const formData = {
    employeeName,
    selectedShift,
    selectedMachines,
  };
  setSubmittedData(formData);

  // Initialize machineData with default values
  console.log(selectedMachiness)
  const initialData = selectedMachiness.map((machine) => ({
    label: machine.label,
    achieved: 0,
    target: 0,
    breakdown: breakdown ? 1 : 0,
  }));
  setMachineData(initialData);
};





  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Create an array to store all promises
      const postRequests = [];
      const shiftNumberMap = {
        shift1: 1,
        shift2: 2,
        shift3: 3,
      };
      // Loop through machineData to create separate records for each machine
      console.log(machineData)
      machineData.forEach((machine) => {
        const machineId = machine.label.split(" - ")[1];
        console.log(date);
        const formData = {
          date: date,
          emp_ssn: employeeName,
          shift_number: shiftNumberMap[selectedShift],
          shift_duration: 8,
          machine_id: machineId, // Send only the current machine's data
          achieved: machine.achieved,
          target: machine.target,
          partial_shift: hours,
        };

        console.log(formData);
        // Create a separate POST request for each record and push it to postRequests array
        postRequests.push(
          axios.post(
            "https://techno.pythonanywhere.com/webapp/api/submit-performance",
            formData
          )
        );
      });

      // Execute all POST requests concurrently using Promise.all
      const responses = await Promise.all(postRequests);

      // Log each response from the server
      responses.forEach((response) => {
        console.log(response.data);
      });
      toast.success("Daily entry added successfully", {
        position: "top-center",
        autoClose: 1000,
        style: {
          width: "auto",
          justifyContent: "center",
        },
      });
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 1000,
        style: {
          width: "auto",
          justifyContent: "center",
        },
      });
      console.error("Error:", error);
    }
  };

  // const handleMachineChange = (selectedOptions) => {
  //   setSelectedMachines(selectedOptions);
  //   console.log(selectedMachines)
  //   // Reset machineData when machines change
  //   setMachineData([]);
  // };
  const handleMachineChangee = (event, newValue) => {
    console.log(newValue)
  const selectedValues = selectedMachiness.filter((v) => v.selected);
  setSelectedMachiness(newValue);
  console.log(selectedValues);
  //Reset machineData when machines change
  setMachineData([]);
};



  const handleBreakdownChange = (index, checked) => {
    const updatedData = [...machineData];
    updatedData[index]["breakdown"] = checked ? 1 : 0;
    setMachineData(updatedData);
  };
 const handleInputChange = (index, key, value) => {
  const updatedData = [...machineData];
  updatedData[index] = {
    ...updatedData[index],
    [key]: value,
  };
  setMachineData(updatedData);
};


  if (submittedData) {
    return (
      <div className=" min-h-screen py-8 px-4">
        <h1 className="text-3xl text-white font-bold text-center mb-8">
          Daily Submissions
        </h1>
        <ToastContainer className="z-[10001]"/>
       
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-4">
          {submittedData && (
            <>
              {/* <h3 className="text-lg font-semibold mb-2">
                Machine: {submittedData.selectedMachines[0].label}
              </h3> */}
              <p className="text-lg mb-2 font-semibold  ">
                Shift: {submittedData.selectedShift}
              </p>
            </>
          )}
           <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {selectedMachiness.map((machine, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Machine: {machine.label}</h3>
                <input
                  type="number"
                  placeholder="Achieved"
                  value={machineData[index]?.achieved || ""}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                  onChange={(e) => handleInputChange(index, 'achieved', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Target"
                  value={machineData[index]?.target || ""}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                  onChange={(e) => handleInputChange(index, 'target', e.target.value)}
                />

              </div>

            ))}
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                className="mr-2"
                onChange={() => setShowHoursInput(!showHoursInput)}
              />
              Partial Shift
            </label>
            {showHoursInput && (
              <input
                type="number"
                placeholder="Number of Minutes into shift"
                value={hours}
                  onChange={(e)=> {
                    setHours(e.target.value)
                  }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
              />
            )}
            {/* Include your logic for hours input based on your requirements */}
            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700">
              Submit
            </button>
          </div>
        </form>
        </div>
      </div>
    );
  }


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full px-8 py-6 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Daily Entry Form
        </h2>

        <form className="space-y-6">
        <div>

            <label
              htmlFor="date"
              className="block text-lg font-medium text-gray-700"
            >
              Date:
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
            />
          </div>
          <div>
  <label
    htmlFor="employeeName"
    className="block text-lg font-medium text-gray-700"
  >
    Employee SSN:
  </label>
  <input
    type="text"
    id="employeeName"
    value={employeeName}
    onChange={(e) => setEmployeeName(e.target.value)}
    required
    className="mt-1 block w-full border-[1px] border-black/20 px-1 rounded-md py-2 shadow-sm focus:ring focus:ring-indigo-500 bg-white"
    style={{ backgroundColor: "#ffffff" }} // Add this style
  />
</div>

        <div>
  <label className="block text-lg font-medium text-gray-700">Shift:</label>
  <div className="flex items-center space-x-4">
    <label htmlFor="shift1" className="flex items-center">
      <input
        type="radio"
        id="shift1"
        value="shift1"
        checked={selectedShift === "shift1"}
        onChange={(e) => setSelectedShift(e.target.value)}
        className="mr-2"
      />
      Shift 1
    </label>
    <label htmlFor="shift2" className="flex items-center">
      <input
        type="radio"
        id="shift2"
        value="shift2"
        checked={selectedShift === "shift2"}
        onChange={(e) => setSelectedShift(e.target.value)}
        className="mr-2"
      />
      Shift 2
    </label>
    <label htmlFor="shift3" className="flex items-center">
      <input
        type="radio"
        id="shift3"
        value="shift3"
        checked={selectedShift === "shift3"}
        onChange={(e) => setSelectedShift(e.target.value)}
        className="mr-2"
      />
      Shift 3
    </label>
  </div>
</div>

          <div>
            <label className="block text-lg font-medium text-gray-700">
              Machines:
            </label>
            {/* <Select
              options={machiness ? machineOptions : []}
              value={selectedMachines}
              onChange={handleMachineChange}
              isMulti
              placeholder="Select Machines"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500"
              menuPlacement="auto"
              menuPortalTarget={document.body}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              isSearchable
              isClearable
            /> */}
            <Autocomplete
  disablePortal
  className="h-30"
  clearOnBlur
  blurOnSelect
  multiple
  id="combo-box-demo"
  options={machiness ? machineOptions : []}
  getOptionLabel={(option) => option.label}
  value={selectedMachiness}
  
  onChange={handleMachineChangee}
  renderInput={(params) => <TextField {...params}/>}
/>

          </div>
          <button
           onClick={handleData}
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Daily;
