import { Route, Routes } from "react-router-dom";
import Header from "partials/header/Header";
import routes from "routes/routes";
import Footer from "partials/footer/Footer";
import React, { useEffect } from "react";

import WalletConnectProvider from "@walletconnect/web3-provider";

function App() {
  useEffect(() => {
    window.addEventListener("online", (e) => window.location.reload());

    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    } else {
      const { infuraId } = require("networks/walletConnectProviders.json");

      const provider = new WalletConnectProvider({ infuraId: infuraId });

      provider.on("accountsChanged", () => {
        window.location.reload();
      });

      provider.on("chainChanged", () => {
        window.location.reload();
      });

      provider.on("disconnect", () => {
        window.location.reload();
      });
    }
  });

  return (
    <div className="bg-thinLightGray dark:bg-black w-100 pb-5">
      <Header />
      <div className="mainPagesDiv max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 w-full">
        <Routes>
          {routes?.map((route) => (
            <Route key={`routerKey${route.id}`} exact {...route} />
          ))}
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
