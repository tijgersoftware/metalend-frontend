import { Modal, Tabs, Input, Progress, Divider } from "antd";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  UnderlyingDecimals,
  GetNetwork,
  HandleBalance,
  withdrawMaxLogic,
  maxCalculationBorrow,
  handleBorrowLimit,
  handleBorrowRatio,
  getProvider,
  ApyRateModal,
  hypotheticalBalanceLimit,
  HideByIDS,
  toFixed,
  HandleBorrowLimit,
  getRounding,
  handleDisplayTokenBorrowWallet,
  displayTokenBorrowWallet,
} from "common/integration";
import { useSelector } from "react-redux";

import "./BorrowMarketModal.css";
const BorrowMarletModal = ({
  isDarkMode,
  isBorrowModal,
  setIsBorrowModal,
  marketDetail,

  enabled,
  handleTokenEnabled,
  handleBorrowMarket,
}) => {
  const [currentTab, setCurrentTab] = useState(1);
  const [borrowAmount, setBorrowAmount] = useState(0);
  const [repayAmount, setRepayAmount] = useState(0);
  const [maxRepayAmount, setmaxRepayAmount] = useState(0);
  const { app } = useSelector((state) => state);

  useEffect(() => {
    setIsBorrowModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.userAddress]);

  const ApproveToken = async function () {
    const [network] = await GetNetwork();

    const provider = await getProvider();
    // Tell the contract to allow infinite tokens to be taken by the cToken contract

    const adressJson = require("networks/" + network + ".json");

    const underlyingContractAddress = adressJson[marketDetail.text];

    const signer = provider.getSigner();

    const { erc20Abi } = require("networks/abi.json");
    const underlyingContract = new ethers.Contract(
      underlyingContractAddress,
      erc20Abi,
      signer
    );
    const cTokenContractAddress = adressJson["c" + marketDetail.text];

    let tx = await underlyingContract.approve(
      cTokenContractAddress,
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    );

    await tx.wait(1); // wait until the transaction has 1 confirmation on the blockchain

    handleTokenEnabled();
  };

  const Borrowing80percent = async function () {
    if ((await withdrawMaxLogic("borrowmax", marketDetail.text)) === true) {
      await maxCalculationBorrow(marketDetail.text, "");

      const roundDecimal = await getRounding(marketDetail.text);
      setBorrowAmount(
        toFixed(await maxCalculationBorrow(marketDetail.text, ""), roundDecimal)
      );
    } else {
      setBorrowAmount(0);
    }
  };

  const checkBorrow = async function () {
    const eightyBorrow = await maxCalculationBorrow(marketDetail.text, "");
    const maxBorrow = eightyBorrow / 0.8;
    if (borrowAmount < maxBorrow && borrowAmount > 0) {
      borrow();
    }
  };

  const maxCalculationRepay = async function () {
    const [network] = await GetNetwork();

    const ethers = require("ethers");

    const provider = await getProvider();

    const signer = provider.getSigner();
    const myWalletAddress = signer.getAddress();

    const cTokenName = "c" + marketDetail.text;
    var jsonAbi = require("networks/abi.json");

    let cTokenNameAbi = cTokenName + "Abi";
    const cTokenAbi = jsonAbi[cTokenNameAbi];
    var jsonObject = require("networks/" + network + ".json");
    const cTokenAdress = jsonObject[cTokenName];

    let cToken = new ethers.Contract(cTokenAdress, cTokenAbi, signer);
    const underlyingDecimals = await UnderlyingDecimals(
      marketDetail.text,
      signer
    );

    let currentBorrowBalance = await cToken.callStatic.borrowBalanceCurrent(
      myWalletAddress
    );

    //REPAYMAX

    currentBorrowBalance =
      currentBorrowBalance / Math.pow(10, underlyingDecimals);

    const roundDecimal = await getRounding(marketDetail.text);

    setmaxRepayAmount(toFixed(currentBorrowBalance, roundDecimal));

    setRepayAmount(toFixed(currentBorrowBalance, roundDecimal));
  };

  const borrow = async () => {
    const [network] = await GetNetwork();

    const ethers = require("ethers");

    const provider = await getProvider();
    const { cEthAbi, cErcAbi } = require("networks/abi.json");

    const { cETH } = require("networks/" + network + ".json");

    const tokenString = marketDetail.text;

    const signer = provider.getSigner();
    const wallet = signer;

    const cEthAddress = cETH;
    const cEth = new ethers.Contract(cEthAddress, cEthAbi, wallet);

    const addresJson = require("networks/" + network + ".json");
    let underlyingAddress = 0;
    if (marketDetail.text !== "ETH") {
      underlyingAddress = addresJson[marketDetail.text];
    }

    const cTokenAddress = addresJson["c" + marketDetail.text];
    const cToken = new ethers.Contract(cTokenAddress, cErcAbi, wallet);
    const assetName = marketDetail.text;
    let underlyingDecimals = 0;
    if (assetName === "ETH") {
      underlyingDecimals = 18;
    } else {
      const tokenAbi = [
        {
          constant: true,
          inputs: [],
          name: "decimals",
          outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
      ];

      let underlyingtokenContract = new ethers.Contract(
        underlyingAddress,
        tokenAbi,
        signer
      );

      underlyingDecimals = await underlyingtokenContract.callStatic.decimals();
    }

    const main = async () => {
      const underlyingToBorrow = borrowAmount;
      if (tokenString !== "ETH") {
        const scaledUpBorrowAmount = (
          underlyingToBorrow * Math.pow(10, underlyingDecimals)
        ).toString();
        try {
          const trx = await cToken.borrow(scaledUpBorrowAmount);
          await trx.wait(1);
        } catch (error) {}
      } else {
        try {
          const borrow = await cEth.borrow(
            ethers.utils.parseEther(underlyingToBorrow.toString())
          );
          await borrow.wait(1);
        } catch (error) {}
      }

      await HandleBalance();
      await handleBorrowMarket();
      await HandleBorrowLimit("borrowMarket");
      await displayTokenBorrowWallet(marketDetail.text);
      setBorrowAmount(0);
    };

    main().catch((err) => {
      console.error("ERROR:", err);
    });
  };

  function checkRepay() {
    if (repayAmount > 0) {
      RepayBorrow();
    }
  }

  const RepayBorrow = async () => {
    const [network] = await GetNetwork();

    const ethers = require("ethers");
    const underlyingToBorrow = repayAmount;

    const provider = await getProvider();
    const signer = provider.getSigner();
    const wallet = signer;

    const {
      cEthAbi,

      cErcAbi,
    } = require("networks/abi.json");
    const addresjson = require("networks/" + network + ".json");
    const { cETH } = require("networks/" + network + ".json");
    const ctoken = addresjson["c" + marketDetail.text];

    const cEthAddress = cETH;
    const cEth = new ethers.Contract(cEthAddress, cEthAbi, wallet);

    let underlyingAddress = 0;
    if (marketDetail.text !== "ETH") {
      const token = addresjson[marketDetail.text];
      underlyingAddress = token;
    }

    const cTokenAddress = ctoken;
    const cToken = new ethers.Contract(cTokenAddress, cErcAbi, wallet);
    const assetName = marketDetail.text;
    let underlyingDecimals = 0;

    if (assetName === "ETH") {
      underlyingDecimals = 18;
    } else {
      const tokenAbi = [
        {
          constant: true,
          inputs: [],
          name: "decimals",
          outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
      ];

      let underlyingtokenContract = new ethers.Contract(
        underlyingAddress,
        tokenAbi,
        signer
      );

      underlyingDecimals = await underlyingtokenContract.callStatic.decimals();
    }

    if (assetName !== "ETH") {
      const underlyingToRepay = (
        underlyingToBorrow * Math.pow(10, underlyingDecimals)
      ).toString();

      if (maxRepayAmount === repayAmount) {
        try {
          const repayBorrow = await cToken.repayBorrow(
            ethers.constants.MaxUint256
          );
          await repayBorrow.wait(1);
        } catch {
          console.log(" repay max transation failed");
        }
      } else {
        try {
          const repayBorrow = await cToken.repayBorrow(underlyingToRepay);

          await repayBorrow.wait(1);
        } catch {
          console.log("repay transaction failed");
        }
      }
    } else {
      if (maxRepayAmount === repayAmount) {
        try {
          console.log("repaying the maximum ETH value");
          const { maximillionAbi } = require("networks/abi.json");
          const { Maximillion, cETH } = require("networks/" +
            network +
            ".json");

          const maximillion = new ethers.Contract(
            Maximillion,
            maximillionAbi,
            wallet
          );
          const myWalletAddress = await signer.getAddress();
          console.log(`myWalletAddress is ${myWalletAddress} cETH ${cETH}`);

          const options = {
            value: ethers.utils.parseEther(
              (Number(repayAmount) + 0.01 * Number(repayAmount)).toString()
            ),
          };
          const repayBorrow = await maximillion.repayBehalf(
            myWalletAddress,
            options
          );

          await repayBorrow.wait(1);
        } catch (err) {
          console.log("Eth repay transation failed ");
          console.log(err);
        }
      } else {
        const ethToRepay = repayAmount;

        try {
          const repayBorrow = await cEth.repayBorrow({
            value: ethers.utils.parseEther(ethToRepay.toString()),
          });

          await repayBorrow.wait(1);
        } catch {
          console.log("Eth repay transation failed");
        }
      }
    }

    await HandleBalance();
    await HandleBorrowLimit("borrowMarket");
    await displayTokenBorrowWallet(marketDetail.text);
    setRepayAmount(0);
  };

  const handlehypotheticalDataRepay = async function (newRepay) {
    await hypotheticalBalanceLimit(newRepay, marketDetail.text, "repay", true);
  };

  const handlehypotheticalDataBorrow = async function (newBorrow) {
    await hypotheticalBalanceLimit(
      newBorrow,
      marketDetail.text,
      "borrow",
      true
    );
  };

  const clearHypoCalculation = () => {
    HideByIDS([
      "supplyLimit",
      "supplyLimitArrow",
      "supplyRatio",
      "supplyRatioArrow",
      "withdrawLimit",
      "withdrawLimitArrow",
      "withdrawRatio",
      "withdrawRatioArrow",
    ]);
  };

  return (
    <Modal
      centered
      visible={isBorrowModal}
      onCancel={() => {
        setIsBorrowModal(false);
        clearHypoCalculation();
        setBorrowAmount(0);
        setRepayAmount(0);
      }}
      maxWidth={500}
      footer={false}
      title={
        <div className="modalHeader flex justify-center items-center">
          <img
            src={marketDetail.imaageUrl}
            alt="Augur1"
            className="block w-8 mr-2"
          />
          <span className="text-semiMediumGray text-center dark:text-thinGray md:text-xl text-xs font-semibold justify-items-center ">
            {marketDetail.text}
          </span>
        </div>
      }
      className={` rounded-md  ${isDarkMode ? "linearBetaBG" : "bg-white"}`}
    >
      <div className="modalBody text-center px-4 py-4">
        {+currentTab === 1 ? (
          <div className="modalInput flex justify-center items-center mb-5">
            <Input
              className="w-4/5 text-center border-0 focus:outline-none text-darkGray"
              placeholder="0"
              value={borrowAmount}
              type="number"
              onChange={(e) => {
                setBorrowAmount(e.target.value);
                handlehypotheticalDataBorrow(e.target.value);
              }}
            />

            <span
              onClick={Borrowing80percent}
              className="text-semiMediumGray dark:text-white text-xs block text-center"
            >
              80% <span className="block">Limit</span>
            </span>
          </div>
        ) : (
          <>
            <div className="modalInput flex flex-col justify-center items-center mb-5">
              <img src={marketDetail.imaageUrl} className="w-16 m-3" alt="" />
              {!enabled && (
                <span className="text-semiMediumGray dark:text-white text-xs block text-center">
                  To Supply or Repay {marketDetail.text} to the Metalend
                  Protocol, you need to enable it first.
                </span>
              )}
            </div>
            <div className="modalInput flex justify-center items-center mb-5">
              <Input
                className="w-4/5 text-center border-0 focus:outline-none text-darkGray"
                placeholder="0"
                value={repayAmount}
                type="number"
                onChange={(e) => {
                  setRepayAmount(e.target.value);
                  handlehypotheticalDataRepay(e.target.value);
                }}
              />
              <span
                onClick={maxCalculationRepay}
                className="text-semiMediumGray dark:text-white text-sm block text-center"
              >
                {/* 80% <span className="block">Limit</span> */}
                MAX
              </span>
            </div>
          </>
        )}
        <Tabs
          defaultActiveKey="1"
          onChange={setCurrentTab}
          className="py-5 text-darkGray"
          centered
        >
          <Tabs.TabPane
            tab="Borrow"
            key="1"
            className="text-xs md:text-sm text-darkGray"
          >
            <div className="flex justify-between items-center mb-5">
              <Link
                to="/market"
                className="flex items-center text-xs text-darkGray hover:text-skyCus dark:text-white dark:hover:text-skyCus"
              >
                Borrow Rates
                <FeatherIcon className="ml-2" icon="external-link" size={14} />
              </Link>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src={marketDetail?.imaageUrl}
                  alt="Augur2"
                  className="md:w-10 w-5"
                />
                <div className=" ml-0 md:ml-4">
                  <h1 className="text-mediumGray dark:text-lightGray md:text-sm text-xs font-medium">
                    Borrow APY
                  </h1>
                  <div className="text-darkGray dark:text-lightGray md:text-xl text-xs font-semibold">
                    {ApyRateModal(marketDetail.text, "borrow")}
                  </div>
                </div>
              </div>
              <img
                src="/assets/images/Line.svg"
                alt="Line"
                className="w-8 md:w-16"
              />
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="grid grid-rows-2"></div>
                  <h1 className="text-mediumGray dark:text-lightGray md:text-sm text-xs font-medium">
                    Distribution APY
                  </h1>
                  <span className="text-darkGray dark:text-lightGray md:text-xl text-xs font-semibold">
                    {ApyRateModal(marketDetail.text, "distribution")}
                  </span>
                </div>
                <img
                  src="/assets/images/Meatalandicon.svg"
                  alt="Meataland icon"
                  className="md:w-10 w-5"
                />
              </div>
            </div>
            <Divider
              type="horizontal"
              style={{
                color: "#DADADA",
                borderTop: "2px solid",
              }}
              className="w-full mx-0 dark:text-mediumGray"
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src="/assets/images/Meatalandicon.svg"
                  alt="Meataland icon"
                  className="md:w-10 w-5"
                />
                <div className="ml-2 md:ml-4">
                  <h1 className="text-mediumGray dark:text-lightGray md:text-sm text-xs font-medium">
                    Limit
                  </h1>
                  <span
                    id="borrowLimitRepayTab"
                    className="text-darkGray dark:text-lightGray md:text-xl text-xs font-semibold"
                  >
                    <div class="row">
                      <div id="currentBorrowLimit">{handleBorrowLimit()} </div>

                      <div id="borrowLimitArrow" class="arrow">
                        <img src="/assets/images/arrow.svg" alt="arrow"></img>
                      </div>
                      <div id="borrowLimit"></div>
                    </div>
                  </span>
                </div>
              </div>

              <Divider
                type="vertical"
                style={{
                  height: "30px",
                  color: "#DADADA",
                  borderLeft: "2px solid",
                }}
                className="mx-0 dark:text-mediumGray"
              />

              <div className="flex items-center">
                <div className="ml-0">
                  <h1 className="text-mediumGray dark:text-lightGray md:text-sm  text-xs font-medium">
                    Limit Used:
                  </h1>

                  <span className="text-darkGray dark:text-lightGray md:text-xl text-xs font-semibold">
                    <div class="row">
                      <div id="currentBorrowLimitRatio">
                        {" "}
                        {handleBorrowRatio()} %
                      </div>
                      <div id="borrowRatioArrow" class="arrow">
                        <img src="/assets/images/arrow.svg" alt="arrow"></img>
                      </div>
                      <div id="borrowRatio"></div>
                    </div>
                  </span>
                </div>

                <Progress
                  type="circle"
                  percent={handleBorrowRatio()}
                  showInfo={false}
                  strokeWidth={8}
                  width={30}
                  strokeColor={"#17F6FF"}
                  className="ml-2"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={checkBorrow}
              style={{
                width: "80%",
                justifyContent: "center",
                alignItems: "center",
              }}
              className="block mx-auto mt-5 text-white dark:text-darkGray border-skyCus border-2 dark:bg-skyCus bg-skyCus px-5 py-2  mx-5 rounded-md text-xs md:text-sm justify-center justify-items-center justify-self-center items-center mt-5 "
            >
              Borrow
            </button>
            <div className="text-mediumGray dark:text-lightGray md:text-sm text-left font-medium alignleft">
              Currently Borrowing
            </div>
            <div
              id="CurrentlyBorrowing"
              className="text-mediumGray dark:text-lightGray md:text-sm text-right font-medium alignright"
            >
              {handleDisplayTokenBorrowWallet(
                marketDetail.text,
                "CurrentlyBorrowing"
              )}
            </div>
            ,
          </Tabs.TabPane>

          <Tabs.TabPane
            tab="Repay"
            key="2"
            className="text-xs md:text-sm text-darkGray"
          >
            <div className="flex justify-between items-center mb-5">
              <Link
                to="/market"
                className="flex items-center text-xs text-darkGray hover:text-skyCus dark:text-white dark:hover:text-skyCus"
              >
                Borrow Rates
                <FeatherIcon className="ml-2" icon="external-link" size={14} />
              </Link>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src={marketDetail?.imaageUrl}
                  alt="Augur2"
                  className="md:w-10 w-5"
                />
                <div className=" ml-0 md:ml-4">
                  <h1 className="text-mediumGray dark:text-lightGray md:text-sm text-xs font-medium">
                    Borrow APY
                  </h1>
                  <span className="text-darkGray dark:text-lightGray md:text-xl text-xs font-semibold">
                    {ApyRateModal(marketDetail.text, "borrow")}
                  </span>
                </div>
              </div>
              <img
                src="/assets/images/Line.svg"
                alt="Line"
                className="w-8 md:w-16"
              />
              <div className="flex items-center">
                <div className="mr-2 md:mr-4">
                  <div className="grid grid-rows-2"></div>
                  <h1 className="text-mediumGray dark:text-lightGray md:text-sm text-xs font-medium">
                    Distribution APY
                  </h1>
                  <span className="text-darkGray dark:text-lightGray md:text-xl text-xs font-semibold">
                    {ApyRateModal(marketDetail.text, "distribution")}
                  </span>
                </div>
                <img
                  src="/assets/images/Meatalandicon.svg"
                  alt="Meataland icon"
                  className="md:w-10 w-5"
                />
              </div>
            </div>
            <Divider
              type="horizontal"
              style={{
                color: "#DADADA",
                borderTop: "2px solid",
              }}
              className="w-full mx-0 dark:text-mediumGray"
            />
            <h1 className="text-darkGray dark:text-white mb-3">Borrow Limit</h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src="/assets/images/Meatalandicon.svg"
                  alt="Meataland icon"
                  className="md:w-10 w-5"
                />
                <div className="ml-2 md:ml-4">
                  <h1 className="text-mediumGray dark:text-lightGray md:text-sm text-xs font-medium">
                    Limit
                  </h1>
                  <span
                    id="borrowLimitRepayTab"
                    className="text-darkGray dark:text-lightGray md:text-xl text-xs font-semibold"
                  >
                    <div class="row">
                      <div id="currentRepayBorrowLimit">
                        {handleBorrowLimit()}{" "}
                      </div>

                      <div id="repayLimitArrow" class="arrow">
                        <img src="/assets/images/arrow.svg" alt="arrow"></img>
                      </div>
                      <div id="repayLimit"></div>
                    </div>
                  </span>
                </div>
              </div>

              <Divider
                type="vertical"
                style={{
                  height: "30px",
                  color: "#DADADA",
                  borderLeft: "2px solid",
                }}
                className="mx-0 dark:text-mediumGray"
              />

              <div className="flex items-center">
                <div className="ml-0">
                  <h1 className="text-mediumGray dark:text-lightGray md:text-sm  text-xs font-medium">
                    Limit Used:
                  </h1>
                  <span className="text-darkGray dark:text-lightGray md:text-xl text-xs font-semibold">
                    <div class="row">
                      <div id="currentRepayBorrowLimitRatio">
                        {" "}
                        {handleBorrowRatio()} %
                      </div>

                      <div id="repayRatioArrow" class="arrow">
                        <img src="/assets/images/arrow.svg" alt="arrow"></img>
                      </div>
                      <div id="repayRatio"></div>
                    </div>
                  </span>
                </div>

                <Progress
                  type="circle"
                  percent={handleBorrowRatio()}
                  showInfo={false}
                  strokeWidth={8}
                  width={30}
                  strokeColor={"#17F6FF"}
                  className="ml-2"
                />
              </div>
            </div>
            {!enabled && (
              <button
                onClick={ApproveToken}
                type="button"
                style={{
                  width: "80%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="block mx-auto mt-5 text-white dark:text-darkGray border-skyCus border-2 dark:bg-skyCus bg-skyCus px-5 py-2  mx-5 rounded-md text-xs md:text-sm justify-center justify-items-center justify-self-center items-center mt-5 "
              >
                Enable
              </button>
            )}
            {enabled && (
              <button
                onClick={checkRepay}
                type="button"
                style={{
                  width: "80%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className=" text-white dark:text-darkGray border-skyCus border-2 dark:bg-skyCus bg-skyCus px-5 py-2  mx-5 rounded-md text-xs md:text-sm justify-center justify-items-center justify-self-center items-center mt-5 "
              >
                Repay
              </button>
            )}
            <div className="text-mediumGray dark:text-lightGray md:text-sm text-left font-medium alignleft">
              Wallet Balance
            </div>

            <div
              id="WalletBalanceBorrow"
              className="text-mediumGray dark:text-lightGray md:text-sm text-right font-medium alignright"
            >
              {handleDisplayTokenBorrowWallet(
                marketDetail.text,
                "walletBalance"
              )}
            </div>

            {/* <h1
              className="text-mediumGray dark:text-lightGray md:text-sm  text-xs font-medium"
              style={{
                PaddingTop: "5px",
              }}
            ></h1> */}
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default BorrowMarletModal;
