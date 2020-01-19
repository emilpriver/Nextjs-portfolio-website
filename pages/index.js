import React from "react";
import Link from "next/link";
import anime from "animejs";
import axios from "axios";
import AOS from "aos";
import Head from "../components/head";
import Nav from "../components/nav";
import Slider from "../modules/slider";

import "aos/dist/aos.css";

class Home extends React.Component {
  static async getInitialProps() {
    const projects = await axios
      .get("https://api.priver.dev/wp-json/wp/v2/works?filter=[orderby]=date")
      .then(d => d.data);

    return { projects };
  }

  constructor(props) {
    super(props);

    this.state = {};
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

    // AOS.init();

    window.addEventListener("scroll", () => {
      const elements = document.querySelectorAll(".toggle-transition-element");
      Array.prototype.forEach.call(elements, child => {
        if (this.inView(child)) {
          if (!child.classList.contains("animated")) {
            child.classList.add("animated");
            this.fadeLetters(child, "in");
          }
        }
        //         if (!this.inView(child)) {
        //          if (child.classList.contains("animated")) {
        //            child.classList.remove("animated");
        //            this.fadeLetters(child, "out");
        //          }
        //        }
      });
    });
  }

  inView = el => {
    const bounding = el.getBoundingClientRect();
    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.right <=
        (window.innerWidth || document.documentElement.clientWidth) &&
      bounding.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    );
  };

  fadeLetters = (el, type) => {
    anime({
      targets: el.querySelectorAll(".words"),
      translateY: type === "in" ? ["5px", 0] : [0, "5px"],
      opacity: type ? [0, 1] : [1, 0],
      easing: "spring(1, 80, 10, 0)",
      duration: 1400,
      delay: (element, i) => {
        return 300 + 30 * i;
      }
    });
  };

  render() {
    const { projects } = this.props;
    return (
      <>
        <Head title="Emil Privér - System Egineer in Borås" />
        <Nav />
        <section id="hero">
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
        </section>
        <section id="works">
          <div className="wrapper mx-auto">
            <h2 className="title">My Works</h2>
            <div className="projects-wrapper">
              {projects.map(item => (
                <div className="project" key={item.slug}>
                  <div className="project_wrapper">
                    <div className="image">
                      <img src={item.acf.thumbnail} alt={item.title.rendered} />
                    </div>
                    <div className="text">
                      <h4 className="toggle-transition-element">
                        <div className="words">{item.acf.project_info}</div>
                      </h4>
                      <h2 className="toggle-transition-element">
                        <div className="words">{item.title.rendered}</div>
                      </h2>
                      <Link href={`/project/${item.slug}`}>
                        <a className="toggle-transition-element">
                          <div className="words">Go</div>
                          <div className="words">To</div>
                          <div className="words">Project</div>
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default Home;
