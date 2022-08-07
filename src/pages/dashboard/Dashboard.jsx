import BorrowMarket from "componenets/dashboard/BorrowMarket";
import NetAPY from "componenets/dashboard/NetAPY";
import SupplyMarket from "componenets/dashboard/SupplyMarket";
import "./dashbaord.css";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserAddress,
  updateApprovedArray,
} from "redux/appSlice/appSlice";
import { useEffect } from "react";
import {
  getApprovedTokenArray,
  supportNetwork,
  accountOnce,
} from "common/integration.js";

const Dashboard = () => {
  const { app } = useSelector((state) => state);
  const dispatch = useDispatch();

  const checkConnection = async () => {
    const accounts = await accountOnce();

    dispatch(updateUserAddress({ userAddress: accounts }));
  };

  const checkTokenApproved = async () => {
    if (supportNetwork === true) {
      const approvedArray = await getApprovedTokenArray();

      dispatch(updateApprovedArray({ approvedArray }));
    }
  };

  //only run on first load
  useEffect(() => {
    checkConnection();
    checkTokenApproved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.userAdress]);

  return (
    <>
      <NetAPY />

      <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-4">
        <SupplyMarket />
        <BorrowMarket />
      </div>
    </>
  );
};

export default Dashboard;
