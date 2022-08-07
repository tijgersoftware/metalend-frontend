import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Divider } from "antd";
import { NavLink, Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { toggleDarkMode } from "redux/appSlice/appSlice";
import { Drawer } from "antd";
import "./header.css";
import ConnectModal from "modals/header/ConnectModal";
import { supportNetwork } from "common/integration.js";

const Header = () => {
  const { app } = useSelector((state) => state);
  const [isConnectModal, setIsConnectModal] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const dispatch = useDispatch();

  const toggleDarkModeFun = () => {
    if (app?.isDarkMode) {
      document.documentElement.classList.remove("dark");
      dispatch(toggleDarkMode({ isDarkMode: false, theme: "light" }));
      if (supportNetwork === false) {
        document
          .getElementById("BorrowBalance")
          .classList.remove("continuous1");
        document.getElementById("BorrowBalance").className += " continuous2";
        document
          .getElementById("SupplyBalance")
          .classList.remove("continuous1");
        document.getElementById("SupplyBalance").className += " continuous2";

        document.getElementById("TVL").classList.remove("continuous1");
        document.getElementById("TVL").className += " continuous2";
      }
    } else {
      document.documentElement.classList.add("dark");
      dispatch(toggleDarkMode({ isDarkMode: true, theme: "dark" }));
      if (supportNetwork === false) {
        document
          .getElementById("BorrowBalance")
          .classList.remove("continuous2");
        document.getElementById("BorrowBalance").className += " continuous1";
        document
          .getElementById("SupplyBalance")
          .classList.remove("continuous2");
        document.getElementById("SupplyBalance").className += " continuous1";
        document.getElementById("TVL").classList.remove("continuous2");
        document.getElementById("TVL").className += " continuous1";
      }
    }
  };

  const getPartialAddress = (address) => {
    const partialAddres = address.slice(0, 4) + "..." + address.slice(-4);
    return partialAddres;
  };

  return (
    <Fragment>
      <nav className="bg-white dark:bg-darkModeBlack relative flex items-center">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 w-full">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 right-0 flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setSidebar(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className="hidden h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 flex items-center md:items-stretch justify-start">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/">
                  <img
                    className="block h-6 w-auto"
                    src={`/assets/images/${
                      app?.isDarkMode ? "darkLogo.png" : "logo.svg"
                    }`}
                    alt="Metaland"
                  />
                </Link>
              </div>
              <div className="hidden md:block md:ml-10">
                <div className="flex space-x-4 NavLinkDiv items-center h-full">
                  <NavLink
                    to="/"
                    className={({ isActive }) => [
                      isActive
                        ? "navActive dark:text-white text-darkGray font-semibold "
                        : "text-mediumGray font-light dark:text-lightGray",
                      " pb-1 text-sm dark:hover:text-white hover:text-darkGray",
                    ]}
                  >
                    Dashboard
                  </NavLink>
                  <img
                    src="/assets/images/diamond.png"
                    className="w-3 mx-3"
                    alt=""
                  />
                  {/* <NavLink
                    to='/vote'
                    className={({ isActive }) => [
                      isActive
                        ? 'navActive dark:text-white text-darkGray font-semibold '
                        : 'text-mediumGray font-light dark:text-lightGray',
                      ' pb-1 text-sm dark:hover:text-white hover:text-darkGray',
                    ]}>
                    Vote
                  </NavLink> */}
                </div>
              </div>
            </div>

            <div className="absolute hidden md:block focus:outline-none md:right-5 xl:right-0 flex items-center pr-2 sm:ml-6 sm:pr-0">
              <button
                type="button"
                onClick={() => setIsConnectModal(true)}
                className="dark:text-skyCus border-skyCus border-2 dark:bg-gray-500 text-white bg-skyCus px-5 py-2 rounded-md text-sm"
              >
                {app.userAddress
                  ? getPartialAddress(app.userAddress)
                  : "Connect Wallet"}
              </button>
            </div>
          </div>
        </div>
        <div className="absolute hidden md:block focus:outline-none right-0 flex items-center pr-2 sm:ml-6 sm:pr-2">
          <button
            type="button"
            onClick={toggleDarkModeFun}
            className="p-1 rounded-full bg-darkGray dark:bg-white focus:outline-none"
          >
            <span className="sr-only">Enable Light/Dark Mode</span>
            <FeatherIcon
              icon="sun"
              className="text-white dark:text-darkGray"
              size={14}
            />
          </button>
        </div>
      </nav>
      <Drawer
        title={
          <div className="sidebarTitle flex justify-between items-center ">
            <h6 className="dark:text-lightGray ">Menu</h6>
            <button
              className="dark:text-lightGray "
              type="button"
              onClick={() => setSidebar(false)}
            >
              X
            </button>
          </div>
        }
        placement="left"
        width="320px"
        visible={sidebar}
        className="bg-transparent"
      >
        <div className="drawerBody flex flex-col justify-between h-full">
          <div className="flex flex-col justify-between NavLinkDiv">
            <NavLink
              to="/"
              className={({ isActive }) => [
                isActive
                  ? "navActive dark:text-white text-darkGray font-semibold"
                  : "text-mediumGray font-light dark:text-lightGray",
                " pb-3 block mb-3 text-sm dark:hover:text-white hover:text-darkGray",
              ]}
            >
              Dashboard
            </NavLink>
            {/* <NavLink
              to='/vote'
              className={({ isActive }) => [
                isActive
                  ? 'navActive dark:text-white text-darkGray font-semibold'
                  : 'text-mediumGray font-light dark:text-lightGray',
                ' pb-3 block mb-3 text-sm dark:hover:text-white hover:text-darkGray',
              ]}>
              Vote
            </NavLink> */}
          </div>
          <div>
            <button
              type="button"
              onClick={() => setIsConnectModal(true)}
              className="w-full mb-3 block dark:text-skyCus border-skyCus border-2 dark:bg-gray-500 text-white bg-skyCus px-5 py-2 rounded-md text-sm"
            >
              {app.userAddress
                ? getPartialAddress(app.userAddress)
                : "Connect Wallet"}
            </button>
            <span className="dark:text-lightGray "> Mode Settings</span>
            <Divider
              type="horizontal"
              style={{
                width: "100%",
                color: "#DADADA",
                borderTop: "2px solid",
              }}
              className="lg:ml-10 ml-0 mt-3 min-w-min"
            />
            <div className="focus:outline-none flex items-center">
              <button
                type="button"
                onClick={toggleDarkModeFun}
                className="bg-transparent border-0 focus:outline-none flex items-center"
              >
                <span className="block p-1 rounded-full bg-darkGray dark:bg-white focus:outline-none">
                  <FeatherIcon
                    icon="sun"
                    className="text-white dark:text-darkGray"
                    size={14}
                  />
                </span>
                {app?.isDarkMode ? (
                  <>
                    <span className="text-xs text-secondary ml-4">
                      Dark Mode Activated
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-secondary ml-4">
                    Light Mode Activated
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </Drawer>
      <ConnectModal
        isDarkMode={app?.isDarkMode}
        isConnectModal={isConnectModal}
        setIsConnectModal={setIsConnectModal}
      />
    </Fragment>
  );
};

export default Header;
