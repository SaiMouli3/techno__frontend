import React from 'react'
import { Dialog } from "@syncfusion/ej2-react-popups";
import {NumericTextBox} from '@syncfusion/ej2-react-inputs'
import {ButtonComponent} from '@syncfusion/ej2-react-buttons'
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import { useState } from 'react';
const JobPop = ({data,setData}) => {
     const [showDialog, setShowDialog] = useState(true);

  const [jobDetails, setJobDetails] = useState({
    Job_id: "",
    name: "",
    toolsCount: 0,
    tools: []
  });
  const handleAddClick = () => {
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const handleDialogSubmit = () => {
    setShowDialog(false);
    // Add job details to the data array

        setData([...data, jobDetails]);
    // Reset job details state
    setJobDetails({
      Job_id: "",
      name: "",
      toolsCount: 0,
      tools: []
    });
  };

  const handleToolCountChange = (value) => {
    setJobDetails({
      ...jobDetails,
      toolsCount: value
    });
    
  };

  const renderToolFields = () => {
    const toolFields = [];
    for (let i = 0; i < jobDetails.toolsCount; i++) {
      toolFields.push(
        <div key={i}>
          <input
            type="text"
            placeholder={`Tool ${i + 1} Code`}
            value={jobDetails.tools[i] || ""}
            onChange={(e) => handleToolChange(e, i)}
          />
        </div>
      );
    }
    return toolFields;
  };

  const handleToolChange = (e, index) => {
    const updatedTools = [...jobDetails.tools];
    updatedTools[index] = e.target.value;
    setJobDetails({
      ...jobDetails,
      tools: updatedTools
    });
  };

  const buttons = [
    {
      buttonModel: {
        content: 'cancel'
      },
      click: ()=> {
        setShowDialog(false)
      }
    }
  ]
  return (
    <div>   <DialogComponent
        visible={showDialog}
        width="400px"
        header="Add Job"
        showCloseIcon={true}
        onClose={handleDialogClose}
        buttons={buttons}
      >
        <div>
          <input
            type="text"
            placeholder="Job ID"
            value={jobDetails.Job_id}
            onChange={(e) => setJobDetails({ ...jobDetails, Job_id: e.target.value })}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Job Name"
            value={jobDetails.name}
            onChange={(e) => setJobDetails({ ...jobDetails, name: e.target.value })}
          />
        </div>
        <div>
          <label>Number of Tools:</label>
          <input
            value={jobDetails.toolsCount}
           
            onChange={(e) => handleToolCountChange(e.value)}
          />
        </div>
        {renderToolFields()}
        <button onClick={handleDialogSubmit}>
  Submit
</button>  

      </DialogComponent></div>
  )
}

export default JobPop
