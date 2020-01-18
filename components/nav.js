import React from "react";
import Link from "next/link";

import "../assets/scss/modules/nav.module.scss";

const Nav = () => (
  <header id="nav">
    <div className="container mx-auto">
      <div className="logo w-1/4 float-left">
        <img
          src="https://cdn.privv.cloud/emilpriver/logo_black.png"
          alt="Emil Priver"
        />
      </div>
    </div>
  </header>
);

export default Nav;
