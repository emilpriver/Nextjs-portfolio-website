import React from "react";
import App from "next/app";
import { PageTransition } from "next-page-transitions";
/**
 * Import scss file
 */
import "../assets/main.css";
import "../assets/scss/main.scss";

class Application extends App {
  render() {
    const { Component, pageProps, router } = this.props;
    return (
      <>
        <PageTransition timeout={300} classNames="page-transition">
          <Component {...pageProps} key={router.route} />
        </PageTransition>
        <style jsx global>{`
          .page-transition-enter {
            opacity: 0;
          }
          .page-transition-enter-active {
            opacity: 1;
            transition: all 300ms;
          }
          .page-transition-exit {
            opacity: 1;
          }
          .page-transition-exit-active {
            opacity: 0;
            transition: all 300ms;
          }
        `}</style>
      </>
    );
  }
}

export default Application;
