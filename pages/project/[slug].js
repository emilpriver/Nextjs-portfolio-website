import React from "react";
import axios from "axios";
import anime from "animejs";
import Head from "../../components/head";
import Nav from "../../components/nav";

import "../../assets/scss/modules/single-project.module.scss";

export async function unstable_getStaticPaths() {
  const params = await axios
    .get("https://api.priver.dev/wp-json/acf/v3/works")
    .then(response => response.data)
    .then(response => {
      return response.map(el => {
        return {
          params: {
            slug: el.acf.slug
          }
        };
      });
    });

  return params;
}

export async function unstable_getStaticProps(context) {
  const { params } = context;
  const project = await axios
    .get(`https://api.priver.dev/wp-json/acf/v3/works?slug=${params.slug}`)
    .then(d => d.data[0]);
  return { props: { project } };
}

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.bind();
  }

  componentDidMount() {
    this.addEvents();
  }

  componentWillUnmount() {
    this.removeEvents();
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
      const style = window.getComputedStyle(word);
      if (this.isElementInViewport(word) && parseFloat(style.opacity) === 0) {
        this.fadeLetters(el.querySelectorAll(".animate-word"), "in");
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
    window.addEventListener(
      "DOMContentLoaded",
      this.handleMovementBlocks,
      false
    );
  }

  removeEvents() {
    window.removeEventListener("scroll", this.handleMovementBlocks, false);
    window.removeEventListener("resize", this.handleMovementBlocks, false);
    window.removeEventListener(
      "DOMContentLoaded",
      this.handleMovementBlocks,
      false
    );
  }

  render() {
    const { project } = this.props;
    return (
      <>
        <Head
          ogImage={project.acf.thumbnail}
          title={`Emil Privér - Project ${project.acf.title}`}
          description={`Emil Privér - Project ${project.acf.title} - ${project.acf.project_info}`}
        />
        <Nav />
        <div
          className="single-project-hero"
          style={{ backgroundImage: `url(${project.acf.thumbnail})` }}
        />
        <div className="single-project-content w-full float-left">
          <div className="wrapper mx-auto">
            <h1 className="single-project-content-title has-animated-text float-left w-full">
              {project.acf.title.split(" ").map((el, index) => {
                return (
                  <div
                    className="animate-word"
                    key={project.acf.title + index + el}
                  >
                    {el}
                  </div>
                );
              })}
            </h1>
            <span className="single-project-content-project-init has-animated-text float-left w-full">
              {project.acf.project_init_description
                .split(" ")
                .map((el, index) => {
                  return (
                    <div
                      className="animate-word"
                      key={project.acf.title + index + el}
                      dangerouslySetInnerHTML={{ __html: el }}
                    />
                  );
                })}
            </span>
            <div class="single-project-content-project-cols">
              <div className="col has-animated-text">
                <span>
                  <div className="animate-word">CLIENT</div>
                </span>
                <span>
                  {project.acf.customer_name.split(" ").map((el, index) => {
                    return (
                      <div
                        className="animate-word"
                        key={el}
                        dangerouslySetInnerHTML={{ __html: el }}
                      />
                    );
                  })}
                </span>
              </div>
              <div className="col has-animated-text">
                <span>
                  <div className="animate-word">WORK</div>
                </span>
                <span>
                  {project.acf.project_info.split(" ").map((el, index) => {
                    return (
                      <div className="animate-word" key={`${el + index}`}>
                        {el}
                      </div>
                    );
                  })}
                </span>
              </div>
              <div className="col has-animated-text">
                <span>
                  <div className="animate-word">WEBSITE</div>
                </span>
                <span>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={project.acf.website_url}
                  >
                    <span className="animate-word">
                      {project.acf.website_url}
                    </span>
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Project;
