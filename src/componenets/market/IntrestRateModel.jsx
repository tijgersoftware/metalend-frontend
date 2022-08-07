import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import { useState } from "react";

const IntrestRateModel = () => {
  const { app } = useSelector((state) => state);
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "",
        data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
      },
      {
        name: "",
        data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35],
      },
      {
        name: "",
        data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [5, 7, 5],
        curve: "smooth",
      },
      title: {
        text: "",
        align: "left",
      },
      legend: {
        tooltipHoverFormatter: function (val, opts) {
          return (
            val +
            " - " +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            ""
          );
        },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6,
        },
      },
      xaxis: {
        categories: [
          "01 Jan",
          "02 Jan",
          "03 Jan",
          "04 Jan",
          "05 Jan",
          "06 Jan",
          "07 Jan",
          "08 Jan",
          "09 Jan",
          "10 Jan",
          "11 Jan",
          "12 Jan",
        ],
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val + " (mins)";
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val + " per session";
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val;
              },
            },
          },
        ],
      },
      grid: {
        borderColor: "#f1f1f1",
      },
    },
  });

  return (
    <>
      <div
        className={`pt-5 rounded-lg mb-3 ${
          app?.isDarkMode ? "linearBetaBG" : "bg-white"
        }`}
      >
        <div className="grid grid-cols-2">
          <div>
            <span className="ml-5 font-semibold md:text-base text-sm text-darkGray dark:text-thinGray">
              Interest Rate Model
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="votingStyle mr-6 font-medium text-xs text-semiMediumGray dark:text-white">
              <span className="rounded-full bg-lightPurple w-2 h-2 mt-1 mr-3 inline-block"></span>
              Utilization
            </span>
            <span className="votingStyle mr-14 font-medium text-xs  text-semiMediumGray dark:text-white flex">
              <span className="rounded-full bg-secondary w-2 h-2 mt-1 md:mr-4 mr-2 pt-1 inline-block"></span>
              APY
            </span>
          </div>
        </div>
        <div className="interestGraph">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="line"
            height={350}
          />
        </div>
      </div>
    </>
  );
};

export default IntrestRateModel;
