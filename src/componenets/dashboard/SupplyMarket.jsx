import { Table, Tag } from "antd";
import Switch from "react-switch";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import { supplyMarket } from "common/demiData";
import SupplyMarletModal from "modals/dashboard/SupplyMarletModal";
import { ethers } from "ethers";
import {
  GetNetwork,
  withdrawMaxLogic,
  maxCalculationSupply,
  Rates,
  handleBorrowLimitSetupVariable,
  getTokenBorrowBalanceArray,
  supportNetwork,
  getProvider,
  toFixed,
} from "common/integration.js";
import { updateApprovedArray } from "redux/appSlice/appSlice";

const SupplyMarket = () => {
  const { app } = useSelector((state) => state);
  const [isSupplyModal, setIsSupplyModal] = useState(false);
  // it is hardcoded date now, need to fetch from ctoken contracts later
  const [marketData, setMarketData] = useState(supplyMarket);
  const [selectedMarket, setSelectedMarket] = useState(0);
  const [tokenBorrowBalanceArray, setTokenBorrowBalanceArray] = useState([]);
  const dispatch = useDispatch();

  const SupplyRates = async function () {
    const [, supportNetwork] = await GetNetwork();
    if (supportNetwork === true) {
      const SupplyRateDict = await Rates("supplyRates");

      return [SupplyRateDict, Object.keys(SupplyRateDict).length];
    }
  };

  async function handleAPY() {
    if (supportNetwork === true) {
      const supplyRate = await SupplyRates();
      const supplyRateDict = supplyRate[0];
      const supplyRateDictLength = supplyRate[1];
      const data = [...marketData];

      for (let id = 1; id <= supplyRateDictLength; id++) {
        var marketName = marketData[id - 1].text;

        const index = data?.findIndex((item) => +item.id === +id);
        data[index]["tag"] = !data[index]?.tag;

        data[index]["tag"] = toFixed(supplyRateDict[marketName], 2) + "%";
      }

      setMarketData(data);
    }
  }

  var handleSupplyMarket = async function () {
    const [, supportNetwork] = await GetNetwork();
    if (supportNetwork === true) {
      await handleAPY();
      await handleWallets();
      await handleEnteredMarkets();
    }
  };

  useEffect(() => {
    handleSupplyMarket();
    getTokenBorrowBalanceArray(setTokenBorrowBalanceArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.userAddress]);

  function handleChange(id) {
    const data = [...marketData];
    var marketName = marketData[id - 1].text;

    const index = data?.findIndex((item) => +item.id === +id);

    if (!data[index]["collateral"]) {
      EnterMarket(marketName);
    } else {
      withdrawMaxLogic("exit", marketName);
    }
  }

  async function handleWallets() {
    if (supportNetwork === true) {
      const walletData = await maxCalculationSupply("onload");
      const walletDataDict = walletData[0];
      const walletDataDictLength = walletData[1];

      const data = [...marketData];

      for (let id = 1; id <= walletDataDictLength; id++) {
        var marketName = marketData[id - 1].text;

        const index = data?.findIndex((item) => +item.id === +id);
        data[index]["wallet"] = !data[index]?.wallet;
        data[index]["wallet"] = walletDataDict[marketName] + " " + marketName;
      }

      setMarketData(data);
    }
  }
  //temp handling for v0 markets(BTC/ETH only)
  async function handleEnteredMarkets() {
    const [network, supportNetwork] = await GetNetwork();
    if (supportNetwork === true) {
      const provider = await getProvider();

      const signer = provider.getSigner();
      const myWalletAddress = await signer.getAddress();
      const { Comptroller } = require("networks/" + network + ".json");

      const { comptrollerAbi } = require("networks/abi.json");
      const data = [...marketData];

      const comptroller = new ethers.Contract(
        Comptroller,
        comptrollerAbi,
        signer
      );

      const enteredMarkets = await comptroller.callStatic.getAssetsIn(
        myWalletAddress
      );
      var adresJson = require("networks/" + network + ".json");
      if (enteredMarkets.includes(adresJson["cWBTC"])) {
        data[0]["collateral"] = true;
      }
      if (enteredMarkets.includes(adresJson["cETH"])) {
        data[1]["collateral"] = true;
      }

      setMarketData(data);
    }
  }

  async function EnterMarket(asset) {
    const [network, supportNetwork] = await GetNetwork();
    if (supportNetwork === true) {
      const provider = await getProvider();

      const signer = provider.getSigner();

      const addresjson = require("networks/" + network + ".json");

      let markets = [addresjson["c" + asset]]; // This is the cToken contract(s) for your collateral
      const comptrollerAbi = [
        {
          constant: false,
          inputs: [
            {
              internalType: "address[]",
              name: "cTokens",
              type: "address[]",
            },
          ],
          name: "enterMarkets",
          outputs: [
            {
              internalType: "uint256[]",
              name: "",
              type: "uint256[]",
            },
          ],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ];
      const { Comptroller } = require("networks/" + network + ".json");

      const comptroller = new ethers.Contract(
        Comptroller,
        comptrollerAbi,
        signer
      );

      let enterMarkets = await comptroller.enterMarkets(markets);
      await enterMarkets.wait(1);
      await handleEnteredMarkets();
    }
  }

  function assetOnClick(id) {
    if (supportNetwork === true) {
      setSelectedMarket(id);
      setIsSupplyModal(!isSupplyModal);
      handleBorrowLimitSetupVariable();
    }
  }

  function handleTokenEnabled() {
    let newApprovedArray = app.approvedArray.slice();
    newApprovedArray[selectedMarket - 1] = true;
    dispatch(updateApprovedArray({ approvedArray: newApprovedArray }));
  }

  const columns = [
    {
      title: <span className="text-lightGray text-sm">Asset</span>,
      dataIndex: "asset",
    },
    {
      title: <span className="text-lightGray  text-sm">APY</span>,
      dataIndex: "apy",
    },
    {
      title: <span className="text-lightGray text-sm">Wallet</span>,
      dataIndex: "wallet",
    },
    {
      title: <span className="text-lightGray text-sm">Collateral</span>,
      dataIndex: "collateral",
    },
  ];

  const data = marketData
    ?.filter((market) => !tokenBorrowBalanceArray[market.id - 1] > 0)
    .map((market) => {
      return {
        asset: (
          <button
            onClick={() => assetOnClick(market?.id)}
            className="flex flex-col md:flex-row items-center  w-full"
          >
            <img
              src={market?.imaageUrl}
              alt="Bitcoin logo"
              className="w-5 mb-1 md:mb-0 md:ml-2 logoCoin"
              id="logoCoins"
            />
            <span
              className="text-darkGray dark:text-white md:ml-3 text-xs"
              id="nameCoins"
            >
              {market?.text}
            </span>
          </button>
        ),
        apy: (
          <Tag className="rounded-lg text-secondary text-xs bg-lightThinBlueCus dark:bg-secondary dark:text-white border-0">
            {market?.tag}
          </Tag>
        ),
        wallet: (
          <span
            onClick={handleWallets}
            className="text-semiMediumGray dark:text-lightGray text-xs"
          >
            {market?.wallet}
          </span>
        ),
        collateral: market?.collaterable && (
          <Switch
            checked={market?.collateral}
            onChange={() => handleChange(market?.id)}
            onColor="#C3FDFF"
            onHandleColor="#17F6FF"
            handleDiameter={15}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={10}
            width={30}
            className="react-switch"
          />
        ),
      };
    });

  return (
    <>
      <div
        className={`pt-5 rounded-lg mb-3 ${
          app?.isDarkMode ? "linearBetaBG" : "bg-white"
        }`}
      >
        <div className="flex">
          <div className="flex-none">
            <img src="/assets/images/Vector.svg" alt="" className="ml-5 mt-1" />
          </div>
          <div className="flex-1 w-64 mt-1">
            <span className="textSupply text-lightGreen ml-4 mb-2 font-semibold">
              Supply Market
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
        <div className="my-5">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey={(record, index) => index}
            className="flex flex-col bg-transparent px-3"
          />
        </div>
      </div>
      <SupplyMarletModal
        isDarkMode={app?.isDarkMode}
        isSupplyModal={isSupplyModal}
        setIsSupplyModal={setIsSupplyModal}
        marketDetail={selectedMarket > 0 && marketData[selectedMarket - 1]}
        userAddress={app.userAddress}
        enabled={app.approvedArray[selectedMarket - 1]}
        handleTokenEnabled={handleTokenEnabled}
        handleWallets={handleWallets}
      />
    </>
  );
};

export default SupplyMarket;
