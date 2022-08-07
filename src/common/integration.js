import WalletConnectProvider from "@walletconnect/web3-provider";
const ethers = require("ethers");
var borrowRatedict = {};
var supplyRatedict = {};
var supplyValueUSDDict = {};
var borrowValueUSDDict = {};
var assetNameArray = [];
var marketsArray = [];
var WalletBalanceDict = { WBTC: 0, ETH: 0, USDC: 0, XSGD: 0, XIDR: 0, NZDS: 0 };
var cashDict = {};
var ActionVariable = [0];
let borrowBalance = 0;
var supplyBalance = 0;
var borrowRatio = [0];
var supportNetwork;
var network;

var ApyGlobalData = [];
var Originalliquidity;
var hypotheticalAccount = [];
var providerName = [];
var userAddress;
var supplyRatedictNumber = {};
var borrowRatedictNumber = {};
var supplyTokenAmountDict = {
  WBTC: 0,
  ETH: 0,
  USDC: 0,
  XSGD: 0,
  XIDR: 0,
  NZDS: 0,
};
var borrowTokenAmounTDict = {
  WBTC: 0,
  ETH: 0,
  USDC: 0,
  XSGD: 0,
  XIDR: 0,
  NZDS: 0,
};
var withdrawAlltokens;
var maxRepayData = [false, 0];

export const markets = async function () {
  [network, supportNetwork] = await GetNetwork();
  if (offline === false) {
    if (supportNetwork === true) {
      // Hardcoding or importing assetnames can be done and the code still works fine
      assetNameArray = ["WBTC", "ETH", "USDC", "XSGD", "XIDR", "NZDS"];

      var jsonObject = require("networks/" + network + ".json");

      let cTokenArray = [];

      for (let i = 0; i <= assetNameArray.length; i++) {
        cTokenArray[i] = "c" + assetNameArray[i];
      }

      for (let i = 0; i < cTokenArray.length - 1; i++) {
        marketsArray[i] = jsonObject[cTokenArray[i]];
      }

      const markets = [assetNameArray, cTokenArray, marketsArray];
      return markets;
    }
  }
};

export function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

export function toFixed(num, fixed) {
  function toFixedFull(x) {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split("e-")[1]);
      if (e) {
        x *= Math.pow(10, e - 1);
        x = "0." + new Array(e).join("0") + x.toString().substring(2);
      }
    } else {
      e = parseInt(x.toString().split("+")[1]);
      if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += new Array(e + 1).join("0");
      }
    }
    return x;
  }
  function toFixes(num, fixed) {
    var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
    return num.toString().match(re)[0];
  }

  function round(num, fixed) {
    if (num == null) {
      return " ";
    } else if (num === undefined) {
      return " ";
    } else if (num === "0") {
      return "0";
    } else if (num === 0) {
      return "0";
    } else {
      let numberString = toFixedFull(num);

      return toFixes(numberString, fixed);
    }
  }
  return round(num, fixed);
}

export async function TokenNameFromAdress(adress) {
  if (offline === false) {
    [network, supportNetwork] = await GetNetwork();
    if (supportNetwork === true) {
      var jsonObject = await require("networks/" + network + ".json");

      const TokenName = getKeyByValue(jsonObject, adress);
      return TokenName;
    }
  }
}
export async function AbiFromAdress(adress) {
  if (offline === false) {
    if (supportNetwork === true) {
      const TokenName = await TokenNameFromAdress(adress);

      var jsonAbi = require("networks/abi.json");

      let TokenNameAbi = TokenName + "Abi";

      return jsonAbi[TokenNameAbi];
    }
  }
}
export const Balance = async function () {
  if (offline === false) {
    [network, supportNetwork] = await GetNetwork();
    if (supportNetwork === true) {
      const provider = await getProvider();

      const signer = provider.getSigner();

      const myWalletAddress = await signer.getAddress();

      const { priceFeedAbi } = require("networks/abi.json");

      const { PriceFeed } = require("networks/" + network + ".json");

      // Hardcoding or importing assetnames can be done and the code still works fine
      assetNameArray = ["WBTC", "ETH", "USDC", "XSGD", "XIDR", "NZDS"];

      let cTokenArray = [];

      for (var i = 0; i <= assetNameArray.length; i++) {
        cTokenArray[i] = "c" + assetNameArray[i];
      }

      var jsonObject = require("networks/" + network + ".json");

      for (let i = 0; i < cTokenArray.length - 1; i++) {
        marketsArray[i] = jsonObject[cTokenArray[i]];
      }

      const priceFeed = new ethers.Contract(PriceFeed, priceFeedAbi, signer);

      let totalAmountSupply = 0;
      let totalAmountBorrow = 0;
      let totalBorrowsMarketUSD = 0;
      let totalSupplyMarketUSD = 0;

      for (let i = 0; i < marketsArray.length; i++) {
        let cTokenName = await TokenNameFromAdress(marketsArray[i]);

        const assetName = cTokenName.substring(1);

        const assetAdress = jsonObject[assetName];

        let cTokenAbi = await AbiFromAdress(marketsArray[i]);

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
            assetAdress,
            tokenAbi,
            signer
          );

          underlyingDecimals =
            await underlyingtokenContract.callStatic.decimals();
        }

        let cToken = new ethers.Contract(marketsArray[i], cTokenAbi, signer);

        const exchangeRateCurrent =
          await cToken.callStatic.exchangeRateCurrent();

        let underlyingBorrowsMarket =
          await cToken.callStatic.totalBorrowsCurrent();

        let totalSupplyMarketcTokens = await cToken.callStatic.totalSupply();

        const ethMantissa = 1e18;

        const blocksPerDay = 4 * 60 * 24;
        const daysPerYear = 365;

        let borrowRatePerBlock = await cToken.callStatic.borrowRatePerBlock();

        let supplyRatePerBlock = await cToken.callStatic.supplyRatePerBlock();

        const supplyApy =
          (Math.pow(
            (supplyRatePerBlock / ethMantissa) * blocksPerDay + 1,
            daysPerYear
          ) -
            1) *
          100;
        const borrowApy =
          (Math.pow(
            (borrowRatePerBlock / ethMantissa) * blocksPerDay + 1,
            daysPerYear
          ) -
            1) *
          100;

        supplyRatedict[assetName] = toFixed(supplyApy, 2);
        borrowRatedict[assetName] = toFixed(borrowApy, 2);
        supplyRatedictNumber[assetName] = supplyApy;
        borrowRatedictNumber[assetName] = borrowApy;

        const tokens = await cToken.callStatic.balanceOfUnderlying(
          myWalletAddress
        );

        const borrowtokens = await cToken.callStatic.borrowBalanceCurrent(
          myWalletAddress
        );

        let underlyingPriceInUsd =
          await priceFeed.callStatic.getUnderlyingPrice(marketsArray[i]);
        const divider = 36 - underlyingDecimals;

        underlyingPriceInUsd = underlyingPriceInUsd / 10 ** divider;

        const borrowTokenAmount =
          borrowtokens / Math.pow(10, underlyingDecimals);

        const tokenAmount = tokens / Math.pow(10, underlyingDecimals);

        supplyTokenAmountDict[assetName] = tokenAmount;
        borrowTokenAmounTDict[assetName] = borrowTokenAmount;

        underlyingBorrowsMarket =
          underlyingBorrowsMarket / Math.pow(10, underlyingDecimals);

        const cTokenDecimals = 8;

        const underlyingSupplyMarket =
          (totalSupplyMarketcTokens / Math.pow(10, 18 - cTokenDecimals)) *
          (exchangeRateCurrent /
            Math.pow(10, cTokenDecimals + underlyingDecimals));

        const tokenAmountInUSD = tokenAmount * underlyingPriceInUsd;

        const borrowTokenAmountInUSD = borrowTokenAmount * underlyingPriceInUsd;

        totalAmountSupply = totalAmountSupply + tokenAmountInUSD;
        totalAmountBorrow = totalAmountBorrow + borrowTokenAmountInUSD;

        const underlyingBorrowsMarketUSD =
          underlyingBorrowsMarket * underlyingPriceInUsd;
        const underlyingSupplyMarketUSD =
          underlyingSupplyMarket * underlyingPriceInUsd;
        totalBorrowsMarketUSD =
          totalBorrowsMarketUSD + underlyingBorrowsMarketUSD;

        totalSupplyMarketUSD = totalSupplyMarketUSD + underlyingSupplyMarketUSD;
        supplyValueUSDDict[assetName] = tokenAmountInUSD;

        borrowValueUSDDict[assetName] = borrowTokenAmountInUSD;
      }
      let tvl = totalSupplyMarketUSD - totalBorrowsMarketUSD;

      supplyBalance = totalAmountSupply;
      borrowBalance = totalAmountBorrow;

      const totalBalance = [
        supplyBalance,
        borrowBalance,
        totalAmountSupply,
        totalAmountBorrow,
        tvl,
        supplyRatedict,
        borrowRatedict,
      ];
      return totalBalance;
    }
  }
};

var fetchedNetwork = false;
var chainId;
var chainIdNumber;

export const GetNetwork = async (use) => {
  if (chainId === undefined || use === "connectbutton") {
    const provider = await getProvider();

    if (providerName[0] === "Metamask") {
      chainId = await window.ethereum.request({ method: "eth_chainId" });
    } else if (providerName[0] === "Wallet Connect") {
      if (fetchedNetwork === false || use === "connectbutton") {
        try {
          const { chainId } = await provider.getNetwork();
          chainIdNumber = chainId;
          fetchedNetwork = true;
        } catch {
          console.log("error failing to fetch chainID from wallet connect ");
        } finally {
          chainId = "0x" + chainIdNumber;
        }
      }
    }
  }

  if (chainId === "0x1") {
    network = "EtheureumMainnet";

    supportNetwork = true;
  } else if (chainId === "0x4") {
    network = "Rinkeby";

    supportNetwork = true;
  } else {
    supportNetwork = false;
  }

  return [network, supportNetwork];
};

export const getApprovedTokenArray = async function () {
  if (offline === false) {
    var approvedArray = [false, true, false, false, false];
    const { erc20Abi } = require("networks/abi.json");

    const [network, supportNetwork] = await GetNetwork();
    if (supportNetwork) {
      const { SupportedAssets, Markets } = require("networks/" +
        network +
        ".json");
      const provider = await getProvider();
      const signer = provider.getSigner();
      const myWalletAddress = await signer.getAddress();
      for (let i = 0; i < SupportedAssets.length; i++) {
        if (SupportedAssets[i] !== "ETH") {
          const contract = new ethers.Contract(
            SupportedAssets[i],
            erc20Abi,
            provider
          );
          let underlyingDecimals = await contract.decimals();
          let allowance =
            (await contract.allowance(myWalletAddress, Markets[i])) /
            Math.pow(10, underlyingDecimals);
          if (allowance > 0) {
            approvedArray[i] = true;
          }
        }
      }
      return approvedArray;
    }
  }
};

export const UnderlyingDecimals = async function (assetName, signer) {
  if (offline === false) {
    [network, supportNetwork] = await GetNetwork();
    if (supportNetwork === true) {
      var ethers = require("ethers");
      // fetching adresses from json
      var jsonObject = require("networks/" + network + ".json");
      // fetching underlying decimals
      let underlyingDecimals = 0;
      if (assetName === "ETH") {
        underlyingDecimals = 18;
      } else {
        const assetAdress = jsonObject[assetName];

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
          assetAdress,
          tokenAbi,
          signer
        );

        underlyingDecimals =
          await underlyingtokenContract.callStatic.decimals();
      }

      return underlyingDecimals;
    }
  }
};

export const getTokenSupplyBalanceArray = async (setter) => {
  if (offline === false) {
    [network, supportNetwork] = await GetNetwork();
    if (supportNetwork === true) {
      var balanceArray = [];
      if (network !== false) {
        const ethers = require("ethers");
        const provider = await getProvider();

        const signer = provider.getSigner();
        const myWalletAddress = await signer.getAddress();

        var cTokenArray = ["cWBTC", "cETH", "cUSDC", "cXSGD", "cXIDR", "cNZDS"];
        const cTokenAbi = [
          {
            constant: false,
            inputs: [
              { internalType: "address", name: "owner", type: "address" },
            ],
            name: "balanceOfUnderlying",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: false,
            inputs: [
              { internalType: "address", name: "account", type: "address" },
            ],
            name: "borrowBalanceCurrent",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            payable: false,
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            constant: true,
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
            ],
            name: "balanceOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
        ];
        var jsonObject = require("networks/" + network + ".json");
        //TODO: change to promise.all
        for (var i = 0; i < cTokenArray.length; i++) {
          marketsArray[i] = jsonObject[cTokenArray[i]];
          let cToken = new ethers.Contract(marketsArray[i], cTokenAbi, signer);
          let amount =
            (await cToken.callStatic.balanceOfUnderlying(myWalletAddress)) /
            Math.pow(10, 8);

          balanceArray[i] = amount;
        }

        setter(balanceArray);
        return balanceArray;
      }
    }
  }
};

export const getTokenBorrowBalanceArray = async (setter) => {
  if (offline === false) {
    var balanceArray = ([][(network, supportNetwork)] = await GetNetwork());

    if (supportNetwork === true) {
      const ethers = require("ethers");

      const provider = await getProvider();

      const signer = provider.getSigner();

      const myWalletAddress = await signer.getAddress();

      var cTokenArray = ["cWBTC", "cETH", "cUSDC", "cXSGD", "cXIDR", "cNZDS"];
      const cTokenAbi = [
        {
          constant: false,
          inputs: [{ internalType: "address", name: "owner", type: "address" }],
          name: "balanceOfUnderlying",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            { internalType: "address", name: "account", type: "address" },
          ],
          name: "borrowBalanceCurrent",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
      ];
      var jsonObject = require("networks/" + network + ".json");

      for (var i = 0; i < cTokenArray.length; i++) {
        marketsArray[i] = jsonObject[cTokenArray[i]];
        let cToken = new ethers.Contract(marketsArray[i], cTokenAbi, signer);
        let amount =
          (await cToken.callStatic.borrowBalanceCurrent(myWalletAddress)) /
          Math.pow(10, 8);

        balanceArray[i] = amount;
      }

      setter(balanceArray);
      return balanceArray;
    }
  }
};

export const withdrawMaxLogic = async function (use, assetName) {
  if (offline === false) {
    [network, supportNetwork] = await GetNetwork();
    if (supportNetwork === true) {
      var ethers = require("ethers");

      const provider = await getProvider();
      const signer = provider.getSigner();
      const myWalletAddress = await signer.getAddress();

      const adressJson = require("networks/" + network + ".json");

      const cTokenAdress = adressJson["c" + assetName];

      const cTokenAbi = [
        {
          constant: false,
          inputs: [{ internalType: "address", name: "owner", type: "address" }],
          name: "balanceOfUnderlying",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            { internalType: "address", name: "account", type: "address" },
          ],
          name: "borrowBalanceCurrent",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
      ];

      let cToken = new ethers.Contract(cTokenAdress, cTokenAbi, signer);

      const underlyingDecimals = await UnderlyingDecimals(assetName, signer);

      const tokens =
        (await cToken.callStatic.balanceOfUnderlying(myWalletAddress)) /
        Math.pow(10, underlyingDecimals);

      const { Comptroller, PriceFeed } = require("networks/" +
        network +
        ".json");

      const { comptrollerAbi, priceFeedAbi } = require("networks/abi.json");

      const comptroller = new ethers.Contract(
        Comptroller,
        comptrollerAbi,
        signer
      );

      let totalBorrowBalance = 0;
      const priceFeed = new ethers.Contract(PriceFeed, priceFeedAbi, signer);

      let underlyingPriceInUsd = await priceFeed.callStatic.getUnderlyingPrice(
        cTokenAdress
      );
      const divider = 36 - underlyingDecimals;

      underlyingPriceInUsd = underlyingPriceInUsd / 10 ** divider;

      let { 1: collateralFactor } = await comptroller.callStatic.markets(
        cTokenAdress
      );

      const tokenCollateralfactor = collateralFactor / 1e18;

      const enteredMarkets = await comptroller.callStatic.getAssetsIn(
        myWalletAddress
      );

      var adresJson = require("networks/" + network + ".json");

      let allEnteredMarketsSupply = 0;
      let maxBorrowLimit = 0;

      for (let i = 0; i < enteredMarkets.length; i++) {
        const cTokenName = getKeyByValue(adresJson, enteredMarkets[i]);

        const tokenname = cTokenName.substring(1);
        const assetName = tokenname;

        cToken = new ethers.Contract(enteredMarkets[i], cTokenAbi, signer);

        const underlyingDecimals = await UnderlyingDecimals(assetName, signer);

        const tokensSupplied =
          (await cToken.callStatic.balanceOfUnderlying(myWalletAddress)) /
          Math.pow(10, underlyingDecimals);

        const tokensBorrowed =
          (await cToken.callStatic.borrowBalanceCurrent(myWalletAddress)) /
          Math.pow(10, underlyingDecimals);

        let underlyingPriceInUsd =
          await priceFeed.callStatic.getUnderlyingPrice(enteredMarkets[i]);
        const divider = 36 - underlyingDecimals;

        underlyingPriceInUsd = underlyingPriceInUsd / 10 ** divider;

        const tokensBorrowedInUSD = tokensBorrowed * underlyingPriceInUsd;
        const tokenSuppliedInUSD = tokensSupplied * underlyingPriceInUsd;

        let { 1: collateralFactor } = await comptroller.callStatic.markets(
          enteredMarkets[i]
        );

        const localCollateralFactor = collateralFactor / 1e18;

        totalBorrowBalance = totalBorrowBalance + tokensBorrowedInUSD;
        allEnteredMarketsSupply = allEnteredMarketsSupply + tokenSuppliedInUSD;
        maxBorrowLimit =
          maxBorrowLimit + tokenSuppliedInUSD * localCollateralFactor;
      }
      const ratio = (totalBorrowBalance / maxBorrowLimit) * 100;

      if (use === "ratio") {
        return ratio;
      } else {
        let withdrawableTokenValue = 0;

        let exitMarket = false;
        let borrowMax = false;
        withdrawAlltokens = false;
        const tokenBalance = tokens * underlyingPriceInUsd;

        if (
          totalBorrowBalance <=
          0.8 * (maxBorrowLimit - tokenBalance * tokenCollateralfactor)
        ) {
          withdrawableTokenValue = tokens;

          exitMarket = true;
          borrowMax = true;
        } else {
          const withdrawableTokenValueCalculation =
            (maxBorrowLimit - totalBorrowBalance / 0.8) / tokenCollateralfactor;

          if (withdrawableTokenValueCalculation > 0) {
            withdrawableTokenValue =
              withdrawableTokenValueCalculation / underlyingPriceInUsd;
          } else {
            withdrawAlltokens = true;

            withdrawableTokenValue = tokens;
          }
        }

        if (use === "withdrawmax") {
          return withdrawableTokenValue;
        } else if (use === "borrowmax") {
          if (borrowMax === true) {
            return true;
          } else {
            return false;
          }
        } else if (use === "exit") {
          if (exitMarket === true) {
            let exitMarkets = await comptroller.exitMarket(cTokenAdress);
            exitMarkets.wait(1);
          } else {
            console.log("Can't exit market");
          }
        }
      }
    }
  }
};
var DATATEST;
var Balances;
export const HandleBalance = async function () {
  if (offline === false) {
    (async () => {
      Balances = await Balance();

      document.getElementById("SupplyBalance").innerHTML =
        "$" + toFixed(Balances[0], 3);
      document.getElementById("BorrowBalance").innerHTML =
        "$" + toFixed(Balances[1], 3);
      document.getElementById("TVL").innerHTML = "$" + toFixed(Balances[4], 3);
      await displayNetApy();
    })();
  }
};

export const HandleBorrowLimit = async function (use) {
  const borrowlimit = await handleBorrowLimitSetupVariable();
  if (use === "withdraw") {
    document.getElementById("currentWithdrawBorrowLimitRatio").innerHTML =
      toFixed(borrowlimit[0], 2) + "%";
    document.getElementById("currentWithdrawBorrowLimit").innerHTML =
      "$" + toFixed(borrowlimit[1], 3);
  } else if (use === "borrow") {
    document.getElementById("currentBorrowLimitRatio").innerHTML =
      toFixed(borrowlimit[0], 2) + "%";
    document.getElementById("currentBorrowLimit").innerHTML =
      "$" + toFixed(borrowlimit[1], 3);
  } else if (use === "repay") {
    document.getElementById("currentRepayBorrowLimitRatio").innerHTML =
      toFixed(borrowlimit[0], 2) + "%";
    document.getElementById("currentRepayBorrowLimit").innerHTML =
      "$" + toFixed(borrowlimit[1], 3);
  } else if (use === "borrowMarket") {
    document.getElementById("currentBorrowLimitRatio").innerHTML =
      toFixed(borrowlimit[0], 2) + "%";
    document.getElementById("currentBorrowLimit").innerHTML =
      "$" + toFixed(borrowlimit[1], 3);
    document.getElementById("currentRepayBorrowLimitRatio").innerHTML =
      toFixed(borrowlimit[0], 2) + "%";
    document.getElementById("currentRepayBorrowLimit").innerHTML =
      "$" + toFixed(borrowlimit[1], 3);
  }
};

export const maxCalculationSupply = async function (use, assetNameMarket) {
  if (offline === false) {
    [network, supportNetwork] = await GetNetwork();
    if (supportNetwork === true) {
      let count = 0;
      let myWalletUnderlyingBalance;
      if (use === "maxCalculation") {
        count = 1;
      } else if (use === "onload") {
        count = assetNameArray.length;
      }

      const provider = await getProvider();

      var jsonObject = require("networks/" + network + ".json");
      const { erc20Abi } = require("networks/abi.json");
      const signer = provider.getSigner();
      const myWalletAddress = signer.getAddress();
      for (let i = 0; i < count; i++) {
        let assetName = "";

        if (use === "onload") {
          assetName = assetNameArray[i];
        } else if (use === "maxCalculation") {
          assetName = assetNameMarket;
        }

        let underlyingDecimals = await UnderlyingDecimals(assetName, signer);

        if (assetName === "ETH") {
          let myWalletEthBalance = toFixed(
            (await provider.getBalance(myWalletAddress)) / 1e18,
            3
          );

          myWalletUnderlyingBalance = myWalletEthBalance;
          WalletBalanceDict[assetName] = myWalletUnderlyingBalance;
        } else {
          const underlyingAddress = jsonObject[assetName];

          const underlying = new ethers.Contract(
            underlyingAddress,
            erc20Abi,
            signer
          );

          myWalletUnderlyingBalance = toFixed(
            (await underlying.callStatic.balanceOf(myWalletAddress)) /
              Math.pow(10, underlyingDecimals),
            3
          );
          WalletBalanceDict[assetName] = myWalletUnderlyingBalance;
        }
      }
      if (use === "maxCalculation") {
        // setting supply amount to the maximum
        return myWalletUnderlyingBalance;
      } else if (use === "onload") {
        return [WalletBalanceDict, Object.keys(WalletBalanceDict).length];
      }
    }
  }
};

export const getAccountAdress = async function () {
  while (enableProvider === undefined) {
    if (providerName[0] === "Wallet Connect" && enableProvider !== undefined) {
      return enableProvider;
    }
  }
};

var enableProvider;

export const getProviderConnected = async function (use) {
  if (offline === false) {
    var connectedWallet = false;

    try {
      const providerMetamask = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const accounts = await providerMetamask.send("eth_requestAccounts", []);

      connectedWallet = true;
      if (use === "getProvider") {
        providerName[0] = "Metamask";
        return providerMetamask;
      }
      if (use === "checkConnection") {
        providerName[0] = "Metamask";
        return accounts[0];
      }
    } catch {
      console.log("metamask is not connected");
    } finally {
      const providerWalletConnect = await walletConnectRPCProvider("Alchemy");

      const walletConnectProvider = new ethers.providers.Web3Provider(
        providerWalletConnect
      );
      if (connectedWallet === false) {
        try {
          enableProvider = await providerWalletConnect.enable();
          providerName[0] = "Wallet Connect";
          if (use === "checkConnection") {
            providerName[0] = "Wallet Connect";
            userAddress = enableProvider;
            return userAddress;
          }

          if (use === "getProvider") {
            providerName[0] = "Wallet Connect";

            return walletConnectProvider;
          }
        } catch {
          console.log("wallet connect is not connected");
        }
      }
    }
  }
};

function nFormatter(num, digits) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
}

const tests = [
  { num: 0, digits: 1 },
  { num: 12, digits: 1 },
  { num: 1234, digits: 1 },
  { num: 100000000, digits: 1 },
  { num: 299792458, digits: 1 },
  { num: 759878, digits: 1 },
  { num: 759878, digits: 0 },
  { num: 123, digits: 1 },
  { num: 123.456, digits: 1 },
  { num: 123.456, digits: 2 },
  { num: 123.456, digits: 4 },
];
tests.forEach(function (test) {});
var userAdress;
export const getMarketLiquidity = async function () {
  if (offline === false) {
    [network, supportNetwork] = await GetNetwork();
    if (supportNetwork === true) {
      var underlyingBalance;
      const provider = await getProvider();

      var jsonObject = require("networks/" + network + ".json");

      const jsonObjectabi = require("networks/abi.json");

      const signer = provider.getSigner();

      const { PriceFeed } = require("networks/" + network + ".json");
      const { priceFeedAbi } = require("networks/abi.json");
      const priceFeed = new ethers.Contract(PriceFeed, priceFeedAbi, signer);
      let assetName = "";
      for (let i = 0; i < assetNameArray.length; i++) {
        assetName = assetNameArray[i];

        let underlyingDecimals = await UnderlyingDecimals(assetName, signer);

        const CTokenAddress = jsonObject["c" + assetName];

        const cTokenAbi = jsonObjectabi["c" + assetName + "Abi"];
        const cToken = new ethers.Contract(CTokenAddress, cTokenAbi, signer);

        underlyingBalance =
          (await cToken.callStatic.getCash()) /
          Math.pow(10, underlyingDecimals);

        let underlyingPriceInUsd =
          await priceFeed.callStatic.getUnderlyingPrice(CTokenAddress);

        let divider = 36 - underlyingDecimals;

        let PriceInUsd = underlyingPriceInUsd / 10 ** divider;

        let underlyingPriceInUSD = underlyingBalance * PriceInUsd;

        const underlyingBalanceInUSD = nFormatter(underlyingPriceInUSD, 2);

        cashDict[assetName] = underlyingBalanceInUSD;
      }

      return [cashDict, Object.keys(cashDict).length];
    }
  }
};

export function toFixedTest(num, fixed) {
  if (offline === false) {
    const eIndex = num.toString().search("e");
    if (eIndex !== -1) {
      if (
        num.toString().charAt(eIndex + 1) === "-" &&
        parseInt(num.toString().charAt(eIndex + 2)) > 2
      ) {
        return "0";
      } else if (
        num.toString().charAt(eIndex + 1) === "-" &&
        parseInt(num.toString().charAt(eIndex + 3)) >= 0
      ) {
        return "0";
      }
    } else {
      var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
      return num.toString().match(re)[0];
    }
  }
}
export async function Rates(use) {
  if (offline === false) {
    [network, supportNetwork] = await GetNetwork();
    if (supportNetwork === true) {
      let borrowRatedictionary = {};

      let supplyRatedictionary = {};

      const [assetNameArray, , marketsArray] = await markets();
      const provider = await getProvider();

      const signer = provider.getSigner();

      const jsonAbi = require("networks/abi.json");
      const ethMantissa = 1e18;
      // based on 4 blocks occurring every minute
      const blocksPerDay = 4 * 60 * 24;
      const daysPerYear = 365;
      for (let i = 0; i < marketsArray.length; i++) {
        let assetName = assetNameArray[i];
        let cTokenAbi = jsonAbi["c" + assetName + "Abi"];
        let cToken = new ethers.Contract(marketsArray[i], cTokenAbi, signer);
        if (use === "borrowRates") {
          let borrowRatePerBlock = await cToken.callStatic.borrowRatePerBlock();
          const borrowApy =
            (Math.pow(
              (borrowRatePerBlock / ethMantissa) * blocksPerDay + 1,
              daysPerYear
            ) -
              1) *
            100;
          borrowRatedictionary[assetName] = borrowApy;
        } else if (use === "supplyRates") {
          let supplyRatePerBlock = await cToken.callStatic.supplyRatePerBlock();

          const borrowApy =
            (Math.pow(
              (supplyRatePerBlock / ethMantissa) * blocksPerDay + 1,
              daysPerYear
            ) -
              1) *
            100;
          supplyRatedictionary[assetName] = borrowApy;
        }
      }
      if (use === "borrowRates") {
        return borrowRatedictionary;
      } else if (use === "supplyRates") {
        return supplyRatedictionary;
      }
    }
  }
}
export const maxCalculationBorrow = async function (assetName, use) {
  if (offline === false) {
    [network, supportNetwork] = await GetNetwork();
    if (supportNetwork === true) {
      const ethers = require("ethers");
      const provider = await getProvider();

      const { comptrollerAbi, priceFeedAbi } = require("networks/abi.json");

      const { Comptroller, PriceFeed } = require("networks/" +
        network +
        ".json");

      const signer = provider.getSigner();
      const wallet = signer;
      const myWalletAddress = signer.getAddress();

      const comptrollerAddress = Comptroller;

      const comptroller = new ethers.Contract(
        comptrollerAddress,
        comptrollerAbi,
        wallet
      );

      const priceFeedAddress = PriceFeed;
      const priceFeed = new ethers.Contract(
        priceFeedAddress,
        priceFeedAbi,
        wallet
      );

      if (assetName === undefined) {
        assetName = "WBTC";
      }
      if (use === "borrowLimit") {
        assetName = "WBTC";
      }

      let { 1: liquidity } = await comptroller.callStatic.getAccountLiquidity(
        myWalletAddress
      );
      liquidity = liquidity / 1e18;
      Originalliquidity = liquidity;
      const addressJson = require("networks/" + network + ".json");

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

      let underlyingDecimals = 0;
      if (assetName === "ETH") {
        underlyingDecimals = 18;
      } else {
        let underlyingtokenContract = new ethers.Contract(
          addressJson[assetName],
          tokenAbi,
          signer
        );

        underlyingDecimals =
          await underlyingtokenContract.callStatic.decimals();
      }

      let underlyingPriceInUsd = await priceFeed.callStatic.getUnderlyingPrice(
        addressJson["c" + assetName]
      );
      const divider = 36 - underlyingDecimals;

      underlyingPriceInUsd = underlyingPriceInUsd / 10 ** divider;

      if (use === "borrowLimit") {
        return [liquidity];
      } else {
        const maxBorrowLimit = liquidity / underlyingPriceInUsd;

        const BorrowLimit = 0.8 * maxBorrowLimit;

        return BorrowLimit;
      }
    }
  }
};

export const handleBorrowLimitSetupVariable = async function () {
  if (offline === false) {
    const [, supportNetwork] = await GetNetwork();
    if (supportNetwork === true) {
      let borrow = await maxCalculationBorrow("", "borrowLimit");
      const borrowlimit = borrow[0];

      ActionVariable[0] = borrowlimit;
      const borrowratio = await withdrawMaxLogic("ratio", "WBTC");
      borrowRatio[0] = borrowratio;

      return [borrowratio, borrowlimit];
    }
  }
};

export const getRounding = async function (asset) {
  let roundDecimals;
  if (asset === "ETH") {
    roundDecimals = 8;
  } else {
    roundDecimals = 6;
  }
  return roundDecimals;
};

export function handleBorrowLimit(trigger) {
  if (offline === false) {
    if (supportNetwork === true) {
      const borrowLimit = nFormatter(ActionVariable[0], 2);
      return "$" + borrowLimit;
    }
    if (trigger === "payableFunctions") {
      document.getElementsByClassName("BorrowLimit").innerHTML =
        "$" + toFixed(ActionVariable[0], 3);
    }
  }
}
export function handleBorrowRatio(trigger) {
  if (offline === false) {
    if (supportNetwork === true) {
      if (isNaN(borrowRatio[0])) {
        return 0;
      } else if (toFixed(borrowRatio[0], 2) === "99.99") {
        return 100.0;
      } else {
        return toFixed(borrowRatio[0], 2);
      }
    }
    if (trigger === "payableFunctions") {
      document.getElementsByClassName("BorrowLimitRatio").innerHTML =
        toFixed(borrowRatio[0], 2) + "%";
    }
  }
}

function HideByID(id) {
  var x = document.getElementById(id);
  if (x) {
    x.style.display = "none";
  }
}

export function HideByIDS(ids) {
  for (var i = 0; i < ids.length; i++) {
    HideByID(ids[i]);
  }
}

export function ShowByIDS(ids) {
  for (var i = 0; i < ids.length; i++) {
    ShowByID(ids[i]);
  }
}
function ShowByID(id) {
  var x = document.getElementById(id);
  x.style.display = "block";
}

export function ShowAllLoader() {
  ShowByID("SupplyBalance");
}

export function ApyRateModal(marketName, use) {
  if (use === "supply") {
    const apy = String(supplyRatedict[marketName]);
    return apy + "%";
  } else if (use === "borrow") {
    const apy = String(borrowRatedict[marketName]);
    return apy + "%";
  } else if (use === "distribution") {
    const apy = "-";
    return apy + "%";
  } else return "error";
}

export const assetIsCollateral = async function (cTokenAdress) {
  const provider = await getProvider();

  const { comptrollerAbi } = require("networks/abi.json");

  const { Comptroller } = require("networks/" + network + ".json");

  const signer = provider.getSigner();
  const myWalletAddress = signer.getAddress();

  const comptrollerAddress = Comptroller;

  const comptroller = new ethers.Contract(
    comptrollerAddress,
    comptrollerAbi,
    signer
  );
  const assetsInArray = await comptroller.callStatic.getAssetsIn(
    myWalletAddress
  );

  for (let i = 0; i < assetsInArray.length; i++) {
    if (assetsInArray[i] === cTokenAdress) {
      return true;
    }
  }
};

export const hypotheticalBalanceLimit = async function (
  modalValueString,
  assetName,
  use,
  display
) {
  if (offline === false) {
    [network, supportNetwork] = await GetNetwork();
    if (supportNetwork === true) {
      let modalValue = parseFloat(modalValueString);
      const provider = await getProvider();

      const signer = provider.getSigner();

      let accountAdress;
      if (providerName[0] === "Metamask") {
        const account = await provider.send("eth_requestAccounts", []);
        accountAdress = account[0];
      }
      if (providerName[0] === "Wallet Connect") {
        const providerWalletConnect = await walletConnectRPCProvider("Alchemy");

        const accounts = await providerWalletConnect.enable();
        accountAdress = accounts[0];
      }

      const wallet = signer;

      const { Comptroller, PriceFeed } = require("networks/" +
        network +
        ".json");

      const { comptrollerAbi, priceFeedAbi } = require("networks/abi.json");

      const priceFeedAddress = PriceFeed;
      const priceFeed = new ethers.Contract(
        priceFeedAddress,
        priceFeedAbi,
        wallet
      );
      const addressJson = require("networks/" + network + ".json");
      const abiAdressesJson = require("networks/abi.json");
      const cTokenAddress = addressJson["c" + assetName];
      const cTokanAbi = abiAdressesJson["c" + assetName + "Abi"];

      const cToken = new ethers.Contract(cTokenAddress, cTokanAbi, wallet);

      let underlyingDecimals = await UnderlyingDecimals(assetName, signer);

      let underlyingPriceInUsd = await priceFeed.callStatic.getUnderlyingPrice(
        cTokenAddress
      );

      let divider = 36 - underlyingDecimals;

      let PriceInUsd = underlyingPriceInUsd / 10 ** divider;

      let underlyingModalValueUSD = modalValue * PriceInUsd;

      let hypotheticalTotalBorrowBalance = borrowBalance;
      let BorrowBalance = borrowBalance;

      if (use === "repay") {
        const tokensBorrowed =
          (await cToken.callStatic.borrowBalanceCurrent(accountAdress)) /
          Math.pow(10, underlyingDecimals);

        var maxrepayValueUSD = tokensBorrowed * PriceInUsd;

        if (underlyingModalValueUSD <= maxrepayValueUSD) {
          hypotheticalTotalBorrowBalance =
            hypotheticalTotalBorrowBalance - underlyingModalValueUSD;
        } else {
          hypotheticalTotalBorrowBalance =
            hypotheticalTotalBorrowBalance - maxrepayValueUSD;
        }
      }
      if (use === "borrow") {
        hypotheticalTotalBorrowBalance =
          BorrowBalance + underlyingModalValueUSD;
      }

      const comptroller = new ethers.Contract(
        Comptroller,
        comptrollerAbi,
        signer
      );
      let hypotheticalAccountLiquididity;

      if (use === "borrow") {
        hypotheticalAccountLiquididity =
          Originalliquidity - underlyingModalValueUSD;
      }

      let hypotheticalWithdrawRatio;

      if (use === "withdraw") {
        const tokensSupplied =
          (await cToken.callStatic.balanceOfUnderlying(accountAdress)) /
          Math.pow(10, underlyingDecimals);
        const maxWithdrawValueUSD = tokensSupplied * PriceInUsd;
        if (underlyingModalValueUSD <= maxWithdrawValueUSD) {
          hypotheticalAccountLiquididity =
            Originalliquidity - underlyingModalValueUSD;
        } else {
          hypotheticalAccountLiquididity =
            Originalliquidity - maxWithdrawValueUSD;
        }

        hypotheticalWithdrawRatio =
          (hypotheticalTotalBorrowBalance /
            (hypotheticalAccountLiquididity + hypotheticalTotalBorrowBalance)) *
          100;
      }

      let hypotheticalSupplyRatio;
      if (use === "supply") {
        let { 1: collateralFactor } = await comptroller.callStatic.markets(
          cTokenAddress
        );

        const tokenCollateralfactor = collateralFactor / 1e18;

        hypotheticalAccountLiquididity =
          Originalliquidity + underlyingModalValueUSD * tokenCollateralfactor;
        hypotheticalSupplyRatio =
          (BorrowBalance / (hypotheticalAccountLiquididity + BorrowBalance)) *
          100;
      }
      if (use === "repay") {
        const borrowBalanceNumber = borrowBalance;
        if (underlyingModalValueUSD < borrowBalanceNumber) {
          if (underlyingModalValueUSD <= maxrepayValueUSD) {
            hypotheticalAccountLiquididity =
              Originalliquidity + underlyingModalValueUSD;
          } else {
            hypotheticalAccountLiquididity =
              Originalliquidity + maxrepayValueUSD;
          }
        } else {
          hypotheticalAccountLiquididity =
            Originalliquidity + borrowBalanceNumber;
          hypotheticalTotalBorrowBalance = 0;
        }
      }

      let hypotheticalRatio =
        (hypotheticalTotalBorrowBalance / (Originalliquidity + BorrowBalance)) *
        100;
      if (hypotheticalAccountLiquididity >= 0) {
      } else {
        hypotheticalAccountLiquididity = 0;
      }
      hypotheticalAccount[0] = hypotheticalAccountLiquididity;

      if (isNaN(hypotheticalRatio)) {
      } else {
        if (use === "withdraw") {
          if (hypotheticalWithdrawRatio <= 100) {
            hypotheticalAccount[1] = hypotheticalWithdrawRatio;
          } else {
            hypotheticalAccount[1] = 100;
          }
        } else if (use === "supply") {
          if (hypotheticalSupplyRatio <= 100) {
            hypotheticalAccount[1] = hypotheticalSupplyRatio;
          } else {
            hypotheticalAccount[1] = 100;
          }
        } else {
          if (hypotheticalRatio <= 100) {
            hypotheticalAccount[1] = hypotheticalRatio;
          } else {
            hypotheticalAccount[1] = 100;
          }
        }
      }

      if (display === true) {
        await displayHypotheticalDate(modalValue, use);
      }

      return hypotheticalAccount;
    }
  }
};

export const hideHypotheticalDate = async function (use) {
  if (use === "supply") {
    HideByIDS([
      "withdrawLimit",
      "withdrawLimitArrow",
      "withdrawRatio",
      "withdrawRatioArrow",
    ]);
  } else if (use === "borrow") {
    HideByIDS([
      "borrowLimit",
      "borrowLimitArrow",
      "borrowRatio",
      "borrowRatioArrow",
    ]);
    HideByIDS([
      "repayLimit",
      "repayLimitArrow",
      "repayRatio",
      "repayRatioArrow",
    ]);
  }
};

const displayHypotheticalDate = async function (modalValue, use) {
  if (modalValue > 0 && hypotheticalAccount[1] > 0) {
    if (use === "repay") {
      ShowByIDS([
        "repayLimit",
        "repayLimitArrow",
        "repayRatio",
        "repayRatioArrow",
      ]);
      document.getElementById("repayLimit").innerHTML =
        "$" + nFormatter(hypotheticalAccount[0], 2);
      document.getElementById("repayRatio").innerHTML =
        toFixed(hypotheticalAccount[1], 2) + "%";
    }
    if (use === "supply") {
      ShowByIDS([
        "supplyLimit",
        "supplyLimitArrow",
        "supplyRatio",
        "supplyRatioArrow",
      ]);
      document.getElementById("supplyLimit").innerHTML =
        "$" + nFormatter(hypotheticalAccount[0], 2);
      document.getElementById("supplyRatio").innerHTML =
        toFixed(hypotheticalAccount[1], 2) + "%";
    }
    if (use === "withdraw") {
      ShowByIDS([
        "withdrawLimit",
        "withdrawLimitArrow",
        "withdrawRatio",
        "withdrawRatioArrow",
      ]);
      document.getElementById("withdrawLimit").innerHTML =
        "$" + nFormatter(hypotheticalAccount[0], 2);
      document.getElementById("withdrawRatio").innerHTML =
        toFixed(hypotheticalAccount[1], 2) + "%";
    }
    if (use === "borrow") {
      ShowByIDS([
        "borrowLimit",
        "borrowLimitArrow",
        "borrowRatio",
        "borrowRatioArrow",
      ]);
      document.getElementById("borrowLimit").innerHTML =
        "$" + nFormatter(hypotheticalAccount[0], 2);
      document.getElementById("borrowRatio").innerHTML =
        toFixed(hypotheticalAccount[1], 2) + "%";
    }
  } else {
    if (use === "repay") {
      HideByIDS([
        "repayLimit",
        "repayLimitArrow",
        "repayRatio",
        "repayRatioArrow",
      ]);
    }
    if (use === "supply") {
      HideByIDS([
        "supplyLimit",
        "supplyLimitArrow",
        "supplyRatio",
        "supplyRatioArrow",
      ]);
    }
    if (use === "withdraw") {
      HideByIDS([
        "withdrawLimit",
        "withdrawLimitArrow",
        "withdrawRatio",
        "withdrawRatioArrow",
      ]);
    }
    if (use === "borrow") {
      HideByIDS([
        "borrowLimit",
        "borrowLimitArrow",
        "borrowRatio",
        "borrowRatioArrow",
      ]);
    }
  }
};

var provider;
let providerWalletConnect;
export const walletConnectRPCProvider = async function (use, trigger) {
  if (use === "Alchemy") {
    try {
      if (trigger === "connecting") {
        providerWalletConnect = new WalletConnectProvider({
          rpc: {
            1: "https://eth-mainnet.alchemyapi.io/v2/tk7nf6IzCVblvN6CtohHkwwjsS6s8LfH",
            4: "https://eth-rinkeby.alchemyapi.io/v2/YJ-ptVmUlygHXqR6GYFgzScV0dWd7GNH",
            // ...
          },
        });
      } else {
        providerWalletConnect = new WalletConnectProvider({
          rpc: {
            1: "https://eth-mainnet.alchemyapi.io/v2/tk7nf6IzCVblvN6CtohHkwwjsS6s8LfH",
            4: "https://eth-rinkeby.alchemyapi.io/v2/YJ-ptVmUlygHXqR6GYFgzScV0dWd7GNH",
            // ...
          },
          qrcode: false,
        });
        providerWalletConnect.enable();
      }
    } catch {
      console.log("requests limit exceeded changing to other account");
    }
  } else if (use === "Infura") {
    try {
      const { infuraId } = require("networks/walletConnectProviders.json");
      providerWalletConnect = new WalletConnectProvider({ infuraId: infuraId });
      providerWalletConnect.enable();
    } catch {
      await walletConnectRPCProvider("Infura");
    }
  }
  return providerWalletConnect;
};

var offline = false;

export const getProvider = async function (use) {
  try {
    if (providerName[0] === "Wallet Connect") {
      const providerWalletConnect = await walletConnectRPCProvider("Alchemy");

      provider = new ethers.providers.Web3Provider(providerWalletConnect);

      providerWalletConnect.on("accountsChanged", () => {
        window.location.reload();
      });

      providerWalletConnect.on("chainChanged", () => {
        window.location.reload();
      });

      // Subscribe to session disconnection
      providerWalletConnect.on("disconnect", () => {
        window.location.reload();
      });
    } else if (providerName[0] === "Metamask") {
      provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    } else {
      provider = await getProviderConnected("getProvider");
    }

    if (use === "getAdress") {
      const signer = await provider.getSigner();
      const userAdress = await signer.getAddress();

      return userAdress;
    }

    return provider;
  } catch {
    console.log("failing to fetch provider");
  }
};

// const Walletdisconnect = async function () {
//   const { infuraId } = require("networks/walletConnectProviders.json");
//   const provider = new WalletConnectProvider({
//     infuraId: infuraId,
//   });

//   await provider.disconnect();
// };

var accountCount = 1;
export const accountOnce = async function () {
  if (accountCount <= 1) {
    const provider = await getProvider();

    const signer = provider.getSigner();

    const myWalletAddress = await signer.getAddress();

    accountCount += 1;
    return myWalletAddress;
  }
};

const NetApy = async function () {
  // resource https://gist.github.com/ajb413/a6f89486ec5485746cd5eac1e10e4fc2

  let supplyValueUSDApyDict = {};
  let borrowValueUSDApyDict = {};
  let sumValueUSDApy = {};
  let netAPY;

  for (let i = 0; i < assetNameArray.length; i++) {
    supplyValueUSDApyDict[assetNameArray[i]] =
      supplyValueUSDDict[assetNameArray[i]] *
      (supplyRatedictNumber[assetNameArray[i]] / 100);

    borrowValueUSDApyDict[assetNameArray[i]] =
      borrowValueUSDDict[assetNameArray[i]] *
      (borrowRatedictNumber[assetNameArray[i]] / 100);
    sumValueUSDApy[assetNameArray[i]] =
      supplyValueUSDApyDict[assetNameArray[i]] -
      borrowValueUSDApyDict[assetNameArray[i]];
  }
  const sumValueUSDApyList = Object.values(sumValueUSDApy);

  let totalSumValueUSDApy = 0;

  for (let i = 0; i < assetNameArray.length; i++) {
    totalSumValueUSDApy = totalSumValueUSDApy + sumValueUSDApyList[i];
  }

  if (totalSumValueUSDApy > 0) {
    netAPY = 100 * (totalSumValueUSDApy / Balances[0]);
  } else {
    netAPY = 100 * (totalSumValueUSDApy / Balances[1]);
  }

  return netAPY;
};

export const displayNetApy = async function () {
  const netApy = await NetApy();

  if (Number(netApy) > 0) {
    document.getElementById("netApy").innerHTML =
      "NET APY: " + toFixed(Number(netApy), 2) + "%+3%*";
  } else {
    document.getElementById("netApy").innerHTML = "NET APY: 0%";
  }
};

export const displayTokenSupplyWallet = async function (asset) {
  try {
    document.getElementById("CurrentlySupplied").innerHTML =
      toFixed(supplyTokenAmountDict[asset], 2) + " " + asset;

    document.getElementById("WalletBalanceSupply").innerHTML =
      nFormatter(WalletBalanceDict[asset], 2) + " " + asset;
  } catch {
    console.log("display Token Supply Wallet");
  }
};

export const displayTokenBorrowWallet = async function (asset, use) {
  try {
    document.getElementById("CurrentlyBorrowing").innerHTML =
      toFixed(borrowTokenAmounTDict[asset], 2) + " " + asset;
    document.getElementById("WalletBalanceBorrow").innerHTML =
      nFormatter(WalletBalanceDict[asset], 2) + " " + asset;
  } catch {}
};

export const handleDisplayTokenBorrowWallet = function (asset, use) {
  if (use === "walletBalance") {
    return nFormatter(WalletBalanceDict[asset], 2) + " " + asset;
  } else if (use === "CurrentlyBorrowing") {
    if (borrowTokenAmounTDict[asset] === undefined) {
      return asset;
    } else {
      return toFixed(borrowTokenAmounTDict[asset], 2) + " " + asset + "test";
    }
  }
};
export const handleDisplayTokenSuppliedBalance = function (asset, use) {
  if (use === "walletBalance") {
    return nFormatter(WalletBalanceDict[asset], 2) + " " + asset;
  } else if (use === "CurrentlySupplied") {
    if (supplyTokenAmountDict[asset] === undefined) {
      return asset;
    } else {
      return toFixed(supplyTokenAmountDict[asset], 2) + " " + asset;
    }
  }
};

export const getCurrentVotes = async function () {
  if (supportNetwork === true) {
    const provider = await getProvider();

    const { compAbi } = require("networks/abi.json");

    const { Comp } = require("networks/" + network + ".json");

    const signer = provider.getSigner();

    const myWalletAddress = signer.getAddress();

    const comp = new ethers.Contract(Comp, compAbi, signer);

    const votes = await comp.callStatic.getCurrentVotes(myWalletAddress);
    return votes;
  }
};

export const displayCurrentVotes = async function () {
  if (supportNetwork === true) {
    const votes = await getCurrentVotes();

    document.getElementById("compCurrentAccount").innerHTML = votes;
  }
};

export const claimComp = async function () {
  if (supportNetwork === true) {
    const provider = await getProvider();

    const { comptrollerAbi } = require("networks/abi.json");

    const { Comptroller } = require("networks/" + network + ".json");

    const signer = provider.getSigner();
    const myWalletAddress = signer.getAddress();

    const comptrollerAddress = Comptroller;

    const comptroller = new ethers.Contract(
      comptrollerAddress,
      comptrollerAbi,
      signer
    );
    await comptroller.claimComp(myWalletAddress);
  }
};

export {
  DATATEST,
  borrowRatedict,
  supplyRatedict,
  assetNameArray,
  ActionVariable,
  supportNetwork,
  network,
  ApyGlobalData,
  hypotheticalAccount,
  providerName,
  userAdress,
  maxRepayData,
  withdrawAlltokens,
};
