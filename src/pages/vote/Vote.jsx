import ActiveProposal from "componenets/vote/ActiveProposal";
import VotingWallet from "componenets/vote/VotingWallet";
import "./vote.css";

const Vote = () => {
  return (
    <>
      <div className="grid lg:grid-cols-12 md:grid-cols-8 grid-cols-6 md:gap-6 gap-0 my-5 md:mb-9 mb-0">
        <div>
          <img
            src="/assets/images/vote.svg"
            alt=""
            className=" md:mt-5 mt-6 md:ml-7 ml-3 md:w-16 w-8"
          />
        </div>
        <div className="xl:ml-3 lg:ml-4 md:ml-5 ml-0">
          <div>
            <div className="grid grid-rows-2 grid-flow-col gap-1 md:mr-5 mr-0 ">
              <div className="md:pb-2 pb-0">
                <h1 className="text-semiMediumGray dark:text-lightGray md:text-base text-xs font-medium mt-5 md: ml-1 ml-0">
                  Votes
                </h1>
              </div>
              <div className="flex ">
                <span className="text-darkGray inline-block dark:text-white font-semibold md:text-3xl text-base">
                  0.000
                </span>
                <span className="text-semiMediumGray dark:text-semiMediumGray font-semibold md:text-3xl text-base">0000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:grid-cols-1 xs:grid-cols-1 mb-5">
        <VotingWallet />
        <ActiveProposal />
      </div>
    </>
  );
};

export default Vote;
