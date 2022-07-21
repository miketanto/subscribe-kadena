import React, { Component } from "react";

import StarfieldAnimation from "react-starfield-animation";

export default class Starfield extends Component {
  render() {
    return (
      <div
        style={{
          background: "linear-gradient(to bottom right, #00172D, #00498D)", //  #150D30, #3E1740
          backgroundSize: "stretch",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StarfieldAnimation
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    );
  }
}
