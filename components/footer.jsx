import React from "react";

import "../assets/scss/modules/footer.module.scss";

function Footer() {
  return (
    <footer>
      <div className="wrapper mx-auto">
        <div className="float-left copy">
          <span>© All rights reserved, 2020</span>
        </div>
        <div className="contacts float-right">
          <a
            href="https://twitter.com/emil_priver"
            rel="noopener noreferrer"
            target="_blank"
            className="animate-word"
          >
            Twitter.
          </a>
          <a
            href="https://www.instagram.com/emil_priver/"
            rel="noopener noreferrer"
            target="_blank"
            className="animate-word"
          >
            Instagram.
          </a>
          <a
            href="https://github.com/emilpriver"
            rel="noopener noreferrer"
            target="_blank"
            className="animate-word"
          >
            Github.
          </a>
          <a
            href="https://www.linkedin.com/in/emilpriver/"
            target="_blank"
            rel="noopener noreferrer"
            className="animate-word"
          >
            Linkedin.
          </a>
          <a
            href="mailto:emil@priver.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="animate-word"
          >
            Mail.
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
