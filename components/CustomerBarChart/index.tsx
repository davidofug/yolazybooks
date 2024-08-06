import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

export type DataPoint = {
  x: number;
  y: number;
}

interface BarChartProps {
  dataset: DataPoint[];
}

const Index: React.FC<BarChartProps> = ({ dataset }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  ChartJS.defaults.font.family = "Poppins";
  ChartJS.defaults.color = "#000000";
  ChartJS.defaults.borderColor = "#000000";

  // Generate a data array based on the number of hours in a day
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (items: any) => {
            if (!items.length) {
              return "";
            }
            const item = items[0];
            const x = item.parsed.x;
            const min = x - 0.5;
            const max = x + 0.5;
            return `Hours ${min} - ${max}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        offset: false,
        grid: {
          display: false,
          offset: false,
        },
        title: {
          display: true,
          text: "Hours",
          color: "#000000",
          font: {
            size: 12,
            family: "Poppins, sans-serif",
            weight: "700",
          },
        },
        ticks: {
          stepSize: 3,
        },
      },
      y: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Customers",
          color: "#000000",
          font: {
            size: 12,
            family: "Poppins, sans-serif",
            weight: "700",
          },
        },
      },
    },
  };

  const defaultDataset = Array.from({ length: 24 }, (_, i) => i + 0.5).map(
    (hour) => ({
      x: hour,
      y: 0,
    })
  );

  const actualDataset = dataset?.length > 0 ? dataset : defaultDataset;

  const data = {
    datasets: [
      {
        label: "Customers",
        data: actualDataset,
        backgroundColor: "#F8B09C",
        hoverBackgroundColor: "#EF5427",
        borderWidth: 0,
        borderRadius: 40,
        width: 10,
        borderSkipped: false,
        barPercentage: 1,
        categoryPercentage: 0.8,
      },
    ],
  };
  return <Bar options={options} data={data} className="h-full w-full" />;
};

export default Index;
