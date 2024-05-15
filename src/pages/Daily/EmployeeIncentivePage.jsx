import React, { useState } from "react";


const LineItemTable = ({ lineItems }) => {
  return (
    <div className="mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 dark:bg-secondary-dark-bg">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Shift Number
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Efficiency
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Incentive
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y text-center divide-gray-200 dark:bg-secondary-light-bg dark:divide-gray-700">
          {lineItems.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{item.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{item.shiftNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{item.efficiency}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{item.incentive}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const EmployeeIncentivePage = () => {
  const [includeBaseIncentive, setIncludeBaseIncentive] = useState(false);

  // Sample line item data, replace this with your actual data
  const lineItems = [
    { date: "123456", shiftNumber: 1, efficiency: 99, incentive: 145 },
    { date: "1234", shiftNumber: 1, efficiency: 100, incentive: 150 }
  ];

  // Calculate total incentive
  let totalIncentive = lineItems.reduce((acc, curr) => acc + curr.incentive, 0);
  if (includeBaseIncentive) {
    // Add employee base incentive if checkbox is checked
    totalIncentive += 3000;
  }

  return (
    <div className="dark:text-gray-200 dark:bg-secondary-dark-bg m-2 pt-2 md:m-10 mt-24 md:p-10 bg-white rounded-3xl">
      <div className="flex justify-between items-center">
        <p className="text-lg text-white font-semibold uppercase">Employee Incentive</p>
        <div>
          <input 
            type="checkbox" 
            checked={includeBaseIncentive} 
            onChange={() => setIncludeBaseIncentive(!includeBaseIncentive)} 
            className="mr-2" 
          />
          <label htmlFor="baseIncentive" className="text-sm text-gray-700 dark:text-gray-300">Include base incentive</label>
        </div>
      </div>
      
      <div className="mt-8">
        <LineItemTable lineItems={lineItems} />
      </div>
      <div className="mt-8 text-right">
        <p className="text-lg text-gray-700 dark:text-gray-300">Total Incentive: {totalIncentive}</p>
      </div>
    </div>
  );
};

export default EmployeeIncentivePage;
