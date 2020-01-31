import React from "react";
import NProgress from "nprogress";
import Router from "next/router";
import PropTypes from "prop-types";

/* eslint-disable react/prefer-stateless-function */
class NextNProgress extends React.Component {
  timer = null;

  componentDidMount() {
    const { options } = this.props;

    if (options) {
      NProgress.configure(options);
    }

    Router.events.on("routeChangeStart", this.routeChangeStart);
    Router.events.on("routeChangeComplete", this.routeChangeEnd);
    Router.events.on("routeChangeError", this.routeChangeEnd);
  }

  routeChangeEnd = () => {
    const { stopDelayMs } = this.props;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      NProgress.done(true);
    }, stopDelayMs);
  };

  routeChangeStart = () => {
    const { startPosition } = this.props;
    NProgress.set(startPosition);
    NProgress.start();
  };

  render() {
    const { color, height } = this.props;

    return (
      <style jsx global>
        {`
          #nprogress {
            pointer-events: none;
          }
          #nprogress .bar {
            background: ${color};
            position: fixed;
            z-index: 1031;
            top: 0;
            left: 0;
            width: 100%;
            height: ${height}px;
          }
          #nprogress .peg {
            display: block;
            position: absolute;
            right: 0px;
            width: 100px;
            height: 100%;
            box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
            opacity: 1;
            -webkit-transform: rotate(3deg) translate(0px, -4px);
            -ms-transform: rotate(3deg) translate(0px, -4px);
            transform: rotate(3deg) translate(0px, -4px);
          }
          #nprogress .spinner {
            position: fixed;
            right: 50%;
            top: 10%;
            background: #fff;
            padding: 20px;
            transform: translateX(50%);
            float: left;
            border-radius: 50%;
            z-index: 2000;
            box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.05);
          }
          #nprogress .spinner-icon {
            width: 18px;
            height: 18px;
            box-sizing: border-box;
            border: solid 2px transparent;
            border-top-color: ${color};
            border-left-color: ${color};
            border-radius: 50%;
            -webkit-animation: nprogresss-spinner 400ms linear infinite;
            animation: nprogress-spinner 400ms linear infinite;
          }
          .nprogress-custom-parent {
            overflow: hidden;
            position: relative;
          }
          .nprogress-custom-parent #nprogress .spinner,
          .nprogress-custom-parent #nprogress .bar {
            position: absolute;
          }
          @-webkit-keyframes nprogress-spinner {
            0% {
              -webkit-transform: rotate(0deg);
            }
            100% {
              -webkit-transform: rotate(360deg);
            }
          }
          @keyframes nprogress-spinner {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    );
  }
}

NextNProgress.propTypes = {
  color: PropTypes.string,
  startPosition: PropTypes.number,
  stopDelayMs: PropTypes.number,
  options: PropTypes.shape(),
  height: PropTypes.string
};

NextNProgress.defaultProps = {
  color: "#29D",
  startPosition: 0.3,
  stopDelayMs: 200,
  height: 3,
  options: {}
};

export default NextNProgress;
