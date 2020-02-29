import React from "react";
import App from "next/app";
import RouterTransition from "../components/router-transition";

/**
 * Import scss file
 */
import "../assets/main.css";
import "../assets/scss/main.scss";

class Application extends App {
  render() {
    const { Component, pageProps, router } = this.props;
    return (
      <RouterTransition>
        <Component {...pageProps} key={router.route} />
      </RouterTransition>
    );
  }
}

export default Application;
