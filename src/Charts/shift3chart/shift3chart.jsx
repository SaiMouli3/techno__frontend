// import React, { useEffect, useState } from "react";
// import axios from "axios"; // Import axios for making HTTP requests
// import { Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import GaugeChart from "react-gauge-chart";
// import "chartjs-plugin-datalabels";
// import { Link } from "react-router-dom";
// import { shift3Data } from "../chart";

// ChartJS.register(ArcElement, Tooltip, Legend);

// function Shift3Chart({ selectedDay, OnDayChangeShift3 }) {
//   const [data, setData] = useState(null);
//   const [angle, setAngle] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Define colorRange outside of the useEffect hook
//   const colorRange = [
//     "#8D99AE", // Gray-Blue
//     "#606c88", // Steel Gray
//     "#3d5a80", // Slate Gray
//     "#0A9396", // Vibrant Cyan
//   ];

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/webapp/shift_eff/3");
//         const efficiencyData = response.data;

//         // Extract shift efficiency data
//         const shiftEfficiency = efficiencyData[0].shift_efficiency;

//         // Set shift efficiency data to state
//         setData(shiftEfficiency);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     }

//     fetchData();
//   }, []); // Empty dependency array to run only once on component mount

//   if (loading) {
//     return <div>Loading...</div>; // Display loading indicator while data is being fetched
//   }

//   const angleValue = (data / 100) * Math.PI;

//   return (
//     <Link to="/chart">
//       <div style={{ position: "relative", width: "100%", height: "100%" }}>
//         <div style={{ width: "100%", display: "inline-block" }}>
//           <GaugeChart
//             id="gauge-chart"
//             nrOfLevels={30}
//             colors={[
//               "#8D99AE", // Gray-Blue
//               "#606c88", // Steel Gray
//               "#3d5a80", // Slate Gray
//               "#0A9396", // Vibrant Cyan
//             ]}
//             arcWidth={0.3}
//             percent={angleValue / Math.PI} // Convert angle to a 0-1 scale
//             textColor={"#FFFFFF"}
//             needleColor="#ffffff"
//             needleBaseColor="#ffffff"
//             hideText
//           />
//         </div>
//         <div
//           style={{
//             position: "absolute",
//             width: "100%",
//             textAlign: "center",
//             bottom: "-0px", // Adjust the distance from the bottom of the gauge
//             color: "#FFFFFF", // Text color
//             fontSize: "18px", // Adjust text size as needed
//           }}
//         >
//           {data}%
//         </div>
//       </div>
//     </Link>
//   );
// }

// export const fetchShiftsForDay3 = (day) => {
//   let dataForSelectedDay = shift3Data;
//   if (day !== "All Days") {
//     dataForSelectedDay = shift3Data.filter((shift) => shift.day === day);
//   }
//   return dataForSelectedDay;
// };

// export default Shift3Chart;




import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios for making HTTP requests
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import GaugeChart from "react-gauge-chart";
import "chartjs-plugin-datalabels";
import { Link } from "react-router-dom";
import { shift3Data } from "../chart";

ChartJS.register(ArcElement, Tooltip, Legend);

function Shift3Chart({ selectedDay, OnDayChangeShift3 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("https://techno.pythonanywhere.com/webapp/shift_eff/3");
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
    <Link to="/chart">
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div style={{ width: "100%", display: "inline-block" }}>
          <GaugeChart
            id="gauge-chart"
            nrOfLevels={30}
            colors={[
              "#8D99AE", // Gray-Blue
              "#606c88", // Steel Gray
              "#3d5a80", // Slate Gray
              "#0A9396", // Vibrant Cyan
            ]}
            arcWidth={0.3}
            percent={angleValue / Math.PI} // Convert angle to a 0-1 scale
            textColor={"#FFFFFF"}
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
            bottom: "-0px", // Adjust the distance from the bottom of the gauge
            color: "#FFFFFF", // Text color
            fontSize: "18px", // Adjust text size as needed
          }}
        >
          {data}%
        </div>
      </div>
    </Link>
  );
}

export const fetchShiftsForDay3 = (day) => {
  let dataForSelectedDay = shift3Data;
  if (day !== "All Days") {
    dataForSelectedDay = shift3Data.filter((shift) => shift.day === day);
  }
  return dataForSelectedDay;
};

export default Shift3Chart;

