import { Modal, Tabs, Input, Progress, Divider } from "antd";
//import { Link } from "react-router-dom";
//import FeatherIcon from "feather-icons-react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  GetNetwork,
  UnderlyingDecimals,
  withdrawMaxLogic,
  HandleBalance,
  maxCalculationSupply,
  getProvider,
  handleBorrowLimit,
  handleBorrowRatio,
  withdrawAlltokens,
  displayTokenSupplyWallet,
  ApyRateModal,
  hypotheticalBalanceLimit,
  toFixed,
  HideByIDS,
  assetIsCollateral,
  HandleBorrowLimit,
  getRounding,
  handleDisplayTokenSuppliedBalance,
} from "common/integration";
import { useSelector } from "react-redux";

var WalletBalanceDict = {};

//market detail is passed to this modal now
const SupplyMarletModal = ({
  isDarkMode,
  isSupplyModal,
  setIsSupplyModal,
  marketDetail,
  enabled,
  handleTokenEnabled,
  handleWallets,
}) => {
  const [currentTab, setCurrentTab] = useState(1);

  const [supplyAmount, setSupplyAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [maxWithdrawAmountButton, setmaxWithdrawAmount] = useState(0);
  const { app } = useSelector((state) => state);

  const SupplyMax = async function (assetName) {
    const calculateMyWalletBalance = await maxCalculationSupply(
      "maxCalculation",
      marketDetail.text
    );
    const roundDecimal = await getRounding(marketDetail.text);
    setSupplyAmount(toFixed(calculateMyWalletBalance, roundDecimal));
  };

  const Withdraw80percent = async function () {
    const withDrawAmount = await withdrawMaxLogic(
      "withdrawmax",
      marketDetail.text
    );

    const roundDecimal = await getRounding(marketDetail.text);
    setWithdrawAmount(toFixed(withDrawAmount, roundDecimal));
    setmaxWithdrawAmount(toFixed(withDrawAmount, roundDecimal));
  };

  useEffect(() => {
    setIsSupplyModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.userAddress]);

  const checkSupply = async function () {
    const calculateMyWalletBalance = await maxCalculationSupply(
      "maxCalculation",
      marketDetail.text
    );
    if (supplyAmount <= calculateMyWalletBalance && supplyAmount > 0) {
      Supply();
    }
  };

  const checkRedeem = async function () {
    const maxWithDrawAmount = await withdrawMaxLogic(
      "withdrawmax",
      marketDetail.text
    );
    if (withdrawAmount <= maxWithDrawAmount / 0.8 && withdrawAmount > 0) {
      RedeemToken();
    }
  };

  const ApproveToken = async function () {
    const [network] = await GetNetwork();
    const provider = await getProvider();

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

    try {
      let tx = await underlyingContract.approve(
        cTokenContractAddress,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      );

      await tx.wait(1);
    } catch (error) {
      console.log(error);
    }

    handleTokenEnabled();
  };

  const Supply = async function () {
    const [network] = await GetNetwork();
    const provider = await getProvider();
    const signer = provider.getSigner();
    const adressJson = require("networks/" + network + ".json");
    const cTokenAddress = adressJson["c" + marketDetail.text];
    const abiJson = require("networks/abi.json");
    const cTokenAbi = abiJson["c" + marketDetail.text + "Abi"];

    if (marketDetail.text === "ETH") {
      const cEthContract = new ethers.Contract(
        cTokenAddress,
        cTokenAbi,
        signer
      );
      let tx = await cEthContract.mint({
        value: ethers.utils.parseUnits(supplyAmount, "ether"),
      });
      await tx.wait(1);
    } else {
      const underlyingDecimals = await UnderlyingDecimals(
        marketDetail.text,
        signer
      );

      let underlyingTokensToSupply =
        supplyAmount * Math.pow(10, underlyingDecimals);
      underlyingTokensToSupply = toFixed(underlyingTokensToSupply, 0);

      const cTokenContract = new ethers.Contract(
        cTokenAddress,
        cTokenAbi,
        signer
      );

      try {
        const tx = await cTokenContract.mint(
          underlyingTokensToSupply.toString()
        );
        await tx.wait(1);
      } catch (error) {
        console.log("User rejected provider access");
      }
    }

    await HandleBalance();
    await handleWallets();
    await displayTokenSupplyWallet(marketDetail.text);
  };

  const RedeemToken = async function () {
    const [network] = await GetNetwork();
    const provider = await getProvider();
    const signer = provider.getSigner();

    const adressJson = require("networks/" + network + ".json");

    const cTokenAddress = adressJson["c" + marketDetail.text];

    const abiJson = require("networks/abi.json");

    const cTokenAbi = abiJson["c" + marketDetail.text + "Abi"];

    if (marketDetail.text === "ETH") {
      console.log(`${marketDetail.text} is market detail text `);
      const cEthContract = new ethers.Contract(
        cTokenAddress,
        cTokenAbi,
        signer
      );

      if (
        maxWithdrawAmountButton === withdrawAmount &&
        withdrawAlltokens === true
      ) {
        try {
          const ethDecimals = 18; // Ethereum has 18 decimal places
          let exchangeRateCurrent =
            await cEthContract.callStatic.exchangeRateCurrent();

          exchangeRateCurrent =
            exchangeRateCurrent / Math.pow(10, 18 + ethDecimals - 8);

          const withDrawAmountMax = await withdrawMaxLogic(
            "withdrawmax",
            marketDetail.text
          );

          const cTokenAmount = Math.ceil(
            (withDrawAmountMax / exchangeRateCurrent) * 1e8
          );

          const WithdrawMax = await cEthContract.redeem(cTokenAmount);

          await WithdrawMax.wait(1);
        } catch {}
      } else {
        try {
          const cEthContract = new ethers.Contract(
            cTokenAddress,
            cTokenAbi,
            signer
          );

          let tx = await cEthContract.redeemUnderlying(
            ethers.BigNumber.from(
              String(Math.floor(withdrawAmount * 1000000000000000000))
            )
          );

          await tx.wait(1);
        } catch (error) {
          alert("Transaction rejected");
        }
      }
    } else {
      const underlyingDecimals = await UnderlyingDecimals(
        marketDetail.text,
        signer
      );

      const cTokenContract = new ethers.Contract(
        cTokenAddress,
        cTokenAbi,
        signer
      );
      //

      if (
        maxWithdrawAmountButton === withdrawAmount &&
        withdrawAlltokens === true
      ) {
        const cTokenContract = new ethers.Contract(
          cTokenAddress,
          cTokenAbi,
          signer
        );

        const decimalcToken = await cTokenContract.callStatic.decimals();

        try {
          let exchangeRateCurrent =
            await cTokenContract.callStatic.exchangeRateCurrent();

          exchangeRateCurrent =
            exchangeRateCurrent / Math.pow(10, 18 + underlyingDecimals - 8);

          const withDrawAmountMax = await withdrawMaxLogic(
            "withdrawmax",
            marketDetail.text
          );

          const cTokenAmount = Math.ceil(
            (withDrawAmountMax / exchangeRateCurrent) * 10 ** decimalcToken
          );

          const WithdrawMax = await cTokenContract.redeem(cTokenAmount);

          await WithdrawMax.wait(1);
        } catch {
          console.log("Repay max transation failed");
        }
      } else {
        // redeem all erc20 max
        /* console.log(
        `Exchanging all c${assetName} based on underlying ${assetName} amount...`
      );*/
        let underlyingAmount = ethers.BigNumber.from(
          String(Math.floor(withdrawAmount * Math.pow(10, underlyingDecimals)))
        );
        try {
          const tx = await cTokenContract.redeemUnderlying(underlyingAmount);
          await tx.wait(1);
        } catch (error) {
          // wait until the transaction has 1 confirmation on the blockchain
          console.log("User rejected provider access");
        }
      }
      // Update total Balances.
      await HandleBalance();
      await handleWallets();
      await displayTokenSupplyWallet(marketDetail.text);

      await HandleBorrowLimit("withdraw");
    }
  };

  const getAdress = async function (assetName) {
    const [network] = await GetNetwork();

    const adressJson = require("networks/" + network + ".json");

    const address = adressJson[assetName];

    return address;
  };

  const handlehypotheticalDataWithdraw = async function (newWithdraw) {
    const cTokenAdress = await getAdress("c" + marketDetail.text);

    if ((await assetIsCollateral(cTokenAdress)) === true) {
      await hypotheticalBalanceLimit(
        newWithdraw,
        marketDetail.text,
        "withdraw",
        true
      );
    } else {
      HideByIDS([
        "withdrawLimit",
        "withdrawLimitArrow",
        "withdrawRatio",
        "withdrawRatioArrow",
      ]);
    }
  };

  const handlehypotheticalDataSupply = async function (newSupply) {
    const cTokenAdress = await getAdress("c" + marketDetail.text);

    if ((await assetIsCollateral(cTokenAdress)) === true) {
      await hypotheticalBalanceLimit(
        newSupply,
        marketDetail.text,
        "supply",
        true
      );
    } else {
      HideByIDS([
        "supplyLimit",
        "supplyLimitArrow",
        "supplyRatio",
        "supplyRatioArrow",
      ]);
    }
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
      visible={isSupplyModal}
      onCancel={() => {
        setIsSupplyModal(false);
        setSupplyAmount(0);
        setWithdrawAmount(0);
        clearHypoCalculation();
      }}
      maxWidth={500}
      footer={false}
      title={
        <div className="modalHeader flex justify-center items-center">
          <img
            src={marketDetail?.imaageUrl}
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
          <>
            <div className="modalInput flex flex-col justify-center items-center mb-5">
              {/* <img src={marketDetail?.imaageUrl} className='w-16 m-3' alt='' /> */}
              {!enabled && (
                <span className="text-semiMediumGray dark:text-white text-xs block text-center">
                  To Supply or Repay {marketDetail.text} to the Metalend
                  Protocol, you need to enable it first
                </span>
              )}
            </div>
            <div className="modalInput flex justify-center items-center mb-5">
              <Input
                className="w-4/5 text-center border-0 focus:outline-none text-darkGray"
                placeholder="0"
                value={supplyAmount}
                type="number"
                onChange={(e) => {
                  setSupplyAmount(e.target.value);
                  handlehypotheticalDataSupply(e.target.value);
                }}
                // onClick={handlehypotheticalDataSupply}
              />
              <span
                onClick={SupplyMax}
                className="text-semiMediumGray dark:text-white text-sm block text-center"
              >
                {/* 80% <span className="block">Limit</span> */}
                MAX
              </span>
              {/* <button onClick={displayTokenSupplyWallet(marketDetail.text)}>test</button> */}
            </div>
          </>
        ) : (
          <div className="modalInput flex justify-center items-center mb-5">
            <Input
              className="w-4/5 text-center border-0 focus:outline-none text-darkGray"
              placeholder="0"
              value={withdrawAmount}
              type="number"
              onChange={(e) => {
                setWithdrawAmount(e.target.value);
                handlehypotheticalDataWithdraw(e.target.value);
              }}
              onClick={(e) => {
                setmaxWithdrawAmount(e.target.value);
              }}
              // onClick={handlehypotheticalDataWithdraw}
            />
            <button
              onClick={(e) => {
                setmaxWithdrawAmount(Withdraw80percent);
              }}
            >
              <span
                onClick={Withdraw80percent}
                className="text-semiMediumGray dark:text-white text-sm block text-center"
              >
                80% <span className="block">Limit</span>
              </span>
            </button>
          </div>
        )}
        <Tabs
          defaultActiveKey="1"
          onChange={setCurrentTab}
          className="py-5 text-darkGray"
          centered
        >
          <Tabs.TabPane
            tab="Supply"
            key="1"
            className="text-xs md:text-sm text-darkGray"
          >
            <div className="flex justify-between items-center mb-5">
              {/* <Link
                to="/market"
                className="flex items-center text-xs text-darkGray hover:text-skyCus dark:text-white dark:hover:text-skyCus"
              >
                Supply Rates
                <FeatherIcon className="ml-2" icon="external-link" size={14} />
              </Link> */}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src="/assets/images/Meatalandicon.svg"
                  alt="Augur2"
                  className="md:w-10 w-5"
                />
                <div className=" ml-0 md:ml-4">
                  <h1 className="text-mediumGray dark:text-lightGray md:text-sm text-xs font-medium">
                    Supply APY
                  </h1>
                  <span className="text-darkGray dark:text-lightGray md:text-xl text-xs font-semibold">
                    {ApyRateModal(marketDetail.text, "supply")}
                  </span>
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
                  <span className="text-darkGray dark:text-lightGray md:text-xl text-xs font-semibold">
                    <div class="row">
                      <div
                        id="currentWithdrawBorrowLimit"
                        className="BorrowLimit"
                      >
                        {handleBorrowLimit()}{" "}
                      </div>
                      <div id="supplyLimitArrow" class="arrow">
                        <img src="/assets/images/arrow.svg" alt="arrow"></img>
                      </div>
                      <div id="supplyLimit"></div>
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
                      <div
                        id="currentWithdrawBorrowLimitRatio"
                        className="BorrowLimitRatio"
                      >
                        {handleBorrowRatio()}%{" "}
                      </div>

                      <div id="supplyRatioArrow" class="arrow">
                        <img src="/assets/images/arrow.svg" alt="arrow"></img>
                      </div>

                      <div id="supplyRatio"></div>
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

            {/*optional button untill other popup is available to test mint function SendTokenButton2*/}
            {/*
            <button
              onClick={ApproveTokenWithWalletConnect}
              type="button"
              style={{
                width: "80%",
                justifyContent: "center",
                alignItems: "center",
              }}
              className="block mx-auto mt-5 text-white dark:text-darkGray border-skyCus border-2 dark:bg-skyCus bg-skyCus px-5 py-2  mx-5 rounded-md text-xs md:text-sm justify-center justify-items-center justify-self-center items-center mt-5 "
            >
              ApproveTokenWithWalletConnect
            </button>*/}
            {enabled && (
              <button
                onClick={checkSupply}
                type="button"
                style={{
                  width: "80%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="block mx-auto mt-5 text-white dark:text-darkGray border-skyCus border-2 dark:bg-skyCus bg-skyCus px-5 py-2  mx-5 rounded-md text-xs md:text-sm justify-center justify-items-center justify-self-center items-center mt-5 "
              >
                Supply
              </button>
            )}

            <div className="text-mediumGray dark:text-lightGray md:text-sm text-left font-medium alignleft">
              Wallet Balance
            </div>

            <div
              id="WalletBalanceSupply"
              className="text-mediumGray dark:text-lightGray md:text-sm text-right font-medium alignright"
            >
              {handleDisplayTokenSuppliedBalance(
                marketDetail.text,
                "walletBalance"
              )}
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="WithDraw"
            key="2"
            className="text-xs md:text-sm text-darkGray"
          >
            <div className="flex justify-between items-center mb-5">
              {/* <Link
                to="/market"
                className="flex items-center text-xs text-darkGray hover:text-skyCus dark:text-white dark:hover:text-skyCus"
              >
                Supply Rates
                <FeatherIcon className="ml-2" icon="external-link" size={14} />
              </Link> */}
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
                    Supply APY
                  </h1>
                  <span className="text-darkGray dark:text-lightGray md:text-xl text-xs font-semibold">
                    {ApyRateModal(marketDetail.text, "supply")}
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
                  <span className="text-darkGray dark:text-lightGray md:text-xl text-xs font-semibold">
                    <div class="row">
                      <div
                        id="currentWithdrawBorrowLimit"
                        className="BorrowLimit"
                      >
                        {handleBorrowLimit()}{" "}
                      </div>
                      <div id="withdrawLimitArrow" class="arrow">
                        <img src="/assets/images/arrow.svg" alt="arrow"></img>
                      </div>
                      <div id="withdrawLimit"></div>
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
                    <div class="flexiblerow">
                      <div
                        id="currentWithdrawBorrowLimitRatio"
                        className="BorrowLimitRatio"
                      >
                        {handleBorrowRatio()}%{" "}
                      </div>

                      <div id="withdrawRatioArrow" class="arrow">
                        <img src="/assets/images/arrow.svg" alt="arrow"></img>
                      </div>

                      <div id="withdrawRatio"></div>
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
              onClick={checkRedeem}
              type="button"
              style={{
                width: "80%",
                justifyContent: "center",
                alignItems: "center",
              }}
              className=" text-white dark:text-darkGray border-skyCus border-2 dark:bg-skyCus bg-skyCus px-5 py-2  mx-5 rounded-md text-xs md:text-sm justify-center justify-items-center justify-self-center items-center mt-5 "
            >
              Withdraw
            </button>
            <div className="text-mediumGray dark:text-lightGray md:text-sm text-left font-medium alignleft">
              Currently Supplying
            </div>

            <div
              id="CurrentlySupplied"
              className="text-mediumGray dark:text-lightGray md:text-sm text-right font-medium alignright"
            >
              {handleDisplayTokenSuppliedBalance(
                marketDetail.text,
                "CurrentlySupplied"
              )}
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default SupplyMarletModal;
export { WalletBalanceDict };
