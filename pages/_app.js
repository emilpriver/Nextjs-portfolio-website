import React from "react";
import App from "next/app";

/**
 * Import scss file
 */
import "../assets/main.css";
import "../assets/scss/main.scss";
import "aos/dist/aos.css";

class Application extends App {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}

export default Application;
