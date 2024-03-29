import React, { useRef, useEffect, useState } from "react";
import { Chart } from "chart.js/auto";
import axios from "axios";
import "./leftlinechart.css";

const chart1_2_options = {
  responsive: true,
  maintainAspectRatio: true,
  elements: {
    point: {
      radius: 1,
    },
  },
  scales: {
    x: {
      ticks: {
        display: true,
        autoSkip: true,
        maxRotation: 5,
        color: "white",
      },
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        display: true,
        autoSkip: true,
        color: "white",
      },
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    backgroundColor: "grey",
  },
  animation: {
    duration: 20000,
    easing: "easeInOutQuart",
  },
  datasets: {
    line: {
      cubicInterpolationMode: "monotone",
    },
  },
};

const LeftChart = () => {
  const chartRef = useRef();
  const chartInstance = useRef(null);
  const [efficiencyData, setEfficiencyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://techno.pythonanywhere.com/webapp/emp/efficiency");
        console.log("Fetched data:", response.data.efficiency_data);
        setEfficiencyData(response.data.efficiency_data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (efficiencyData.length > 0 && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: efficiencyData.map((item) => item.emp_ssn),
          datasets: [
            {
              label: "Efficiency",
              fill: true,
              backgroundColor: "rgba(29,140,248,0.2)",
              borderColor: "#283739",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: "#93deff",
              pointBorderColor: "rgba(255,255,255,0)",
              pointHoverBackgroundColor: "#1f8ef1",
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: efficiencyData.map((item) => item.emp_efficiency),
            },
          ],
        },
        options: chart1_2_options,
      });
    }
  }, [efficiencyData]);

  return (
    <div className="big-chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default LeftChart;
