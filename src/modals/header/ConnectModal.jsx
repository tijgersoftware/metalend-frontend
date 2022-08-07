import { Modal } from "antd";
import { Link } from "react-router-dom";
import React from "react";
import { useDispatch } from "react-redux";
import { updateUserAddress } from "redux/appSlice/appSlice";
import { providerName, GetNetwork } from "common/integration";

const ConnectModal = ({ isDarkMode, isConnectModal, setIsConnectModal }) => {
  const dispatch = useDispatch();

  const ConnectWallet = async () => {
    // Check if MetaMask is installed on user's browser
    if (typeof window.ethereum !== "undefined") {
      if (window.ethereum.isMetaMask !== "undefined") {
        if (window.ethereum) {
          providerName[0] = "Metamask";
          try {
            await GetNetwork("connectbutton");
          } catch {
            console.log("Failed to catch network");
          }
          // connects metamask to the website.
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });

          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });

          dispatch(updateUserAddress({ userAddress: accounts[0] }));
          if (chainId !== "0x1" && chainId !== "0x4") {
            alert("Supported connections: Ethereum Mainnet, Rinkeby Testnet");
          }
          setIsConnectModal(false);
        } else {
          alert("Please install Mask");
        }
      }
    } else {
      alert("Please install a wallet!");
    }
    providerName[0] = "Metamask";
  };

  return (
    <Modal
      centered
      visible={isConnectModal}
      onCancel={() => setIsConnectModal(false)}
      maxWidth={500}
      footer={false}
      className={` rounded-md  ${isDarkMode ? "linearBetaBG" : "bg-white"}`}
    >
      <div className="connectModalBody py-5">
        <div className="modalTitle flex flex-col justify-center items-center mb-5">
          <div className="w-20 h-20 rounded-full shadow-xl flex mb-3 justify-center items-center">
            <img
              src="/assets/images/Meatalandicon.svg"
              className="w-full"
              alt=""
            />
          </div>
          <h5 className="text-darkGray text-base font-medium mb-3 dark:text-white">
            Connect Wallet
          </h5>
          <p className="text-semiMediumGray text-sm">To start using Metalend</p>
        </div>
        <ul className="walletList block md:w-3/4 mx-auto">
          <li
            onClick={ConnectWallet}
            class="enableEthereumButton"
            className="flex items-center py-4 cursor-pointer hover:shadow-lg px-5 border-b border-semiMediumGray"
          >
            <img src="/assets/images/connectSvg1.svg" className="w-8" alt="" />
            <p
              onClick
              className="text-darkGray ml-4 text-sm dark:text-white enableEthereumButton"
              id="connectButton"
            >
              Metamask
            </p>
          </li>

          {/* <li className='flex items-center py-4 cursor-pointer hover:shadow-lg px-5 border-b border-semiMediumGray'>
            <img src='/assets/images/connectSvg2.svg' className='w-8' alt='' />
            <p className='text-darkGray ml-4 text-sm dark:text-white'>Ledger</p>
  </li> */}
          {/* <li
            onClick={WalletConnect}
            className="flex items-center py-4 cursor-pointer hover:shadow-lg px-5 border-b border-semiMediumGray"
          >
            <img src="/assets/images/connectSvg3.svg" className="w-8" alt="" />
            <p className="text-darkGray ml-4 text-sm dark:text-white">
              Wallet Connect
            </p>
          </li>
          <li
            onClick={Walletdisconnect}
            className="flex items-center py-4 cursor-pointer hover:shadow-lg px-5 border-b border-semiMediumGray"
          >
            <img src="/assets/images/connectSvg3.svg" className="w-8" alt="" />
            <p className="text-darkGray ml-4 text-sm dark:text-white">
              Walletdisconnect
            </p>
          </li> */}
          {/* <li className='flex items-center py-4 cursor-pointer hover:shadow-lg px-5'>
            <img src='/assets/images/connectSvg4.svg' className='w-8' alt='' />
            <p className='text-darkGray ml-4 text-sm dark:text-white'>Coinbase Wallet</p>
          </li> */}
        </ul>
        <p className="text-lighGray dark:text-white text-xs text-center p-4">
          By connecting, I accept Metalend's{" "}
          <Link to="/" className="inline-block text-xs text-lightGreen ">
            Terms of Service
          </Link>
        </p>
      </div>
    </Modal>
  );
};

export default ConnectModal;
