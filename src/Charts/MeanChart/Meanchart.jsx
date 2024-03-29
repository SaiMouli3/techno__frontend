// // MeanChart.jsx
// import React, { useEffect, useState } from "react";
// import GaugeChart from "react-gauge-chart";
// import { Link } from "react-router-dom";

// function MeanChart({
//   OnDayChangeShift1,
//   OnDayChangeShift2,
//   OnDayChangeShift3,
// }) {
//   const [averagePercentage, setAveragePercentage] = useState(null);

//   useEffect(() => {
//     const calculateMeanPercentage = (shiftData) => {
//       if (!shiftData || shiftData.length === 0) return null;

//       let totalJobs = 0;
//       let totalTargetedJobs = 0;

//       shiftData.forEach((curr) => {
//         totalJobs += curr.jobs;
//         totalTargetedJobs += curr.targetedJobs;
//       });

//       if (totalTargetedJobs === 0) {
//         console.log("Skipping division by zero");
//         return null; // Avoid division by zero
//       }

//       return (totalJobs / totalTargetedJobs) * 100;
//     };

//     const mean1 = calculateMeanPercentage(OnDayChangeShift1);
//     const mean2 = calculateMeanPercentage(OnDayChangeShift2);
//     const mean3 = calculateMeanPercentage(OnDayChangeShift3);

//     const overallMean = (mean1 + mean2 + mean3) / 3;
//     setAveragePercentage(overallMean);
//   }, [OnDayChangeShift1, OnDayChangeShift2, OnDayChangeShift3]);

//   return averagePercentage !== null ? (
//     <Link to="/chart2">
//       {" "}
//       {/* Wrap GaugeChart with Link component */}
//       <div style={{ position: "relative", width: "100%", height: "100%" }}>
//         <div style={{ width: "100%", display: "inline-block" }}>
//           <GaugeChart
//             id="gauge-chart-mean"
//             nrOfLevels={30}
//             colors={["#9370DB", "#8A2BE2", "#6A5ACD", "#8B008B"]}
//             arcWidth={0.3}
//             percent={averagePercentage / 100} // Convert percentage to a 0-1 scale for the gauge
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
//             bottom: "-5px", // Adjust the distance from the bottom of the gauge
//             color: "#FFFFFF", // Text color
//             fontSize: "18px", // Adjust text size as needed
//           }}
//         >
//           {averagePercentage.toFixed(2)}%
//         </div>
//       </div>
//     </Link>
//   ) : null;
// }

// export default MeanChart;


import React, { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
import { Link } from "react-router-dom";

function MeanChart() {
  const [averagePercentage, setAveragePercentage] = useState(null);

  useEffect(() => {
    const shiftUrls = [
      "https://techno.pythonanywhere.com/webapp/shift_eff/1",
      "https://techno.pythonanywhere.com/webapp/shift_eff/2",
      "https://techno.pythonanywhere.com/webapp/shift_eff/3",
    ];

    const fetchData = async () => {
      try {
        const responses = await Promise.all(shiftUrls.map(url => fetch(url)));
        const data = await Promise.all(responses.map(response => response.json()));

        // Extract average efficiencies from each response
        const averageEfficiencies = data.map(response => response.average_shift_efficiency);

        // Calculate overall average efficiency
        const overallAverage = averageEfficiencies.reduce((total, avg) => total + avg, 0) / averageEfficiencies.length;

        setAveragePercentage(overallAverage);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return averagePercentage !== null ? (
    <Link to="/chart2">
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div style={{ width: "100%", display: "inline-block" }}>
          <GaugeChart
            id="gauge-chart-mean"
            nrOfLevels={30}
            colors={["#9370DB", "#8A2BE2", "#6A5ACD", "#8B008B"]}
            arcWidth={0.3}
            percent={averagePercentage / 100}
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
            bottom: "-5px",
            color: "#FFFFFF",
            fontSize: "18px",
          }}
        >
          {averagePercentage.toFixed(2)}%
        </div>
      </div>
    </Link>
  ) : null;
}

export default MeanChart;

