import React from "react";
import anime from "animejs";
import Router from "next/router";
import groq from "groq";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";
import client from "../../sanity";
import Head from "../../components/head";
import Nav from "../../components/nav";
import Footer from "../../components/footer";
import Layout from "../../components/layout";
import Error from "../_error";

import "../../assets/scss/modules/single-project.module.scss";

function imageURL(source) {
  return imageUrlBuilder(client).image(source);
}

const projectQuery = groq`*[_type == "works" && slug.current == $slug][0]{
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
  blocks,
  created
}|order(created asc)`;

class Project extends React.Component {
  static async getInitialProps({ query }) {
    const { slug } = query;
    const data = await client.fetch(projectQuery, { slug });
    return { project: data };
  }

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
      if (word) {
        const style = window.getComputedStyle(word);
        if (this.isElementInViewport(word) && parseFloat(style.opacity) === 0) {
          this.fadeLetters(el.querySelectorAll(".animate-word"), "in");
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
    window.addEventListener(
      "DOMContentLoaded",
      this.handleMovementBlocks,
      false
    );
    Router.events.on("routeChangeComplete", this.handleMovementBlocks);
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

    if (!project) {
      return <Error />;
    }

    const blocks = project.blocks.map(el => {
      if (el.type_of_block === "large_image") {
        return (
          <div className="large-image single-project-blocks-item">
            <img
              src={imageURL(el.image)
                .auto("format")
                .url()}
              alt={project.title}
              className="w-full h-auto block"
            />
          </div>
        );
      }

      if (el.type_of_block === "text") {
        return (
          <div
            className={`${el.content_float} flex container mx-auto items-center single-project-blocks-item`}
          >
            <div style={{ maxWidth: `${el.max_width}px` }}>
              <BlockContent blocks={el.description} {...client.config()} />
            </div>
          </div>
        );
      }

      if (el.type_of_block === "container_image") {
        return (
          <div
            className="contaier-image single-project-blocks-item mx-auto"
            style={{ maxWidth: `${el.max_width}px` }}
          >
            <img
              src={imageURL(el.image)
                .maxWidth(el.max_width)
                .auto("format")
                .url()}
              alt={el.image_alt}
              className="w-full h-auto block"
            />
          </div>
        );
      }
    });

    return (
      <Layout>
        <Head
          ogImage={imageURL(project.thumbnail.asset)
            .auto("format")
            .url()}
          title={`Emil Privér - Project ${project.title}`}
          description={`Emil Privér - Project ${project.title} - ${project.project_info}`}
        />
        <Nav />
        <div
          className="single-project-hero"
          style={{
            backgroundImage: `url(${imageURL(project.thumbnail.asset)
              .auto("format")
              .url()})`
          }}
        />
        <div className="single-project-content w-full float-left">
          <div className="wrapper mx-auto">
            <h2 className="single-project-content-title has-animated-text float-left w-full">
              {project.title.split(" ").map((el, index) => {
                return (
                  <div
                    className="animate-word"
                    key={project.title + index + el}
                  >
                    {el}
                  </div>
                );
              })}
            </h2>
            <span className="single-project-content-project-init float-left w-full">
              {project.description ? (
                <div className="has-animated-text">
                  <div className="animate-word">
                    <BlockContent
                      blocks={project.description}
                      imageOptions={{ w: 320, h: 240, fit: "max" }}
                      {...client.config()}
                    />
                  </div>
                </div>
              ) : null}
            </span>
            <div className="single-project-content-project-cols">
              <div className="col has-animated-text">
                <span>
                  <div className="animate-word">CLIENT</div>
                </span>
                <span>
                  {project.customer_name.split(" ").map((el, index) => {
                    return (
                      <div className="animate-word" key={el}>
                        {el}
                      </div>
                    );
                  })}
                </span>
              </div>
              <div className="col has-animated-text">
                <span>
                  <div className="animate-word">WORK</div>
                </span>
                <span>
                  {project.project_info.split(" ").map((el, index) => {
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
                    href={project.website_url}
                  >
                    <span className="animate-word">{project.website_url}</span>
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="single-project-blocks">{blocks}</div>
        <Footer />
      </Layout>
    );
  }
}

export default Project;
