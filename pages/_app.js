import React from "react";
import App from "next/app";
import CustomProgressBar from "../components/nextNprogress";
/**
 * Import scss file
 */
import "../assets/main.css";
import "../assets/scss/main.scss";
import "highlight.js/scss/atom-one-dark.scss";

class Application extends App {
  render() {
    const { Component, pageProps, router } = this.props;
    return (
      <>
        <CustomProgressBar
          options={{
            easing: "ease",
            speed: 500,
            showSpinner: false
          }}
          color="#000"
          height="3"
        />
        <Component {...pageProps} key={router.route} />
      </>
    );
  }
}

export default Application;
