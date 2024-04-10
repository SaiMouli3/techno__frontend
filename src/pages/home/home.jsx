// Home.jsx
import React, { useState, useEffect } from "react";
import Topbox from "../../components/topbox/topbox";
import "./home.css";
import TopRightbox from "../../components/toprightbox/toprightbox.jsx";
import BigChart from "../../Charts/BigChart/BigChart.jsx";
import LeftChart from "../../Charts/leftLinechart/leftlinechart.jsx";
import { fetchShiftsForDay1 } from "../../Charts/shift1chart/shift1chart.jsx";
import { fetchShiftsForDay2 } from "../../Charts/shift2chart/shift2chart.jsx";
import { fetchShiftsForDay3 } from "../../Charts/shift3chart/shift3chart.jsx";
import Shift1Chart from "../../Charts/shift1chart/shift1chart.jsx";
import Shift2Chart from "../../Charts/shift2chart/shift2chart.jsx";
import Shift3Chart from "../../Charts/shift3chart/shift3chart.jsx";
import MeanChart from "../../Charts/MeanChart/Meanchart.jsx";
import { Link } from 'react-router-dom';
const Home = () => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date();
  const currentDay = days[date.getDay()];
  const [selectedDay] = useState(currentDay);
  const [onDayChangeShift1, setOnDayChangeShift1] = useState([]);
  const [onDayChangeShift2, setOnDayChangeShift2] = useState([]);
  const [onDayChangeShift3, setOnDayChangeShift3] = useState([]);
  const fontSize=2;
  useEffect(() => {
    const fetchData = async () => {
      const dataForSelectedDay1 = await fetchShiftsForDay1(selectedDay);
      setOnDayChangeShift1(dataForSelectedDay1);
      const dataForSelectedDay2 = await fetchShiftsForDay2(selectedDay);
      setOnDayChangeShift2(dataForSelectedDay2);
      const dataForSelectedDay3 = await fetchShiftsForDay3(selectedDay);
      setOnDayChangeShift3(dataForSelectedDay3);
    };

    fetchData();
  }, [selectedDay]);
  return (
    <div className="home">
      <div className="box box1">
        <Topbox />
      </div>
      <div className="box box2">
        SHIFT1
        <Shift1Chart
          selectedDay={selectedDay}
          OnDayChangeShift1={onDayChangeShift1}
        />
      </div>
      <div className="box box3">
        SHIFT2
        <Shift2Chart
          selectedDay={selectedDay}
          OnDayChangeShift2={onDayChangeShift2}
        />
      </div>
      <div className="box box4">
{/*         TOPRIGHT BOX */}
        <TopRightbox />
      </div>
      <div className="box box5">
        SHIFT3
        <Shift3Chart
          selectedDay={selectedDay}
          OnDayChangeShift3={onDayChangeShift3}
        />
      </div>
      <div className="box box6">
        MEAN SHIFT
        <MeanChart
          OnDayChangeShift1={onDayChangeShift1}
          OnDayChangeShift2={onDayChangeShift2}
          OnDayChangeShift3={onDayChangeShift3}
        />
      </div>
      <div className="box box7">
        MAINCHART
        <BigChart />
      </div>
          <div className="box box8">
           <Link to="/home" >
      LEFTCHART
      <LeftChart fontSize={fontSize} />
    </Link>
      </div>
      {/* <div className="box box9">
        <BarChart />
      </div> */}
    </div>
  );
};

export default Home;
