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

  fadeLetters = (el, type) => {
    return new Promise(resolve => {
      anime({
        targets: el.querySelectorAll(".words"),
        translateY: type === "in" ? ["5px", 0] : [0, "5px"],
        opacity: type === "in" ? [0, 1] : [1, 0],
        easing: "spring(1, 80, 10, 0)",
        duration: 1,
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
        duration: 200
      });
      resolve("true");
    });
  };

  scrollWindowTo = number => {
    return new Promise(resolve => {
      anime({
        targets: this.carousellInner,
        translateY: number,
        duration: 200,
        complete: () => {
          resolve("true");
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

      if (event.deltaY > 0) {
        this.step += 1;
      } else {
        this.step -= 1;
      }

      await this.scrollWindowTo(`-${this.step * window.innerHeight}px`);

      this.isMoving = false;
    }
  }

  addEvents() {
    // window.addEventListener("wheel", this.handleMovementBlocks, {
    //   passive: true
    // });
  }

  removeEvents() {
    window.removeEventListener("wheel", this.handleMovementBlocks);
  }

  carousellInit() {
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
                  <span className="anime-words">A</span>
                  <span className="anime-words">developer</span>
                  <span className="anime-words">based</span>
                  <span className="anime-words">in</span>
                  <span className="anime-words">
                    <a
                      href="https://www.google.com/maps/place/Borås/@57.724734,12.8920644,13z/data=!3m1!4b1!4m5!3m4!1s0x465aa0b04bdcfeed:0x7c327e8fc1abfa59!8m2!3d57.721035!4d12.939819"
                      target="_blank"
                    >
                      Borås
                    </a>
                    ,
                  </span>
                  <span className="anime-words">
                    <a
                      href="https://www.google.com/maps/place/Sverige/@61.7514617,8.4252509,5z/data=!3m1!4b1!4m5!3m4!1s0x465cb2396d35f0f1:0x22b8eba28dad6f62!8m2!3d60.128161!4d18.643501"
                      target="_blank"
                    >
                      Sweden.
                    </a>
                  </span>
                </h1>
                <h3>
                  <span className="anime-words">Currently</span>
                  <span className="anime-words">working</span>
                  <span className="anime-words">at</span>
                  <span className="anime-words">
                    <a href="" target="_blank">
                      Rivercode
                    </a>
                    ,
                  </span>
                  <span className="anime-words">Creating</span>
                  <span className="anime-words">digital</span>
                  <span className="anime-words">experiencies.</span>
                </h3>
              </div>
            </div>
            {projects.map(item => (
              <div
                className="project frontpage-carousell-block frontpage-carousell-block-item"
                key={item.acf.slug}
              >
                <div className="frontpage-carousell-block-item-wrapper">
                  <div className="image">
                    <img src={item.acf.thumbnail} alt={item.title.rendered} />
                  </div>
                  <div className="frontpage-carousell-block-item-title">
                    <div className="frontpage-carousell-block-item-title-wrapper">
                      <h3>
                        {item.title.rendered.split(" ").map(el => {
                          return (
                            <div className="words" key={el}>
                              {el}
                            </div>
                          );
                        })}
                      </h3>
                      {item.acf.project_info ? (
                        <div className="frontpage-carousell-block-item-title-wrapper-project-info">
                          {item.acf.project_info.split(" ").map(el => {
                            return (
                              <div className="words" key={el}>
                                {el}
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div
              className="frontpage-carousell-block last-block"
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
