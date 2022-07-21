import React from "react";
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

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/connect-wallet" element={<ConnectWallet />} />
          <Route path="/create-tokens" element={<CreateTokens />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/view-subscriptions" element={<ViewSubscriptions />} />
          <Route path="/buy-marketplace" element={<Marketplace />} />
          <Route path="/rent-marketplace" element={<RentMarketplace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;