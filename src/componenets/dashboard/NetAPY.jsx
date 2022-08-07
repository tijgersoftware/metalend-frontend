import { useSelector } from "react-redux";
import { Tag, Divider } from "antd";
import FeatherIcon from "feather-icons-react";
import NetAPYModal from "modals/dashboard/NetAPYModal";
import React, { useState, useEffect } from "react";
import ConnectModal from "modals/header/ConnectModal";
import { HandleBalance, GetNetwork, ShowAllLoader } from "common/integration";

import "./NetAPY.css";

const NetAPY = () => {
  const { app } = useSelector((state) => state);
  const [visible, setVisible] = useState(false);
  const [isConnectModal, setIsConnectModal] = useState(false);

  var handleBalances = async function () {
    const [, supportNetwork] = await GetNetwork();
    if (supportNetwork === true) {
      await HandleBalance();
    } else if (supportNetwork === false) {
      await ShowAllLoader();
      document.getElementById("BorrowBalance").classList.remove("continuous1");
      document.getElementById("BorrowBalance").className += " continuous2";
      document.getElementById("SupplyBalance").classList.remove("continuous1");
      document.getElementById("SupplyBalance").className += " continuous2";

      document.getElementById("TVL").classList.remove("continuous1");
      document.getElementById("TVL").className += " continuous2";
    }
  };

  useEffect(() => {
    handleBalances();
  }, [app.userAddress]);

  const handleDefaultValue = async function () {
    return 0;
  };
  return (
    <>
      <div
        className={`footerDiv text-left mt-3 py-8 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 w-full rounded-md mb-3 ${
          app?.isDarkMode ? "linearBetaBG" : "bg-white"
        }`}
      >
        <div className="grid grid-cols-12 gap-6 px-3">
          <div className="col-span-12 xl:col-span-6 lg:col-span-5 md:col-span-5 sm:grid-cols-12 gap-4">
            <h1 className="md:text-base lg:text-base sm:text-xs text-xs text-lightGray font-medium mb-2">
              Total Market Size
            </h1>
            <h1
              id="TVL"
              className="text-slate-200 font-semibold md:text-3xl text-xl text-darkGray dark:text-white "
            >
              {handleDefaultValue}{" "}
              <sup className="text-xs text-lightGray"></sup>
            </h1>
            <Tag
              id="netApy"
              className="rounded-xl text-secondary dark:text-white text-xs bg-lightThinBlueCus dark:bg-secondary border-0 w-max flex py-2 px-4 mt-2"
            >
              10M Club &nbsp;
              <FeatherIcon
                icon="trending-up"
                className="text-secondary dark:text-white mx-1"
                size={14}
              />
            </Tag>
            {/* <button onclick={getTransfer()}>calculate interst</button> */}
          </div>
          <div className="col-span-12 xl:col-span-5 lg:col-span-7 md:col-span-7 sm:grid-cols-12 gap-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <button
                // onClick={() => setVisible(true)}
                className="flex items-center mt-5"
              >
                <img
                  src="/assets/images/supplyBalance.svg"
                  alt="supply balance logo"
                  className="md:w-14 w-8"
                />
                <div class="event-log">
                  <div className=" ml-4">
                    <h1
                      id="SupplyBalance"
                      className="text-slate-200 font-semibold not-italic text-lg lg:text-2xl text-base text-darkGray dark:text-white "
                    >
                      {handleDefaultValue}
                    </h1>
                    <span className="text-lightGreen text-xs lg:text-sm">
                      Supply Balance
                    </span>
                  </div>
                </div>
              </button>
              <Divider
                type="vertical"
                style={{
                  height: "30px",
                  color: "#DADADA",
                  borderLeft: "2px solid",
                }}
                className="lg:ml-7  md:ml-5 dark: text-mediumGray md:block hidden"
              />

              <button className="flex items-center mt-5">
                <img
                  src="/assets/images/BorrowBalance.svg"
                  alt=""
                  className="md:w-14 w-8"
                />

                <div className="textDiv ml-4">
                  <h1
                    id="BorrowBalance"
                    className="text-slate-200 font-semibold not-italic text-lg lg:text-2xl text-base text-darkGray dark:text-white continuous-1"
                  >
                    {handleDefaultValue}
                  </h1>

                  <span className="text-lightGray  text-xs lg:text-sm">
                    Borrow Balance
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <NetAPYModal
        isDarkMode={app?.isDarkMode}
        visible={visible}
        setVisible={setVisible}
      />
      <ConnectModal
        isDarkMode={app?.isDarkMode}
        isConnectModal={isConnectModal}
        setIsConnectModal={setIsConnectModal}
      />
    </>
  );
};

export default NetAPY;
