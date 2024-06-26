import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsPersonWorkspace } from 'react-icons/bs';
import { FaTools } from "react-icons/fa";
import LeftChart from "../../Charts/leftLinechart/leftlinechart.jsx";
import BigChart from '../../Charts/BigChart/BigChart.jsx';
import { GrVirtualMachine } from "react-icons/gr";
import { ImFileOpenoffice } from "react-icons/im";
// import LineChart from './LineChart.jsx';

const Homepage = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalMachines, setTotalMachines] = useState(0);
  const [totalTools, setTotalTools] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);
  const fontSize=1;

  const fetchData = async () => {
    try {
      const employeesResponse = await axios.get(`${process.env.REACT_APP_URL}/webapp/num_employees/`);
      setTotalEmployees(employeesResponse.data.num_employees);

      const machinesResponse = await axios.get(`${process.env.REACT_APP_URL}/webapp/num_machines`);
      setTotalMachines(machinesResponse.data.num_machines);

      const toolsResponse = await axios.get(`${process.env.REACT_APP_URL}/webapp/num_tools`);
      setTotalTools(toolsResponse.data.num_tools);

      const jobsResponse = await axios.get(`${process.env.REACT_APP_URL}/webapp/num_jobs`);
      setTotalJobs(jobsResponse.data.num_jobs);
    } catch (error) {
    }
  };

  return (
    <>
      <div className='bg-main-dark-bg m-10 flex flex-col gap-y-8 mt-12'>
        <div className='w-full flex flex-col gap-x-5 gap-y-2'>
          <p className='font-bold text-3xl text-white mb-4'>Dashboard</p>
          <div className='flex lg:flex-row flex-col gap-y-5 gap-x-5'>
            <div className='bg-gray-800 p-8 lg:w-[25%] w-[100%] '>
              <p className='text-light-gray-500 flex flex-row justify-start items-center gap-x-3 text-xl text-white'><span className='p-1 bg-[#8177d5] rounded-md'><BsPersonWorkspace color='#2e1cc9'/></span>Total Employees</p>
              <p className='mt-3 font-semibold text-white text-2xl'>{totalEmployees}</p>
              <p className='text-sm text-gray-500'>Active</p>
            </div>
            <div className='bg-gray-800 p-8 lg:w-[25%] w-[100%] '>
              <p className='text-light-gray-500 flex flex-row justify-start items-center gap-x-3 text-xl text-white'><span className='p-1 bg-[#8177d5] rounded-md'><GrVirtualMachine color='#2e1cc9'/></span>Total Machines</p>
              <p className='mt-3 font-semibold text-white text-2xl'>{totalMachines}</p>
              <p className='text-sm text-gray-500'>Active</p>
            </div>
            <div className='bg-gray-800 p-8 lg:w-[25%] w-[100%] '>
              <p className='text-light-gray-500 flex flex-row justify-start items-center gap-x-3 text-xl text-white'><span className='p-1 bg-[#8177d5] rounded-md'><FaTools color='#2e1cc9'/></span>Total Tools</p>
              <p className='mt-3 font-semibold text-white text-2xl'>{totalTools}</p>
              <p className='text-sm text-gray-500'>Active</p>
            </div>
            <div className='bg-gray-800 p-8 lg:w-[25%] w-[100%] '>
              <p className='text-light-gray-500 flex flex-row justify-start items-center gap-x-3 text-xl text-white'><span className='p-1 bg-[#8177d5] rounded-md'><ImFileOpenoffice color='#2e1cc9'/></span>Total Jobs</p>
              <p className='mt-3 font-semibold text-white text-2xl'>{totalJobs}</p>
              <p className='text-sm text-gray-500'>Active</p>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-row gap-x-5 px-5 mb-4 justify-center items-center w-full'>
        <div className='w-[50%] '>
          <LeftChart fontSize={fontSize}/>
        </div>
        <div className='w-[50%] '>
          <BigChart/>
        </div>
      </div>
    </>
  )
}

export default Homepage;
