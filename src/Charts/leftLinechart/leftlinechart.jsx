import React, { useRef, useEffect, useState } from "react";
import { Chart } from "chart.js/auto";
import axios from "axios";
import { useLocation } from "react-router-dom";
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
      title: {
        display: true,
        text: 'Date',
        color: 'white',
        font: {
          size: 6,
          weight: 'bold'
        }
      },
      ticks: {
        display: true,
        autoSkip: true,
        maxRotation: 5,
        color: "white",
        font: {
          size: 6,
          weight: 'bold'
        }
      },
      grid: {
        display: false,
      },
    },
    y: {
      title: {
        display: true,
        text: 'No of Employees per Shift',
        color: 'white',
        font: {
          size: 6,
          weight: 'bold'
        }
      },
      ticks: {
        display: true,
        autoSkip: true,
        color: "white",
        font: {
          size: 6,
          weight: 'bold'
        }
      },
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: true, // Display legend for shift colors
    },
    backgroundColor: "grey",
  },
  animation: {
    duration: 2000,
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
  const [shiftData, setShiftData] = useState([]);
  const location = useLocation();

  const fetchData = async () => {
    try {
      const response = await axios.get("https://techno.pythonanywhere.com/webapp/api/shift_counts/");
      setShiftData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000); // Fetch data every minute
    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  useEffect(() => {
    if (shiftData.length > 0 && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");

      const shift1Data = shiftData.map((item) => item["1"]);
      const shift2Data = shiftData.map((item) => item["2"]);
      const shift3Data = shiftData.map((item) => item["3"]);

      const fontSize = location.pathname === '/home' ? 2 : 1;

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: shiftData.map((item) => item.date),
          datasets: [
            {
              label: "Shift 1",
              data: shift1Data,
              borderColor: "rgba(255, 99, 132, 1)",
              fill: false,
            },
            {
              label: "Shift 2",
              data: shift2Data,
              borderColor: "rgba(29,140,248,1)",
              fill: false,
            },
            {
              label: "Shift 3",
              data: shift3Data,
              borderColor: "rgba(255, 206, 86, 1)",
              fill: false,
            },
          ],
        },
        options: {
          ...chart1_2_options,
          scales: {
            ...chart1_2_options.scales,
            x: {
              ...chart1_2_options.scales.x,
              title: {
                ...chart1_2_options.scales.x.title,
                font: {
                  ...chart1_2_options.scales.x.title.font,
                  size: 8 * fontSize,
                },
              },
              ticks: {
                ...chart1_2_options.scales.x.ticks,
                font: {
                  ...chart1_2_options.scales.x.ticks.font,
                  size: 6 * fontSize,
                },
              },
            },
            y: {
              ...chart1_2_options.scales.y,
              title: {
                ...chart1_2_options.scales.y.title,
                font: {
                  ...chart1_2_options.scales.y.title.font,
                  size: 6 * fontSize,
                },
              },
              ticks: {
                ...chart1_2_options.scales.y.ticks,
                font: {
                  ...chart1_2_options.scales.y.ticks.font,
                  size: 6 * fontSize,
                },
              },
            },
          },
        },
      });
    }
  }, [shiftData, location.pathname]);

  return (
    <div className="big-chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default LeftChart;
