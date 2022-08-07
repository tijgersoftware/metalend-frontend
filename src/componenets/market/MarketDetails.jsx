import { useSelector } from "react-redux";
import { Table } from "antd";

const MarketDetails = () => {
  const { app } = useSelector((state) => state);

  const columns = [
    {
      title: (
        <span className="text-darkGray dark:text-thinGray mb-2">Market</span>
      ),
      dataIndex: "market",
    },
    {
      title: (
        <span className="text-darkGray dark:text-white text-right block">
          <img
            src="/assets/images/Vector1.svg"
            alt="Vector1"
            className="inline-block "
          />
          &nbsp;$4.2M
        </span>
      ),
      dataIndex: "rate",
    },
  ];

  const data = [
    {
      market: (
        <span className="text-xs text-mediumGray dark:text-white">
          Market Liquidity
        </span>
      ),
      rate: (
        <span className="text-xs  text-mediumGray dark:text-lightGray text-right block">
          1,530,564 ETH
        </span>
      ),
    },
    {
      market: (
        <span className="text-xs text-mediumGray dark:text-white">
          # of Suppliers
        </span>
      ),
      rate: (
        <span className="text-xs  text-mediumGray dark:text-lightGray text-right block">
          663773
        </span>
      ),
    },
    {
      market: (
        <span className="text-xs text-mediumGray dark:text-white">
          # of Borrowers
        </span>
      ),
      rate: (
        <span className="text-xs  text-mediumGray dark:text-lightGray text-right block">
          2232
        </span>
      ),
    },
    {
      market: (
        <span className="text-xs text-mediumGray dark:text-white">
          ETH Borrow Cap
        </span>
      ),
      rate: (
        <span className="text-xs  text-mediumGray dark:text-lightGray text-right block">
          No Limit
        </span>
      ),
    },
    {
      market: (
        <span className="text-xs text-mediumGray dark:text-white">
          Interest Paid/Day
        </span>
      ),
      rate: (
        <span className="text-xs  text-mediumGray dark:text-lightGray text-right block">
          $67,986.43
        </span>
      ),
    },
    {
      market: (
        <span className="text-xs text-mediumGray dark:text-white">
          Reserves
        </span>
      ),
      rate: (
        <span className="text-xs  text-mediumGray dark:text-lightGray text-right block">
          599.32 ETH
        </span>
      ),
    },
  ];

  return (
    <>
      <div
        className={`pt-5 rounded-lg mb-3 overflow-hidden ${
          app?.isDarkMode ? "linearBetaBG" : "bg-white"
        }`}
      >
        <div className="grid grid-rows-1">
          <div className="grid grid-cols-1">
            <span className="ml-5 mt-3 font-semibold text-base text-darkGray dark:text-white">
              Market Details
            </span>
          </div>
        </div>
        <div className="mt-4 px-7">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey={(record, index) => index}
          />
        </div>
      </div>
    </>
  );
};

export default MarketDetails;
