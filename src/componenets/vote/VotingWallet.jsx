import { useSelector } from "react-redux";
import { Divider } from "antd";

const VotingWallet = () => {
  const { app } = useSelector((state) => state);
  return (
    <>
      <div
        className={`p-5 rounded-lg ${
          app?.isDarkMode ? "linearBetaBG" : "bg-white"
        }`}
      >
        <div className="grid grid-rows-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold md:text-lg text-sm text-darkGray dark:text-thinGray">
              Voting Wallet
            </span>
            <span className=" lg:text-lg text-base text-darkGray dark:text-white flex items-center justify-end">
              <span>
                <b className="text-semiMediumGray dark:text-white md:text-2xl text-lg">
                  0.000{" "}
                  <span className="text-darkGray dark:text-semiMediumGray md:text-2xl text-lg">
                    0000
                  </span>
                </b>
                <span className="block text-thinGray dark:text-lightWhite lg:text-xs text-xs md:ml-8 ml-3">
                  MTLD Balance
                </span>
              </span>
              <img src="/assets/images/logo2.svg" alt="" className="ml-2" />
            </span>
          </div>
          <Divider
            type="horizontal"
            style={{ color: "#DADADA", borderTop: "1px solid" }}
            className="w-full mb-3 min-w-min"
          />
        </div>
        <div className=" flex flex-col justify-between votingButton">
          <div>
            <h1 className="mb-4 text-mediumGray dark:text-lightGray md:text-xl text-sm font-medium">
              Setup Voting
            </h1>
            <p className="text-semiMediumGray  dark:text-lightGray md:text-xs text-xs md:leading-7 leading-5">
              You can either vote on each proposal yourself or delegate your
              votes to a third party. Compond Govnanec puts you in charge of the
              future of Metalend...{" "}
              <span className="text-secondary">Learn more</span>
            </p>
          </div>
          <div>
            <button
              type="button"
              className="w-full dark:text-darkGray text-white font-semibold border-skyCus border-2 dark:bg-skyCus bg-skyCus px-5 py-2 rounded-md text-sm md:mt-0 mt-7"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VotingWallet;
