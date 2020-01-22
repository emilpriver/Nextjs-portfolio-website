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

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlideProjectInfo: "",
      activeSlideTitle: "",
      activeSlideSlug: ""
    };

    if (process.browser) {
      this.slider = document.querySelector(".frontpage");
      this.sliderInner = document.querySelector(".frontpage-carousell");
      this.slides = [
        ...this.slider.querySelectorAll(".frontpage-carousell-block")
      ];
      this.slidesNumb = this.slides.length;

      this.centerX = window.innerWidth / 2;
    }

    this.step = 0;
    this.steps = 0;

    this.projectTextRef = React.createRef();
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

    this.sliderInit();
    // this.toggleActiveElement();
  }

  setBounds() {
    this.sliderHeight = this.slidesNumb * window.screen.height;
    this.max = -(this.sliderHeight - window.screen.height);

    this.slider.style.height = window.screen.height;

    this.slides.forEach((slide, index) => {
      slide.style.height = `${window.screen.height}px`;
      slide.style.top = `${index * window.screen.height}px`;
    });
  }

  sliderInit() {
    this.setBounds();
  }

  componentWillUnmount() {
    this.removeEvents();
  }

  handleMovementBlocks() {}

  addEvents() {
    window.addEventListener("wheel", this.handleMovementBlocks());
  }

  removeEvents() {
    window.removeEventListener("wheel", this.handleMovementBlocks());
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
            <div className="frontpage-carousell-block" id="hero">
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
                className="project frontpage-carousell-block"
                key={item.acf.slug}
              >
                <div className="project_wrapper">
                  <div className="image">
                    <img src={item.acf.thumbnail} alt={item.title.rendered} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}

export default Home;
