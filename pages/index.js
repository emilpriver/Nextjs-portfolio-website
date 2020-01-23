import React from "react";
import Link from "next/link";
import anime from "animejs";
import axios from "axios";
import Head from "../components/head";
import Nav from "../components/nav";

import "aos/dist/aos.css";

export async function unstable_getStaticProps() {
  const data = await axios
    .get("https://api.priver.dev/wp-json/wp/v2/works?filter=[orderby]=date")
    .then(d => d.data);
  return { props: { projects: data } };
}

/**
 * @todo Add floating elements behind all text on the hero
 */

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.bind();

    this.state = {
      activeSlideProjectInfo: "",
      activeSlideTitle: "",
      activeSlideSlug: ""
    };

    if (process.browser) {
      this.carousell = document.querySelector(".frontpage");
      this.carousellInner = document.querySelector(".frontpage-carousell");
      this.items = [
        ...this.carousell.querySelectorAll(".frontpage-carousell-block-item")
      ];
      this.totalSteps = this.items.length + 2;
      this.totalStepsWithoutLast = this.items.length + 1;
    }

    this.step = 0;
    this.isMoving = false;

    this.projectTextRef = React.createRef();
    this.hero = React.createRef();
    this.lastElement = React.createRef();
  }

  componentDidMount() {
    anime({
      targets: ".anime-words",
      translateY: [10, 0],
      translateZ: 0,
      opacity: [0, 1],
      easing: "spring(1, 80, 10, 0)",
      duration: 1400,
      delay: (element, i) => {
        return 300 + 30 * i;
      }
    });

    this.carousellInit();
  }

  componentWillUnmount() {
    this.removeEvents();
  }

  setBounds() {
    this.carousell.style.height = window.screen.height;

    this.items.forEach(slide => {
      slide.style.height = `${window.screen.height}px`;
      slide.style.top = `${window.screen.height}px`;
    });

    this.hero.current.style.height = `${window.screen.height}px`;
    this.hero.current.style.top = 0;
    this.lastElement.current.style.height = `${window.screen.height}px`;
    this.lastElement.current.style.top = `${window.screen.height * 2}px`;
  }

  fadeLetters = (el, type) => {
    return new Promise(resolve => {
      anime({
        targets: el.querySelectorAll(".words"),
        translateY: type === "in" ? ["5px", 0] : [0, "5px"],
        opacity: type === "in" ? [0, 1] : [1, 0],
        easing: "spring(1, 80, 10, 0)",
        duration: 1400,
        delay: (element, i) => {
          return 300 + 30 * i;
        },
        complete: () => {
          resolve(true);
        }
      });
    });
  };

  fadeImage = (el, type) => {
    return new Promise(resolve => {
      anime({
        targets: el.querySelectorAll(".image"),
        translateY: type === "in" ? ["5px", 0] : [0, "5px"],
        opacity: type === "in" ? [0, 1] : [1, 0],
        easing: "spring(1, 80, 10, 0)",
        duration: 1400,
        delay: (element, i) => {
          return 300 + 30 * i;
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

  async handleMovementBlocks(event) {
    if (!this.isMoving) {
      this.isMoving = true;

      /**
       * If scroll is at the top of the page
       */
      if (this.step === 0 && event.deltaY < 0) {
        this.carousellInner.style.transform = `translate3d(0, ${-window.screen
          .height}px, 0)`;
        this.step = 1;

        /**
         * If scroll is at the bottom
         */
      } else if (this.step === this.items.length + 2 && event.deltaY > 0) {
        this.carousellInner.style.transform = `translate3d(0, ${2 *
          -window.screen.height}px, 0)`;
        this.step = this.totalSteps;
      } else {
        /**
         * if scroll is at a project
         */
        if (this.step - 1 === this.items.length && event.deltaY < 0) {
          this.carousellInner.style.transform = `translate3d(0, ${2 *
            -window.screen.height}px, 0)`;
          this.step = this.totalSteps;
        }

        if (this.step === 1 && event.deltaY > 0) {
          this.carousellInner.style.transform = "translate3d(0, 0px, 0)";
          this.step = 1;
        }

        const oldElement = this.items[this.step - 1];
        if (this.step === 2) {
          await this.fadeLetters(oldElement, "in");
          await this.fadeImage(oldElement, "out");
        }
        this.step += 1;
        const element = this.items[this.step - 1];
        if (this.step === 2) {
          await this.fadeLetters(element, "in");
          await this.fadeImage(element, "out");
        }
      }
      console.log(this.step);
    }
    this.isMoving = false;
  }

  addEvents() {
    window.addEventListener("wheel", this.handleMovementBlocks, {
      passive: true
    });
  }

  removeEvents() {
    window.removeEventListener("wheel", this.handleMovementBlocks);
  }

  carousellInit() {
    this.setBounds();
    this.addEvents();
  }

  render() {
    const { projects } = this.props;
    const {
      activeSlideProjectInfo,
      activeSlideTitle,
      activeSlideSlug
    } = this.state;
    return (
      <>
        <Head title="Emil Privér - System Egineer in Borås" />
        <Nav />
        <div className="frontpage">
          <div className="frontpage-carousell">
            <div
              className="frontpage-carousell-block"
              ref={this.hero}
              id="hero"
            >
              <div className="container wrapper">
                <h1>
                  <span className="anime-words">I </span>
                  <span className="anime-words">am</span>
                  <span className="anime-words">Emil</span>
                  <span className="anime-words">Priver.</span>
                  <br />
                  <span className="anime-words">A</span>
                  <span className="anime-words">developer</span>
                  <span className="anime-words">based</span>
                  <span className="anime-words">in</span>
                  <span className="anime-words">Borås,</span>
                  <span className="anime-words">Sweden</span>
                </h1>
                <h3>
                  <span className="anime-words">Currently</span>
                  <div className="anime-words">working</div>
                  <div className="anime-words">at</div>
                  <div className="anime-words">Rivercode,</div>
                  <br />
                  <span className="anime-words">Creating</span>
                  <div className="anime-words">digital</div>
                  <div className="anime-words">experiencies.</div>
                </h3>
              </div>
            </div>
            {projects.map(item => (
              <div
                className="project frontpage-carousell-block frontpage-carousell-block-item"
                key={item.acf.slug}
              >
                <div className="project_wrapper">
                  <div className="image">
                    <img src={item.acf.thumbnail} alt={item.title.rendered} />
                  </div>
                </div>
              </div>
            ))}
            <div
              className="frontpage-carousell-block"
              ref={this.lastElement}
              id="hero"
            >
              <div className="container wrapper">
                <h1>
                  <span className="anime-words">I </span>
                  <span className="anime-words">am</span>
                  <span className="anime-words">Emil</span>
                  <span className="anime-words">Priver.</span>
                  <br />
                  <span className="anime-words">A</span>
                  <span className="anime-words">developer</span>
                  <span className="anime-words">based</span>
                  <span className="anime-words">in</span>
                  <span className="anime-words">Borås,</span>
                  <span className="anime-words">Sweden</span>
                </h1>
                <h3>
                  <span className="anime-words">Currently</span>
                  <div className="anime-words">working</div>
                  <div className="anime-words">at</div>
                  <div className="anime-words">Rivercode,</div>
                  <br />
                  <span className="anime-words">Creating</span>
                  <div className="anime-words">digital</div>
                  <div className="anime-words">experiencies.</div>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Home;
