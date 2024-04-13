import React, { useState, useEffect } from 'react';
import Toolchart from './toolchart';

const ToolTable = ({ data, onToolSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
    const handleToolClick = (tool) => {
  onToolSelect(tool);

  
     window.scrollTo({
    top: 0,
    behavior: "smooth" 
  });
  
};


  // Filter tools based on the search query
  const filteredData = data.filter(tool =>
    tool.tool_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    <div className='w-full h-auto'>
      <input
        type="text"
        placeholder="Search tools"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 mb-4 rounded-md border border-gray-300 bg-gray-800 placeholder:text-gray-50 text-gray-200 focus:outline-none focus:border-blue-500"
      />
      <table className="w-full h-auto text-sm text-left rtl:text-right text-gray-400">
        <thead className="text-xs uppercase bg-gray-700 text-gray-400">
          <tr>
            <th className="px-6 py-3">Tool name</th>
            <th className="px-6 py-3">Code</th>
            <th className="px-6 py-3">BreakPoints</th>
          </tr>
        </thead>
        <tbody className='overflow-y-auto h-screen'>
          {filteredData.map(tool => (
  <tr
    onClick={() => handleToolClick(tool)}
    key={tool.tool_code}
    id={`tool-${tool.tool_code}`} 
    className="border-b bg-gray-800 text-white cursor-pointer border-gray-700"
  >
    <td className="px-6 py-4 whitespace-nowrap">{tool.tool_name}</td>
    <td className="px-6 py-4">{tool.tool_code}</td>
    <td className="px-6 py-4">{tool.no_of_brk_points}</td>
  </tr>

))}

        </tbody>
      </table>
    </div>
    </>
  );
};

const ToolCharts = () => {
  const [toolsData, setToolsData] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://techno.pythonanywhere.com/webapp/api/tools/');
        const data = await response.json();
        setToolsData(data);
      } catch (error) {
        console.error('Error fetching tools data:', error);
      }
    };

    fetchData();
  }, []);

  const handleToolSelection = (tool) => {
    setSelectedTool(tool);
  };

  return (
    <div className='flex flex-row'>
      <div className='flex flex-col my-5 w-[50%]'>
        <div className='flex flex-row gap-x-5 w-[100%] mx-5'>
          <div className="h-[100%] w-[100%] bg-gray-800 text-white p-5 mx-5 flex flex-col">
            <h2 className="text-3xl uppercase font-bold my-5">Tool Information</h2>
            <div className="flex flex-col gap-y-5">
              <p>Tool name: <span className='font-semibold text-gray-200'>{selectedTool?.tool_name}</span></p>
              <p>Tool code: <span className='font-semibold text-gray-200'>{selectedTool?.tool_code}</span></p>
              <p>BreakPoints : <span className='font-semibold text-gray-200'>{selectedTool?.no_of_brk_points}</span></p>
              <p>max_life_expectancy_in_mm: <span className='font-semibold text-gray-200'>{selectedTool?.max_life_expectancy_in_mm}</span></p>
              <p>Cost: <span className='font-semibold text-gray-200'>{selectedTool?.cost}</span></p>
            </div>
          </div>
        </div>
        <div className='w-[100%]  h-[100%]'>
          <Toolchart tool={selectedTool} />
        </div>
      </div>
     <div className='m-5 w-[50%]  table-container'>
  <ToolTable data={toolsData} onToolSelect={handleToolSelection} />
</div>

    </div>
  );
}

export default ToolCharts;
