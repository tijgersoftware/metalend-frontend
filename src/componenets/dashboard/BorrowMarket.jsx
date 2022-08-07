import { useSelector, useDispatch } from "react-redux";
import { borrowMarket } from "common/demiData";
import { Table, Tag } from "antd";
import React, { useState, useEffect } from "react";
import BorrowMarletModal from "modals/dashboard/BorrowMarketModal";
import {
  getMarketLiquidity,
  Rates,
  handleBorrowLimitSetupVariable,
  getTokenSupplyBalanceArray,
  supportNetwork,
  GetNetwork,
  toFixed,
} from "common/integration.js";
import { updateApprovedArray } from "redux/appSlice/appSlice";

const BorrowMarket = () => {
  const { app } = useSelector((state) => state);
  const [isBorrowModal, setIsBorrowModal] = useState(false);
  const [marketData, setMarketData] = useState(borrowMarket);
  const [wlData, setWlMarketData] = useState(borrowMarket);
  const [selectedMarket, setSelectedMarket] = useState(0);
  const [tokenSupplyBalanceArray, setTokenSupplyBalanceArray] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getTokenSupplyBalanceArray(setTokenSupplyBalanceArray);

    handleWL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.userAddress]);

  const BorrowRates = async function () {
    if (supportNetwork === true) {
      const SupplyRateDict = await Rates("borrowRates");

      return [SupplyRateDict, Object.keys(SupplyRateDict).length];
    }
  };

  async function handleBorrowAPY() {
    if (supportNetwork === true) {
      const borrowRate = await BorrowRates();
      const borrowRateDict = borrowRate[0];
      const borrowRateDictLength = borrowRate[1];

      const data = [...marketData];

      for (let id = 1; id <= borrowRateDictLength; id++) {
        var marketName = marketData[id - 1].text;

        const index = data?.findIndex((item) => +item.id === +id);
        data[index]["tag"] = !data[index]?.tag;

        data[index]["tag"] = toFixed(borrowRateDict[marketName], 2) + "%";
      }

      setMarketData(data);
    }
  }

  const handleBorrowMarket = async function () {
    const [, supportNetwork] = await GetNetwork();
    if (supportNetwork === true) {
      await handleBorrowAPY();
      await marketLiquidity();
    }
  };

  const handleWL = function () {
    setWlMarketData(
      NZDSWL.includes(app.userAddress) ? marketData : marketData.slice(0, -1)
    );
  };

  useEffect(() => {
    handleBorrowMarket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function marketLiquidity() {
    const [, supportNetwork] = await GetNetwork();
    if (supportNetwork === true) {
      const marketLiquidity = await getMarketLiquidity();
      const marketLiquidityDict = marketLiquidity[0];
      const marketLiquidityLength = marketLiquidity[1];

      const data = [...marketData];

      for (let id = 1; id <= marketLiquidityLength; id++) {
        var marketName = marketData[id - 1].text;

        const index = data?.findIndex((item) => +item.id === +id);
        data[index]["liquidity"] = !data[index]?.liquidity;
        data[index]["liquidity"] = "$" + marketLiquidityDict[marketName];
      }

      setMarketData(data);
    }
  }

  function handleTokenEnabled() {
    let newApprovedArray = app.approvedArray.slice();
    newApprovedArray[selectedMarket - 1] = true;
    dispatch(updateApprovedArray({ approvedArray: newApprovedArray }));
  }

  const columns = [
    {
      title: <span className="text-lightGray text-sm ">Asset</span>,
      dataIndex: "asset",
    },
    {
      title: <span className="text-lightGray  text-sm">APY</span>,
      dataIndex: "apy",
    },
    // {
    //   title: <span className='text-lightGray  text-sm'>Wallet</span>,
    //   dataIndex: 'wallet',
    // },
    {
      title: <span className="text-lightGray  text-sm">Liquidity</span>,
      dataIndex: "liquidity",
    },
  ];

  function assetOnClick(id) {
    if (supportNetwork === true) {
      setSelectedMarket(id);
      setIsBorrowModal(!isBorrowModal);

      handleBorrowLimitSetupVariable();
    }
  }

  const NZDSWL = [
    "0x2a75536cD9B7A6E1E858768242d60CAe7F83Ca6e",
    "0x386C929AF6c2d890a12c448eAcEe60E8c1e9b0c7",
    "0xCd51bE3eB3e13d1C144a7Fa2536C12A4040A8E29",
    "0x788E6b02258307aD05bE5C8756060f248CE3585d",
    "0xb1181A2ceC746fe12e1b56862A16e49fBF705Cfe",
    "0xf04946c11127A096Bcd6a572c01C89C164f2fa12",
    "0x73FA9Df99faaa8D110c5AFd917355ebA0f993362",
    "0x3434c3cd803c37b7df4f34dfa11964e71ee7a933",
    "0x86aD98BF119Bf6f1ecBD394ABbE8b4Ffdf4097e4",
  ];
  const data = wlData
    ?.filter((market) => !tokenSupplyBalanceArray[market.id - 1] > 0)
    .map((market) => {
      return {
        asset: (
          <button
            className="flex flex-col md:flex-row items-center w-full"
            onClick={() => assetOnClick(market?.id)}
          >
            <img
              src={market?.imaageUrl}
              alt="Bitcoin logo"
              className="w-5 mb-1 md:mb-0 md:ml-2"
            />
            <span className="text-darkGray dark:text-white md:ml-3 text-xs">
              {market?.text}
            </span>
          </button>
        ),
        apy: (
          <Tag className="rounded-lg text-secondary bg-lightThinBlueCus dark:bg-secondary dark:text-white border-0">
            {market?.tag}
          </Tag>
        ),
        wallet: (
          <span className="text-semiMediumGray dark:text-lightGray text-xs">
            {market?.wallet}
          </span>
        ),
        liquidity: (
          <span
            onClick={marketLiquidity}
            className="text-semiMediumGray dark:text-lightGray text-xs"
          >
            {market?.liquidity}
          </span>
        ),
      };
    });

  return (
    <>
      <div
        className={`pt-5 rounded-md mb-3 ${
          app?.isDarkMode ? "linearBetaBG" : "bg-white"
        }`}
      >
        <div className="flex">
          <div className="flex-none">
            <img
              src="/assets/images/borrowVector.svg"
              alt=""
              className="ml-5 mt-1"
            />
          </div>
          <div className="flex-1 w-64 mt-1">
            <span className="textSupply text-primary ml-3 mb-3  font-semibold">
              Borrow Markets
            </span>
          </div>
          <div className="flex-1 w-32 mb-5 ">
            {/* <Input
              size='small'
              className='border-0 bg-transparent divide-gray-400 divide-y-2 focus:outline-none'
              placeholder='Search'
              prefix={
                <FeatherIcon
                  icon='search'
                  className='text-lightGray dark:text-whiter mx-1'
                  size={20}
                />
              }
            /> */}
          </div>
        </div>
        <div className="my-5 ">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey={(record, index) => index}
            className=" bg-transparent px-3"
          />
        </div>
      </div>
      <BorrowMarletModal
        className="rounded-md border-slate-300"
        isDarkMode={app?.isDarkMode}
        isBorrowModal={isBorrowModal}
        setIsBorrowModal={setIsBorrowModal}
        marketDetail={selectedMarket > 0 && marketData[selectedMarket - 1]}
        userAddress={app.userAddress}
        enabled={app.approvedArray[selectedMarket - 1]}
        handleTokenEnabled={handleTokenEnabled}
        handleBorrowMarket={handleBorrowMarket}
      />
    </>
  );
};

export default BorrowMarket;
