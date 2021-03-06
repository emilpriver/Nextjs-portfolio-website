import React from "react";
import { initGA, logPageView } from "../utils/googleanalytics";

class Layout extends React.Component {
  componentDidMount() {
    if (window.location.host === "priver.dev") {
      if (!window.GA_INITIALIZED) {
        initGA();
        window.GA_INITIALIZED = true;
      }
      logPageView();
    }
  }
  render() {
    return <>{this.props.children}</>;
  }
}

export default Layout;
