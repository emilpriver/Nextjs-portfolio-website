import React from "react";
import Nav from "../components/nav";
import Head from "../components/head";

import "../assets/scss/modules/error.module.scss";

function Error() {
  return (
    <>
      <Head description="Emil Privér - 404" title="Emil Privér - 404" />
      <Nav />
      <div id="error">
        <div className="wrapper">
          <span>404, page dont exists</span>
        </div>
      </div>
    </>
  );
}

export default Error;
