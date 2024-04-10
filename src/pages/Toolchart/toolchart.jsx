import React, { useRef, useEffect, useState } from "react";
import { Chart } from "chart.js/auto";
import "./toolchart.css";

const tool_chart1_2_options = {
  responsive: true,
  maintainAspectRatio: false,
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
        maxRotation: 10,
        color: "white",
      },
      grid: {
        display: true,
      },
      borderColor: "white",
      borderWidth: 5    ,
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
    duration: 5000,
    easing: "easeInOutQuart",
  },
  datasets: {
    line: {
      cubicInterpolationMode: "monotone",
    },
  },
};

const Toolchart = ({ tool }) => {
  const tool_chartRef = useRef();
  const tool_chartInstance = useRef(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchToolChartData = async () => {
      try {
        const response = await fetch(`https://techno.pythonanywhere.com/webapp/api/tool_chart/${tool.tool_code}`);
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching tool chart data:', error);
        setChartData([]);
      }
    };

    if (tool) {
      fetchToolChartData();
    }
  }, [tool]);

  useEffect(() => {
    const ctx = tool_chartRef.current.getContext("2d");
    let ToolChart;

    if (tool_chartInstance.current) {
      tool_chartInstance.current.destroy();
    }

    // Check if chartData is an array before mapping it
    if (Array.isArray(chartData)) {
      ToolChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: chartData.map(dataPoint => dataPoint.no_of_brk_points),
          datasets: [
            {
              label: "Efficiency",
              fill: true,
              backgroundColor: "rgba(29,140,248,0.2)",
              borderColor: "rgba(29,140,248,1)",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: "#1f8ef1",
              pointBorderColor: "rgba(255,255,255,0)",
              pointHoverBackgroundColor: "#1f8ef1",
              pointBorderWidth: 20,
              pointHoverRadius: 2,
              pointHoverBorderWidth: 10,
              pointRadius: 4,
              data: chartData.map(dataPoint => dataPoint.tool_efficiency),
            },
            {
              label: "No of Jobs",
              fill: true,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: "#ff6384",
              pointBorderColor: "rgba(255,255,255,0)",
              pointHoverBackgroundColor: "#ff6384",
              pointBorderWidth: 20,
              pointHoverRadius: 2,
              pointHoverBorderWidth: 10,
              pointRadius: 4,
              data: chartData.map(dataPoint => dataPoint.part_no_count),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
                maxRotation: 10,
                color: "white",
              },
              grid: {
                display: true,
              },
              borderColor: "white",
              borderWidth: 5,
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
            duration: 5000,
            easing: "easeInOutQuart",
          },
          datasets: {
            line: {
              cubicInterpolationMode: "monotone",
            },
          },
        },
      });

      tool_chartInstance.current = ToolChart;
    }

    return () => {
      if (ToolChart) {
        ToolChart.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="tool-chart-container text-gray-100 flex flex-col w-full h-[400px] overflow-x-hidden">
      <canvas className="tool-chart" ref={tool_chartRef}></canvas>
    </div>
  );
};

export default Toolchart;
