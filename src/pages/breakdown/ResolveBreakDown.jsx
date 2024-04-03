import React from "react";
import axios from "axios";

const ResolveBreakDown = ({ openView, selectedBreakdown, handleCloseView }) => {
  const deleteRecord = async () => {
    try {
      // Send a DELETE request to the backend API endpoint with the tool code
      await axios.delete(`https://techno.pythonanywhere.com/webapp/api/breakdown/${selectedBreakdown.toolCode}`);
      // Handle successful deletion, such as showing a success message or updating the UI
      console.log("Breakdown deleted successfully");
      handleCloseView();
    } catch (error) {
      // Handle errors, such as displaying an error message to the user
      console.error("Error deleting breakdown:", error);
    }
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Breakdown Details</h3>
                    <div className="mt-2">
                  <p className="text-sm text-gray-500">Date: {selectedBreakdown.date}</p>
                  <p className="text-sm text-gray-500">Length Used: {selectedBreakdown.lengthUsed}</p>
                  <p className="text-sm text-gray-500">Expected Length Remaining: {selectedBreakdown.expectedLengthRemaining}</p>
                  <p className="text-sm text-gray-500">Replaced By: {selectedBreakdown.replacedBy}</p>
                  <p className="text-sm text-gray-500">Reason: {selectedBreakdown.reason}</p>
                  <p className="text-sm text-gray-500">Change Time: {selectedBreakdown.changeTime}</p>
                  <p className="text-sm text-gray-500">Hours into Shift: {selectedBreakdown.hoursIntoShift}</p>
                  <p className="text-sm text-gray-500">Machine ID: {selectedBreakdown.machineId}</p>
                  <p className="text-sm text-gray-500">Tool Code: {selectedBreakdown.toolCode}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button onClick={handleCloseView} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              Close
            </button>
            <button onClick={deleteRecord} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
              Resolve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResolveBreakDown;
