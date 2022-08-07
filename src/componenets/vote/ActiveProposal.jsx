import { useSelector } from "react-redux";
import { Tag, Divider, Progress } from "antd";

const ActiveProposal = () => {
  const { app } = useSelector((state) => state);
  return (
    <>
      <div
        className={`p-5 rounded-lg ${
          app?.isDarkMode ? "linearBetaBG" : "bg-white"
        }`}
      >
        <div className="grid grid-rows-1">
          <p className="font-semibold md:text-lg text-sm text-darkGray dark:text-thinGray mt-3">
            Active Proposal
          </p>
        </div>
        <Divider
          type="horizontal"
          style={{ borderTop: "1px solid" }}
          className="w-full min-w-min dividerColor"
        />
        <div className="grid lg:grid-cols-6 md:grid-cols-7  grid-cols-7 gap-2">
          <div className="col-span-5 flex flex-row">
            <Divider
              type="vertical"
              style={{
                height: "100%",
                color: "#DADADA",
                borderLeft: "2px solid",
              }}
              className="mx-0"
            />
            <div className="ml-3">
              <h3 className=" text-darkGray dark:text-white text-base font-medium">
                Risk Parameter Updates for DAI, BAT, ZRX & ETH
              </h3>
              <span className="text-primary font-medium">
                081 - 19hr, 4min left
              </span>

              {/* <div className="flex flex-row justify-cente gap-3">
                <div className="flex-auto w-3">
                  <div className="flex flex-col">
                    <span className="text-semiMediumGray  dark:text-thinGray text-xs font-semibold">
                      For
                    </span>
                    <span className="text-darkGray dark:text-semiMediumGray font-medium lg:text-lg text-sm">
                      50%
                    </span>
                  </div>
                </div>
                <div className="flex-none ...">
                  <Progress
                    type="circle"
                    percent={50}
                    showInfo={false}
                    strokeWidth={8}
                    width={30}
                    strokeColor={"#17F6FF"}
                    className="lg:block hidden"
                  />
                </div>
                <div className="flex-auto w-32 ...">02</div>
                <div className="flex-auto w-32 ...">03</div>
              </div> */}

              <div className="grid-rows-1 mt-4">
                <div className="grid lg:grid-cols-6 md:grid-cols-6  grid-cols-6 gap-1 ">
                  <div className="col-span-2">
                    <div className="grid grid-cols-3 gap-1">
                      <div className="grid-rows-2 ">
                        <div className="">
                          <span className="text-semiMediumGray  dark:text-thinGray text-xs font-semibold">
                            For
                          </span>
                        </div>
                        <div className="pb-4">
                          <span className="text-darkGray dark:text-semiMediumGray font-medium lg:text-lg text-sm">
                            50%
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress
                          type="circle"
                          percent={50}
                          showInfo={false}
                          strokeWidth={8}
                          width={30}
                          strokeColor={"#17F6FF"}
                          className="lg:block hidden"
                        />
                      </div>
                      <div className="mt-2">
                        <Divider
                          type="vertical"
                          style={{
                            height: "30px",
                            color: "#DADADA",
                            borderLeft: "1px solid",
                          }}
                          className="lg:ml-5 ml-2 "
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="grid-rows-2 ">
                        <div className="">
                          <span className="text-semiMediumGray  dark:text-thinGray text-xs font-semibold">
                            Against
                          </span>
                        </div>
                        <div className="pb-4">
                          <span className="text-darkGray dark:text-semiMediumGray font-medium lg:text-lg text-sm">
                            25%
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 xl:ml-3 lg:ml-4 ml-0">
                        <Progress
                          type="circle"
                          percent={25}
                          showInfo={false}
                          strokeWidth={8}
                          width={30}
                          strokeColor={"#F7685B"}
                          className="lg:block hidden"
                        />
                      </div>
                      <div className="mt-2 xl:ml-3 lg:ml-4 ml-0">
                        <Divider
                          type="vertical"
                          style={{
                            height: "30px",
                            color: "#DADADA",
                            borderLeft: "1px solid",
                          }}
                          className="lg:ml-0 ml-3"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="grid grid-cols-3 gap-1">
                      <div className="grid-rows-2 ">
                        <div className="">
                          <span className="text-semiMediumGray  dark:text-thinGray text-xs font-semibold">
                            Abstain
                          </span>
                        </div>
                        <div className="pb-4">
                          <span className="text-darkGray dark:text-semiMediumGray font-medium lg:text-lg text-sm">
                            68%
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 xl:ml-3 lg:ml-4 ml-0">
                        <Progress
                          type="circle"
                          percent={68}
                          showInfo={false}
                          strokeWidth={8}
                          width={30}
                          strokeColor={"#2ED47A"}
                          className="lg:block hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" ">
            <Tag className="mx-0 py-1 px-3  rounded-xl bg-secondary text-white border-0">
              Active
            </Tag>
          </div>
        </div>

        <Divider
          type="horizontal"
          style={{ width: "90%", color: "#DADADA", borderTop: "1px solid" }}
          className="lg:ml-10 ml-4 mt-3 min-w-min"
        />

        <div className="grid lg:grid-cols-6 md:grid-cols-7  grid-cols-7 gap-2">
          <div className="col-span-5 flex flex-row">
            <Divider
              type="vertical"
              style={{
                height: "100%",
                color: "#DADADA",
                borderLeft: "2px solid",
              }}
              className="mx-0"
            />
            <div className="ml-3">
              <h3 className=" text-darkGray dark:text-white text-base font-medium">
                Security Solutions For Metalend Goverance
              </h3>
              <span className="text-primary font-medium">
                081 - 19hr, 4min left
              </span>
              <div className="grid-rows-1 mt-4">
                <div className="grid lg:grid-cols-6 md:grid-cols-6  grid-cols-6 gap-1 ">
                  <div className="col-span-2">
                    <div className="grid grid-cols-3 gap-1">
                      <div className="grid-rows-2 ">
                        <div className="">
                          <span className="text-semiMediumGray  dark:text-thinGray text-xs font-semibold">
                            For
                          </span>
                        </div>
                        <div className="pb-4">
                          <span className="text-darkGray dark:text-semiMediumGray font-medium lg:text-lg text-sm">
                            50%
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress
                          type="circle"
                          percent={50}
                          showInfo={false}
                          strokeWidth={8}
                          width={30}
                          strokeColor={"#17F6FF"}
                          className="lg:block hidden"
                        />
                      </div>
                      <div className="mt-2">
                        <Divider
                          type="vertical"
                          style={{
                            height: "30px",
                            color: "#DADADA",
                            borderLeft: "1px solid",
                          }}
                          className="lg:ml-5 ml-2 "
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="grid grid-cols-3 gap-1">
                      <div className="grid-rows-2 ">
                        <div className="">
                          <span className="text-semiMediumGray  dark:text-thinGray text-xs font-semibold">
                            Against
                          </span>
                        </div>
                        <div className="pb-4">
                          <span className="text-darkGray dark:text-semiMediumGray font-medium lg:text-lg text-sm">
                            25%
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 xl:ml-3 lg:ml-4 ml-0">
                        <Progress
                          type="circle"
                          percent={25}
                          showInfo={false}
                          strokeWidth={8}
                          width={30}
                          strokeColor={"#F7685B"}
                          className="lg:block hidden"
                        />
                      </div>
                      <div className="mt-2 ">
                        <Divider
                          type="vertical"
                          style={{
                            height: "30px",
                            color: "#DADADA",
                            borderLeft: "1px solid",
                          }}
                          className="lg:ml-5 ml-3"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="grid grid-cols-3 gap-1">
                      <div className="grid-rows-2 ">
                        <div className="">
                          <span className="text-semiMediumGray  dark:text-thinGray text-xs font-semibold">
                            Abstain
                          </span>
                        </div>
                        <div className="pb-4">
                          <span className="text-darkGray dark:text-semiMediumGray font-medium lg:text-lg text-sm">
                            68%
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 xl:ml-3 lg:ml-4 ml-0">
                        <Progress
                          type="circle"
                          percent={68}
                          showInfo={false}
                          strokeWidth={8}
                          width={30}
                          strokeColor={"#2ED47A"}
                          className="lg:block hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" ">
            <Tag className="mx-0 py-1 px-3  rounded-xl bg-secondary text-white border-0">
              Active
            </Tag>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActiveProposal;
