import React from "react";
import anime from "animejs";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import Layout from "../components/layout";

import "../assets/scss/modules/about.module.scss";

class About extends React.Component {
  componentDidMount() {
    this.bind();
    this.addEvents();
    this.props.endTransition();
  }

  componentWillUnmount() {
    this.removeEvents();
    this.props.startTransition();
  }

  fadeLetters = (el, type) => {
    return new Promise(resolve => {
      anime({
        targets: el,
        translateY: type === "in" ? ["5px", 0] : [0, "5px"],
        opacity: type === "in" ? [0, 1] : [1, 0],
        easing: "spring(1, 80, 10, 0)",
        duration: 1,
        delay: (element, i) => {
          return 150 * i;
        },
        complete: () => {
          resolve(true);
        }
      });
    });
  };

  bind() {
    ["handleMovementBlocks"].forEach(fn => (this[fn] = this[fn].bind(this)));
  }

  handleMovementBlocks = () => {
    const items = document.querySelectorAll(".has-animated-text");
    items.forEach(el => {
      const word = el.querySelector(".animate-word");
      if (word) {
        const style = window.getComputedStyle(word);
        if (this.isElementInViewport(word) && parseFloat(style.opacity) === 0) {
          const elements = el.querySelectorAll(".animate-word");
          this.fadeLetters(elements, "in");
        }
      }
    });
  };

  isElementInViewport = el => {
    const rect = el.getBoundingClientRect();
    return (
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
      rect.top + 100 <
        (window.innerHeight || document.documentElement.clientHeight)
    );
  };

  addEvents() {
    window.addEventListener("scroll", this.handleMovementBlocks, false);
    window.addEventListener("resize", this.handleMovementBlocks, false);
    window.addEventListener("DOMContentLoaded", this.handleMovementBlocks);
    setTimeout(() => {
      this.handleMovementBlocks();
    }, 500);
  }

  removeEvents() {
    window.removeEventListener("scroll", this.handleMovementBlocks, false);
    window.removeEventListener("resize", this.handleMovementBlocks, false);
    window.removeEventListener("DOMContentLoaded", this.handleMovementBlocks);
  }

  render() {
    return (
      <Layout>
        <Head title="Emil Privér - About" />
        <Nav />
        <section id="about">
          <div className="hero">
            <div className="container mx-auto has-animated-text">
              <h1 className="animate-word">Developer based in Borås, Sweden</h1>
              <p className="animate-word">
                I love creating innovative websites and how we can use website
                to create business.
              </p>
              <p className="animate-word">
                I love programming and how programming develops ours society and
                what we can do with programming to create awesome stuff. How we
                can use programming in school to create system that evolve the
                students knowledge of different stuff. I daily read alot of
                information how companys work to develop the society into a
                better place and I love it.
              </p>
            </div>
          </div>
          <div className="experience">
            <div className="container mx-auto has-animated-text">
              <span className="title animate-word">Experience</span>
              <ul>
                <li>
                  <h3 className="animate-word">Rivercode</h3>
                  <span className="animate-word">
                    I am currently working as developer at
                    <a href="https://rivercode.se"> Rivercode </a>
                    in Borås, Sweden.
                  </span>
                </li>
                <li>
                  <h3 className="animate-word">Rafflestore</h3>
                  <span className="animate-word">
                    Lead developer. Rafflestore are an online raffle website
                    where you can buy or sell hypebeast clothes and sneakers
                  </span>
                </li>
                <li>
                  <h3 className="animate-word">Team Property</h3>
                  <span className="animate-word">
                    Webprogrammer and content write for the website and social
                    media
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="contact">
            <div className="container has-animated-text mx-auto">
              <span className="title animate-word">
                Some places you can contact me via
              </span>
              <div className="socials">
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
          </div>
        </section>
        <Footer />
      </Layout>
    );
  }
}

export default About;
