import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import GaugeChart from "react-gauge-chart";
import "chartjs-plugin-datalabels";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for making HTTP requests
import { shift2Data } from "../chart";


ChartJS.register(ArcElement, Tooltip, Legend);

function Shift2Chart({ selectedDay, OnDayChangeShift2 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("https://techno.pythonanywhere.com/webapp/shift_eff/2");
        const { average_shift_efficiency } = response.data;

        setData(average_shift_efficiency);
        setLoading(false);
      } catch (error) {
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const angleValue = (data / 100) * Math.PI;

  return (
    <Link to="/chart2">
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div style={{ width: "100%", display: "inline-block" }}>
          <GaugeChart
            id="gauge-chart"
            nrOfLevels={30}
            colors={[
              "#FFCDD2", // Light red
              "#EF9A9A", // Medium light red
              "#E57373", // Medium red
              "#EF5350", // Medium dark red
              "#F44336", // Dark red
            ]}
            arcWidth={0.3}
            percent={angleValue / Math.PI}
            textColor="#FFFFFF"
            needleColor="#ffffff"
            needleBaseColor="#ffffff"
            hideText
          />
        </div>
        <div
          style={{
            position: "absolute",
            width: "100%",
            textAlign: "center",
            bottom: "-0px",
            color: "#FFFFFF",
            fontSize: "18px",
          }}
        >
          {((angleValue / Math.PI) * 100).toFixed(2)}%
        </div>
      </div>
    </Link>
  );
}

export const fetchShiftsForDay2 = (day) => {
  let dataForSelectedDay = shift2Data;
  if (day !== "All Days") {
    dataForSelectedDay = shift2Data.filter((shift) => shift.day === day);
  }
  return dataForSelectedDay;
};

export default Shift2Chart;
