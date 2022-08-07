import { Divider, Modal } from "antd";

const NetAPYModal = ({ isDarkMode, visible, setVisible }) => {
  return (
    <Modal
      title=""
      centered
      visible={visible}
      onCancel={() => setVisible(false)}
      width={400}
      footer={false}
      className={`rounded-md border-slate-300 ${
        isDarkMode ? "linearBetaBG" : "bg-white"
      }`}
    >
      <div className="modalBody text-center px-5 py-7">
        <span
          className="text-darkGray dark:text-thinGray text-xl font-semibold justify-items-center mb-3"
          style={{ textAlign: "center" }}
        >
          MTLD BALANCE
        </span>
        <img
          src="/assets/images/Icon.svg"
          alt="Augur1"
          className="block mx-auto mb-2 py-4"
        />
        <div className="grid grid-cols-1">
          <span className="justify-items-center	 text-darkGray dark:text-lightGray text-3xl font-semibold py-2">
            0.000000000
          </span>
        </div>
        <div className="grid grid-cols-1">
          <span
            className="justify-items-center	 text-secondary text-2xl font-medium mb-5"
            style={{ textAlign: "center" }}
          >
            0.00
          </span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-sm font-medium text-semiMediumGray dark: text-lightGray">
            Wallet Balance
          </span>
          <span className="text-xl font-medium text-lightGray dark: text-semiMediumGray">
            0.00000
          </span>
        </div>
        <Divider
          type="horizontal"
          style={{
            color: "#DADADA",
            borderTop: "2px solid",
          }}
          className="dark: text-mediumGray"
        />

        <div className="grid grid-cols-2">
          <span className="text-sm font-medium text-semiMediumGray dark: text-lightGray">
            Unclamimed Balance
          </span>
          <span className="text-xl font-medium text-lightGray dark: text-semiMediumGray">
            0.000
          </span>
        </div>
        <Divider
          type="horizontal"
          style={{
            color: "#DADADA",
            borderTop: "2px solid",
          }}
          className=" dark: text-mediumGray w-10"
        />
        <div className="grid grid-cols-2">
          <span className="text-sm  text-secondary ml-9">Price</span>
          <span className="text-xl font-medium text-secondary">$763.21</span>
        </div>
        <button
          type="button"
          style={{
            width: "80%",
            justifyContent: "center",
            alignItems: "center",
          }}
          className=" text-white  dark: text-darkGray border-skyCus border-2 dark:bg-skyCus bg-skyCus px-5 py-2  mx-5 rounded-md text-sm justify-center justify-items-center justify-self-center items-center  mt-5 "
        >
          Nothing To Claim
        </button>
      </div>
    </Modal>
  );
};

export default NetAPYModal;
