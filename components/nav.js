import React from "react";
import Link from "next/link";

import "../assets/scss/modules/nav.module.scss";

const Nav = () => (
  <header id="nav">
    <div className="wrapper mx-auto">
      <div className="logo float-left">
        <Link href="/">
          <a>
            <img
              src="https://cdn.privv.cloud/emilpriver/logo_black.png"
              alt="Emil Priver"
            />
          </a>
        </Link>
      </div>
      <div className="links float-right justify-end flex ">
        <Link href="/about">
          <a>About</a>
        </Link>
      </div>
    </div>
  </header>
);

export default Nav;
