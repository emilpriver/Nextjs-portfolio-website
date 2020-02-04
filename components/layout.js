import React from "react";
import { initGA, logPageView } from "../utils/googleanalytics";
import getConfig from "next/config";

class Layout extends React.Component {
  componentDidMount() {
    const { publicRuntimeConfig } = getConfig();
    if (!window.GA_INITIALIZED && !publicRuntimeConfig.DEV) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }
  render() {
    return <>{this.props.children}</>;
  }
}

export default Layout;
