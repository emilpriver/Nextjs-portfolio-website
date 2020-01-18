import React from "react";
import Link from "next/link";
import anime from "animejs";
import axios from "axios";
import { Box } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import Head from "../components/head";
import Nav from "../components/nav";
import Slider from "../modules/slider";

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
      translateY: [100, 0],
      translateZ: 0,
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 1400,
      delay: function(el, i) {
        return 300 + 30 * i;
      }
    });

    const slide = new Slider({ scroll: true });
    slide.init();
  }

  render() {
    const { projects } = this.props;
    return (
      <>
        <Head title="Emil Privér - System Egineer in Borås" />
        <Nav />
        <section id="hero">
          <div className="container wrapper">
            <h1>
              <span className="anime-words">I am Emil Priver.</span>
              <br />
              <span className="anime-words">
                A system developer based in Borås, Sweden
              </span>
            </h1>
            <h3>
              <span className="anime-words">
                Currently working at Rivercode,
              </span>
              <br />
              <span className="anime-words">Creating digital experiences.</span>
            </h3>
          </div>
        </section>
        <section id="works">
          <div className="wrapper mx-auto">
            <h2 className="title">My Works</h2>
            <div className="js-slider-wrapper">
              <div className="js-slider">
                <div className="js-slider__inner">
                  {projects.map(item => (
                    <div
                      className="project js-slider__inner__item"
                      key={item.slug}
                    >
                      <div className="project_wrapper">
                        <div className="image">
                          <img
                            src={item.acf.thumbnail}
                            alt={item.title.rendered}
                          />
                        </div>
                        <div className="text">
                          <h4>{item.acf.project_info}</h4>
                          <h2>{item.title.rendered}</h2>
                          <Link href={`/project/${item.slug}`}>
                            <a> See Project</a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default Home;
