import React from "react";

const LineItemTable = ({ lineItems, includeBaseIncentive }) => {
  const baseIncentive = lineItems && lineItems[0]?.incentive_value;

  let totalIncentive = lineItems ? lineItems.reduce((acc, curr) => acc + curr.incentive_received, 0) : 0;
  if (includeBaseIncentive && baseIncentive) {
    totalIncentive += baseIncentive;
  }

  return (
    <div className="mt-4">
      <div>
        <h3 className="mb-4 font-semibold text-[20px]">Base Incentive: {baseIncentive}</h3>
      </div>
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
          {lineItems && lineItems.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{item.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{item.shift_number}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{item.efficiency}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{item.incentive_received}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-right">
        <p className="text-lg text-gray-700 dark:text-gray-300">Total Incentive: {totalIncentive}</p>
      </div>
    </div>
  );
};

const EmployeeIncentivePage = ({ data, includeBaseIncentive, setIncludeBaseIncentive,employee }) => {
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
      <div>
                  <label htmlFor="employee" className="text-lg text-gray-900 font-semibold dark:text-gray-300">Employee SSN: {employee?.emp_ssn}</label>

      </div>
      
      <div className="mt-2">
        <LineItemTable lineItems={data} includeBaseIncentive={includeBaseIncentive} />
      </div>
    </div>
  );
};

export default EmployeeIncentivePage;
