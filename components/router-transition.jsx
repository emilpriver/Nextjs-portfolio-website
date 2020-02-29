import React, { Component } from "react";
import Router from "next/router";

class PageTransition extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: true
    };
  }

  startTransition = event => {};

  endTransition = event => {};

  componentDidUpdate() {
    Router.events.on("routeChangeStart", this.startTransition);
    Router.events.on("routeChangeComplete", this.endTransition);
  }

  render() {
    const { children } = this.props;
    const { active } = this.state;

    return <>{children}</>;
  }
}

export default PageTransition;
