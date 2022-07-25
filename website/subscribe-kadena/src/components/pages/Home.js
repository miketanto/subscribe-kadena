import React from "react";
import "../../App.css";
import Cards from "../home-page/Cards";
import HeroSection from "../home-page/HeroSection";
import Footer from "../Footer";

function Home() {
  return (
    <>
      <HeroSection />
      <Cards />
      <Footer />
    </>
  );
}

export default Home;
