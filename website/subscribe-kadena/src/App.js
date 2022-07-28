import React, { useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import CreateTokens from "./components/pages/CreateTokens";
import ConnectWallet from "./components/pages/ConnectWallet";
import SignUp from "./components/pages/SignUp";
import ViewSubscriptions from "./components/pages/ViewSubscriptionsPage";
import Marketplace from "./components/pages/Marketplace";
import RentMarketplace from "./components/pages/RentMarketplacePage";
import WithdrawSubscription from "./components/view-subscriptions/WithdrawSubscription";
import { WalletContext } from "./components/context/WalletContext";
import Particles from "react-tsparticles";

function App() {
  const [wallet, setWallet] = useState(null);
  const value = { wallet, setWallet };

  const particleParams = {
    fpsLimit: 60,
    particles: {
      color: {
        value: "#6b605a",
      },
      number: {
        density: {
          enable: true,
          value_area: 1000,
        },
        value: 100,
      },
      opacity: {
        value: 1,
        random: false,
        anim: {
          enable: false,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        random: false,
        value: 5,
      },
    },
    retina_detect: true,
  };
  return (
    <>
      <div className="App">
        <Particles className="particles" params={particleParams} />
        <WalletContext.Provider value={value}>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/connect-wallet" element={<ConnectWallet />} />
              <Route path="/create-tokens" element={<CreateTokens />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route
                path="/view-subscriptions"
                element={<ViewSubscriptions />}
              />
              <Route path="/withdraw-subscription" element={<WithdrawSubscription />} />
              <Route path="/buy-marketplace" element={<Marketplace />} />
              <Route path="/rent-marketplace" element={<RentMarketplace />} />
            </Routes>
          </Router>
        </WalletContext.Provider>
      </div>
    </>
  );
}

export default App;
