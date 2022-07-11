import React from "react";
import "../App.css";
import { Button } from "./Button";
import "./HeroSection.css";

function HeroSection() {
  return (
    <div className="hero-container">
      {/*<Particles />
      <video src="../../public/videos/video-1.mp4" autoPlay loop muted />
       */}

      <h1>Welcome to Subscribe Kadena</h1>
      <p>Protocol for lending tokens using Marmalade</p>
      <div className="hero-btns">
        <Button
          className="glow-on-hover"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
        >
          SIGN UP
        </Button>
        <Button
          className="glow-on-hover"
          buttonStyle="btn--primary"
          buttonSize="btn--large"
          onClick={console.log("hey")}
        >
          GET STARTED <i className="far fa-play-circle" />
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
