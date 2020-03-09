import React from "react";
import Link from "next/link";
import anime from "animejs";
import groq from "groq";
import imageUrlBuilder from "@sanity/image-url";
import LazyLoad from "react-lazyload";
import client from "../sanity";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import Layout from "../components/layout";

import "aos/dist/aos.css";

function imageURL(source) {
  return imageUrlBuilder(client).image(source);
}

const query = groq`*[_type == "works"] | order(_createdAt asc) {
  title,
  thumbnail,
  customer_name,
  seo,
  slug,
  color,
  website_url,
  project_info,
  background_color,
  image_projects_page,
  publishedAt,
  description,
  blocks
}`;

export async function getStaticProps() {
  const data = await client.fetch(query);
  return { props: { projects: data } };
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.bind();

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
    setTimeout(() => {
      this.handleMovementBlocks();
      this.slideInSocials();
    }, 800);
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

  slideInSocials = () => {
    anime({
      targets: document.querySelectorAll(".socials a"),
      translateY: ["5px", 0],
      opacity: [0, 1],
      easing: "spring(1, 80, 10, 0)",
      duration: 1,
      delay: (element, i) => {
        return 250 * i;
      }
    });
  };

  bind() {
    ["handleMovementBlocks"].forEach(fn => (this[fn] = this[fn].bind(this)));
  }

  handleMovementBlocks = () => {
    const items = document.querySelectorAll(".frontpage-carousell-block-item");
    items.forEach(el => {
      const style = window.getComputedStyle(el.querySelector(".animate-title"));
      const words = el.querySelector(".animate-title");
      if (this.isElementInViewport(words) && parseFloat(style.opacity) === 0) {
        this.fadeLetters(el.querySelectorAll(".animate-title"), "in");
        this.fadeLetters(el.querySelectorAll(".animate-project-info"), "in");
        this.fadeLetters(el.querySelectorAll(".animate-link"), "in");
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
    if (window.addEventListener) {
      window.addEventListener("scroll", this.handleMovementBlocks, false);
      window.addEventListener("resize", this.handleMovementBlocks, false);
    } else if (window.attachEvent) {
      window.attachEvent("onscroll", this.handleMovementBlocks);
      window.attachEvent("onresize", this.handleMovementBlocks);
    }
  }

  removeEvents() {
    if (window.addEventListener) {
      window.addEventListener("scroll", this.handleMovementBlocks, false);
      window.addEventListener("resize", this.handleMovementBlocks, false);
    } else if (window.attachEvent) {
      window.attachEvent("onscroll", this.handleMovementBlocks);
      window.attachEvent("onresize", this.handleMovementBlocks);
    }
  }

  carousellInit() {
    this.addEvents();
  }

  render() {
    const { projects } = this.props;
    return (
      <Layout>
        <Head title="Emil Privér - Developer in Borås" />
        <Nav />
        <div className="frontpage">
          <div
            className={`frontpage-carousell ${
              Math.abs(projects.length % 2) == 1 ? "odd" : "even"
            }`}
          >
            <div
              className="frontpage-carousell-block"
              ref={this.hero}
              id="hero"
            >
              <div className="container wrapper">
                <h1>
                  I am Emil Privér. A developer based in Borås, Sweden.
                  Currently working at
                  <a
                    href="https://rivercode.se"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    &nbsp;Rivercode
                  </a>
                  , Creating digital experiencies.
                </h1>
                <div className="socials">
                  <a
                    href="https://twitter.com/emil_priver"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Twitter.
                  </a>
                  <a
                    href="https://www.instagram.com/emil_priver/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Instagram.
                  </a>
                  <a
                    href="https://github.com/emilpriver"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Github.
                  </a>
                  <a
                    href="https://www.linkedin.com/in/emilpriver/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Linkedin.
                  </a>
                  <a
                    href="mailto:emil@priver.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mail.
                  </a>
                </div>
              </div>
            </div>
            <div>
              {projects.map((item, index) => (
                <div
                  className="project frontpage-carousell-block frontpage-carousell-block-item"
                  key={item.slug.current}
                >
                  <div className="frontpage-carousell-block-item-wrapper">
                    <Link
                      href="/project/[slug]"
                      as={`/project/${item.slug.current}`}
                    >
                      <a>
                        <div
                          className="image"
                          style={{ backgroundColor: item.background_color.hex }}
                        >
                          <LazyLoad offset={500}>
                            <img
                              src={imageURL(item.image_projects_page.asset)
                                .width(600)
                                .url()}
                              alt={item.title}
                            />
                          </LazyLoad>
                        </div>
                      </a>
                    </Link>
                    <div className="frontpage-carousell-block-item-title">
                      <div className="frontpage-carousell-block-item-title-wrapper">
                        <h2>
                          {item.title.split(" ").map((el, index) => {
                            return (
                              <div
                                className="animate-title"
                                key={item.title + index + el}
                              >
                                {el}
                              </div>
                            );
                          })}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </Layout>
    );
  }
}

export default Home;
