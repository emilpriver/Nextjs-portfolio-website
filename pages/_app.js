import React from "react";
import App from "next/app";
import RouterTransition from "../components/router-transition";

/**
 * Import scss file
 */
import "../assets/main.css";
import "../assets/scss/main.scss";

class Application extends App {
  callStartTransition = () => {
    this.routerRef.startTransition();
  };

  callEndTransition = () => {
    this.routerRef.endTransition();
  };

  render() {
    const { Component, pageProps, router } = this.props;
    return (
      <RouterTransition onRef={ref => (this.routerRef = ref)}>
        <Component
          startTransition={this.callStartTransition}
          endTransition={this.callEndTransition}
          key={router.route}
          {...pageProps}
        />
      </RouterTransition>
    );
  }
}

export default Application;
