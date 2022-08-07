import { Fragment, useState } from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import IntrestRateModel from "componenets/market/IntrestRateModel";
import MarketDetails from "componenets/market/MarketDetails";
import { Tabs, Divider } from "antd";

import "./market.css";

const Market = () => {
  const { app } = useSelector((state) => state);
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "",
        type: "column",
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
        color: "#F2F2F2",
      },
      {
        name: "",
        type: "area",
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
        color: "#17F6FF",
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        stacked: false,
        zoom: {
          enabled: false,
        },
      },
      stroke: {
        width: [0, 2],
        curve: "smooth",
      },
      fill: {
        opacity: [1, 0.25],
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [20, 100, 100, 100],
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },
      labels: [
        "01/01/2003",
        "02/01/2003",
        "03/01/2003",
        "04/01/2003",
        "05/01/2003",
        "06/01/2003",
        "07/01/2003",
        "08/01/2003",
        "09/01/2003",
        "10/01/2003",
        "11/01/2003",
      ],
      markers: {
        size: 0,
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        title: {
          text: "Points",
        },
        min: 0,
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " points";
            }
            return y;
          },
        },
      },
    },
  });

  const { TabPane } = Tabs;

  function callback(key) {
    // console.log(key);
  }

  return (
    <Fragment>
      <div
        className={`pt-5 mt-5 rounded-lg mb-3 ${
          app?.isDarkMode ? "linearBetaBG" : "bg-white"
        }`}
      >
        <div className="grid grid-cols-12 md:pt-5 py-5 px-3">
          <div className=" lg:col-span-5 xl:col-span-6 md:col-span-4 col-span-12 md-mb-0 mb-5 ">
            <span className="flex flex-row">
              <img
                src="/assets/images/Bitcoin.svg"
                alt="Bitcoin logo"
                className="ml-5 md:w-10 w-6"
              />
              <span className="text-darkGray dark:text-white ml-3 font-semibold text-base md:text-2xl">
                Bitcoin
              </span>
            </span>
          </div>
          <div className="lg:col-span-6 md:col-span-7 col-span-9 ">
            <div className="grid md:grid-cols-4 grid-cols-2 md:gap-0 gap-8">
              <div className="textDiv ml-4 flex">
                <div>
                  <h1 className="text-slate-200 font-semibold not-italic text-lg lg:text-2xl text-darkGray dark:text-white ">
                    0.16%
                  </h1>
                  <span className="dark:text-lightGray text-semiMediumGray  text-xs lg:text-sm ">
                    Net Rate
                  </span>
                </div>

                <Divider
                  type="vertical"
                  className="mt-2 ml-5 hidden md:block"
                  style={{
                    height: "35px",
                    color: "#F2F2F2",
                    borderLeft: "2px solid",
                  }}
                />
              </div>

              <div className="textDiv ml-1 flex">
                <div>
                  <h1 className="text-slate-200 font-semibold not-italic text-lg lg:text-2xl text-darkGray dark:text-white ">
                    0.07%
                  </h1>
                  <span className="dark:text-lightGray text-semiMediumGray  text-xs lg:text-sm">
                    Supply APY
                  </span>
                </div>
                <Divider
                  type="vertical"
                  className="mt-2 ml-5 hidden md:block"
                  style={{
                    height: "35px",
                    color: "#F2F2F2",
                    borderLeft: "2px solid",
                  }}
                />
              </div>
              <div className="textDiv md:ml-0 ml-4  flex">
                <div>
                  <h1 className="text-slate-200 font-semibold not-italic text-lg lg:text-2xl text-darkGray dark:text-white md:ml-4 ml-0 ">
                    Coming Soon
                  </h1>
                  <span className="dark:text-lightGray text-semiMediumGray text-xs">
                    Distribution APY
                  </span>
                </div>

                <Divider
                  type="vertical"
                  className="mt-2 ml-5 hidden md:block"
                  style={{
                    height: "35px",
                    color: "#F2F2F2",
                    borderLeft: "2px solid",
                  }}
                />
              </div>
              <div className="textDiv ">
                <h1 className="text-slate-200 font-semibold not-italic text-lg lg:text-2xl text-darkGray dark:text-white ">
                  $100.0000
                </h1>
                <span className="dark:text-lightGray text-semiMediumGray text-xs lg:text-sm md:ml-6 ml-0">
                  Total Supply
                </span>
              </div>
            </div>
          </div>
        </div>
        <Tabs
          defaultActiveKey="1"
          onChange={callback}
          className="md:p-5  px-5 text-darkGray"
        >
          <TabPane tab="Supply" key="1" className="text-darkGray">
            <div className="marketChatDiv py-5">
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="line"
                height={"200%"}
              />
            </div>
          </TabPane>
          <TabPane tab="Borrow" key="2" className="text-darkGray">
            <div className="marketChatDiv py-5">
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="line"
                height={350}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-4">
        <IntrestRateModel />
        <MarketDetails />
      </div>
    </Fragment>
  );
};

export default Market;
