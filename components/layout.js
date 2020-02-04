import React from "react";
import { initGA, logPageView } from "../utils/googleanalytics";

class Layout extends React.Component {
  componentDidMount() {
    if (!window.GA_INITIALIZED && window.location.host === "priver.dev") {
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
