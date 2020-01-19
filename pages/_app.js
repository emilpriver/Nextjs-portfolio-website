import React from "react";
import App from "next/app";

/**
 * Import scss file
 */
import "../assets/main.css";
import "../assets/scss/main.scss";

class Application extends App {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}

export default Application;
