import React, { useRef, useEffect, useState } from "react";
import { Chart } from "chart.js/auto";
import axios from "axios";
import "./BigChart.css";

const chart1_2_options = {
  // Your chart options
  scales: {
    x: {
      ticks: {
        color: "rgba(255, 255, 255, 0.7)",
        font: {
          weight: 'bold'
        }
      }
    },
    y: {
      ticks: {
        color: "rgba(255, 255, 255, 0.7)",
        font: {
          weight: 'bold'
        }
      }
    }
  }
};

const BigChart = () => {
  const chartRef = useRef();
  const chartInstance = useRef(null);
  const [performanceData, setPerformanceData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/webapp/shift/date");
        console.log("Fetched data:", response.data);
        setPerformanceData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (performanceData && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");

      const achievedData = [];
      const targetData = [];

      Object.values(performanceData).forEach(shiftData => {
        Object.values(shiftData).forEach(data => {
          achievedData.push(data.total_achieved);
          targetData.push(data.total_target);
        });
      });

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: Object.keys(performanceData),
          datasets: [
            {
              label: "Achieved",
              fill: false,
              borderColor: "rgba(29,140,248,1)",
              data: achievedData,
            },
            {
              label: "Target",
              fill: false,
              borderColor: "rgba(255, 99, 132, 1)",
              data: targetData,
            },
          ],
        },
        options: chart1_2_options,
      });
    }
  }, [performanceData]);

  return (
    <div className="big-chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default BigChart;
