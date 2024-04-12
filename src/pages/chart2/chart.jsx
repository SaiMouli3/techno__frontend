import React, { useState, useEffect } from "react";
import "./chart.css";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import NeedleChart from "../../components/chart/NeedleChart.jsx";
import axios from "axios";

const Charts = ({ onDayChange }) => {
  
  const [onDayChangeShift1, setOnDayChangeShift1] = useState(0);
  const [onDayChangeShift2, setOnDayChangeShift2] = useState(0);
  const [onDayChangeShift3, setOnDayChangeShift3] = useState(0);
    const [averageEfficiency, setAverageEfficiency] = useState(0); // State for average efficiency

const [selectedStartDate, setSelectedStartDate] = useState(new Date());
const [selectedEndDate, setSelectedEndDate] = useState(new Date());


  const handleEndDateChange = (selectedEndDate) => {
    setSelectedEndDate(selectedEndDate);
  };

  const handleStartDateChange = (selectedStartDate) => {
    setSelectedStartDate(selectedStartDate);
  };



  useEffect(() => {
    const fetchDataForChart = async (chartNumber) => {
      try {
        const startDate = selectedStartDate.toISOString().slice(0, 10); // Extract yyyy-mm-dd from the ISO string
      const endDate = selectedEndDate.toISOString().slice(0, 10); // Extract yyyy-mm-dd from the ISO string
      
      const response = await axios.get(
        `https://techno.pythonanywhere.com/webapp/calculate-shift-efficiency/${startDate}/${endDate}/${chartNumber}`
      );
        const data = response.data;
        switch (chartNumber) {
          case 1:
            setOnDayChangeShift1(data);
            break;
          case 2:
            setOnDayChangeShift2(data);
            break;
          case 3:
            setOnDayChangeShift3(data);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error fetching data for chart ${chartNumber}:`, error);
      }
    };

    fetchDataForChart(1);
    fetchDataForChart(2);
    fetchDataForChart(3);
  }, [selectedStartDate, selectedEndDate]);
 useEffect(() => {
  const fetchAverageEfficiency = async () => {
    try {
      const startDate = selectedStartDate.toISOString().slice(0, 10); // Extract yyyy-mm-dd from the ISO string
      const endDate = selectedEndDate.toISOString().slice(0, 10); // Extract yyyy-mm-dd from the ISO string

      const response = await axios.get(
        `https://techno.pythonanywhere.com/webapp/api/avg/${startDate}/${endDate}`
      );
      const data = response.data;

      setAverageEfficiency(data.avg_efficiency);
    } catch (error) {
      console.error("Error fetching average efficiency:", error);
    }
  };

  fetchAverageEfficiency();
}, [selectedStartDate,selectedEndDate]);

  return (
    <div style={{ height: "100%",padding:'25px' }}>
      <div className="c2-filterBox ">
        <div className="c2-fromInput inputContainer ">
          <h2 className="c2-fromLabel">From:</h2>

<DatePicker
  onChange={handleStartDateChange}
  value={selectedStartDate}
  className="c2-customDatePicker"
  locale="en"
  format="dd/MM/yyyy"
  selectsRange
  showDisabledMonthNavigation
  showIcon
/>

        </div>
        <div className="c2-toInput inputContainer">
          <h2 className="c2-toLabel">To:</h2>
          <DatePicker
            onChange={handleEndDateChange}
            value={selectedEndDate}
            className="c2-customDatePicker"
            locale="en"
            showDisabledMonthNavigation
            showIcon

            format="dd/MM/yyyy"
            selectsRange
          />
        </div>
      </div>
      <div className="c2-ChartsContainer mt-24">
        <NeedleChart
          selectedStartDay={selectedStartDate}
          selectedEndDay={selectedEndDate}
          data={onDayChangeShift1}
          color={"#FFD700"}
          boxNo={1}
          shiftName={"Morning"}
        />

        <NeedleChart
          selectedStartDay={selectedStartDate}
          selectedEndDay={selectedEndDate}
          data={onDayChangeShift2}
          color="#FFA500"
          boxNo={2}
          shiftName={"Afternoon"}
        />

        <NeedleChart
          selectedStartDay={selectedStartDate}
          selectedEndDay={selectedEndDate}
          data={onDayChangeShift3}
          color="#00FFFF"
          boxNo={3}
          shiftName={"Night"}
        />
         {averageEfficiency !== null && (
          <NeedleChart
            selectedStartDay={selectedStartDate}
            selectedEndDay={selectedEndDate}
            data={{ avg_efficiency: averageEfficiency }} // Pass the average efficiency as data
            color="#D30000"
            boxNo={4}
            shiftName={"Mean"}
          />
        )}
      </div>
    </div>
  );
};

export default Charts;
