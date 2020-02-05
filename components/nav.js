import React from "react";
import Link from "next/link";

import "../assets/scss/modules/nav.module.scss";

class Nav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logo: "https://cdn.privv.cloud/emilpriver/logo_black.png"
    };
  }

  componentDidMount() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      this.setState({
        logo: "https://cdn.privv.cloud/emilpriver/logo_white.png"
      });
    }
  }

  render() {
    const { logo } = this.state;
    return (
      <header id="nav">
        <div className="wrapper mx-auto">
          <div className="logo float-left">
            <Link href="/">
              <a>
                <img src={logo} alt="Emil Priver" />
              </a>
            </Link>
          </div>
          <div className="links float-right justify-end flex ">
            <Link href="/about">
              <a>About</a>
            </Link>
            <Link href="/posts">
              <a>Posts</a>
            </Link>
          </div>
        </div>
      </header>
    );
  }
}

export default Nav;
