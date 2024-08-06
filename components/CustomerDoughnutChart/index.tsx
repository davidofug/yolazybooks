import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
interface Props {
  ratings: [];
}

const Index: React.FC<Props> = ({ ratings }) => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  ChartJS.defaults.font.family = "Poppins";

  const datasets = ratings.map((rating: number, index: number) => ({
    label: index === 0 ? "pending" : "reviewed",
    data: [rating],
    backgroundColor: [index === 0 ? "#FAB837" : "#4B4B4B"],
    borderWidth: 0,
    borderRadius: 100,
    circumference: (ctx: any): number => {
      const total = ctx.chart.data.datasets.reduce(
        (accumulator: number, dataset: any) => {
          return accumulator + (dataset.data[0] || 0);
        },
        0
      );
      return (ctx.dataset.data[0] / total) * 360;
    },
    rotation: 0,
  }));

  const data: any = {
    datasets: datasets.length > 0 ? datasets : [{ data: [0] }],
  };

  const overlapSlice = {
    id: "overlapSlice",
    beforeDraw: (chart: any) => {
      const { ctx } = chart;

      // Get the outer and inner radi
      const datasetMeta = chart.getDatasetMeta(0);
      if (datasetMeta && datasetMeta.data.length > 0) {
        const outerRadius = datasetMeta.data[0].outerRadius;
        const innerRadius = datasetMeta.data[0].innerRadius;

        // Update the outer and inner radius of the second dataset
        const secondDatasetMeta = chart.getDatasetMeta(1);
        if (secondDatasetMeta && secondDatasetMeta.data.length > 0) {
          secondDatasetMeta.data[0].innerRadius = innerRadius;
          secondDatasetMeta.data[0].outerRadius = outerRadius;
        }

        ctx.save();
      }
    },
  };

  const centerTextPlugin = {
    id: "centerTextPlugin",
    afterDraw: (chart: any) => {
      const { ctx, width, height } = chart;

      // Get total ratings
      const totalRatings = chart.data.datasets.reduce(
        (accumulator: number, dataset: any) => {
          return accumulator + (dataset.data[0] || 0);
        },
        0
      );

      // Set font and font weight
      ctx.font = "700 1.25rem Poppins, sans-serif";

      // Center text
      const text = totalRatings.toString();
      const textWidth = ctx.measureText(text).width;
      const x = (width - textWidth) / 2;
      const y = height / 2;

      // Draw text
      ctx.fillStyle = "black"; // Text color
      ctx.fillText(text, x, y); // Add the text

      // Add 'Ratings' text below
      ctx.font = "100  0.75rem Poppins, sans-serif";
      const ratingsText = "Total Ratings";
      const ratingsTextWidth = ctx.measureText(ratingsText).width;
      ctx.fillText(ratingsText, x + (textWidth - ratingsTextWidth) / 2, y + 20);
    },
  };

  const backgroundCircle = {
    id: "backgroundCircle",
    beforeDatasetsDraw: (chart: any) => {
      const { ctx } = chart;

      // Get the x and y coordinates of the first dataset
      const datasetMeta = chart.getDatasetMeta(0);
      if (datasetMeta && datasetMeta.data.length > 0) {
        const xCoordinate = datasetMeta.data[0].x;
        const yCoordinate = datasetMeta.data[0].y;
        const innerRadius = datasetMeta.data[0].innerRadius;
        const outerRadius = datasetMeta.data[0].outerRadius;
        const width = outerRadius - innerRadius;
        const angle = Math.PI / 180;

        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = ratings?.length === 0 ? width : width * 0.75;
        ctx.strokeStyle = "#FDEEE9";
        ctx.arc(
          xCoordinate,
          yCoordinate,
          outerRadius - width / 2,
          0,
          angle * 360,
          false
        );
        ctx.stroke();
      }
    },
  };

  return (
    <div>
      <Doughnut
        data={data}
        plugins={[overlapSlice, backgroundCircle, centerTextPlugin]}
        options={{
          cutout: () => (ratings?.length > 0 ? "75%" : "85%"),
          responsive: true,
        }}
      />
    </div>
  );
};

export default Index;
