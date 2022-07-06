import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// switch => routes

export default function App() {
  return (
    <>
      <Router>
        <Navbar>
          <Routes>
            <Route path="/" exact />
          </Routes>
        </Navbar>
      </Router>
    </>
  );
}
