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
    this.bind();

    this.state = {
      activeSlideProjectInfo: "",
      activeSlideTitle: "",
      activeSlideSlug: ""
    };

    this.opts = {
      el: ".js-slider",
      inner: ".js-slider--inner",
      slide: ".js-slider--inner--item",
      ease: 0.1,
      speed: 2,
      velocity: 25,
      scroll: false
    };

    if (process.browser) {
      this.slider = document.querySelector(this.opts.el);
      this.sliderInner = document.querySelector(this.opts.inner);
      this.slides = [...this.slider.querySelectorAll(this.opts.slide)];
      this.slidesNumb = this.slides.length;

      this.centerX = window.innerWidth / 2;
    }

    this.rAF = undefined;
    this.sliderWidth = 0;
    this.onX = 0;
    this.offX = 0;
    this.currentX = 0;
    this.lastX = 0;
    this.min = 0;
    this.max = 0;

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
    this.toggleActiveElement();
  }

  componentWillUnmount() {
    this.removeEvents();
  }

  bind() {
    ["setPos", "run", "on", "off", "resize"].forEach(
      fn => (this[fn] = this[fn].bind(this))
    );
  }

  setBounds() {
    const parentSlide = this.slider.getBoundingClientRect();
    const slideWidth = parentSlide.width;

    this.sliderWidth = this.slidesNumb * slideWidth;
    this.max = -(this.sliderWidth - window.innerWidth);

    this.slides.forEach((slide, index) => {
      slide.style.width = `${parentSlide.width}px`;
      slide.style.left = `${index * slideWidth}px`;
    });
  }

  setPos(e) {
    if (!this.isDragging) return;
    this.currentX = this.offX + (e.clientX - this.onX) * this.opts.speed;
    this.clamp();
  }

  clamp() {
    this.currentX = Math.max(Math.min(this.currentX, this.min), this.max);
  }

  run() {
    this.lastX = this.lerp(this.lastX, this.currentX, this.opts.ease);
    this.lastX = Math.floor(this.lastX * 100) / 100;

    const sd = this.currentX - this.lastX;
    const acc = sd / window.innerWidth;
    const velo = +acc;

    this.sliderInner.style.transform = `translate3d(${
      this.lastX
    }px, 0, 0) skewX(${velo * this.opts.velocity}deg)`;

    this.requestAnimationFrame();
  }

  getActiveIndex() {
    const parentSlide = this.slider.getBoundingClientRect();
    const activeIndex = Math.floor(Math.abs(this.currentX) / parentSlide.width);
    return activeIndex;
  }

  async setActiveElementContext() {
    const { projects } = this.props;
    const element = projects[this.getActiveIndex()];

    await this.fadeLetters(this.projectTextRef.current, "out").then(() => {
      this.setState(
        {
          activeSlideProjectInfo: element?.acf?.project_info,
          activeSlideTitle: element?.acf?.title,
          activeSlideSlug: element?.acf?.slug
        },
        () => {
          this.fadeLetters(this.projectTextRef.current, "in");
        }
      );
    });
  }

  toggleActiveElement() {
    const activeIndex = this.getActiveIndex();

    this.slides.forEach((slide, index) => {
      if (slide && index !== activeIndex) {
        slide.classList.remove("active");
      }
    });

    const activeElement = this.slides[activeIndex];
    if (activeElement) {
      activeElement.classList.add("active");
      this.setActiveElementContext();
    }
  }

  on(e) {
    this.isDragging = true;
    this.onX = e.clientX;
    this.slider.classList.add("is-grabbing");
  }

  off() {
    this.snap();
    this.isDragging = false;
    this.offX = this.currentX;
    this.slider.classList.remove("is-grabbing");
    this.toggleActiveElement();
  }

  closest() {
    const numbers = [];
    this.slides.forEach(slide => {
      const bounds = slide.getBoundingClientRect();
      const diff = this.currentX - this.lastX;
      const center = bounds.x + diff + bounds.width / 2;
      const fromCenter = this.centerX - center;
      numbers.push(fromCenter);
    });

    let closest = this.number(0, numbers);
    closest = numbers[closest];

    return {
      closest
    };
  }

  snap() {
    const { closest } = this.closest();
    this.currentX = this.currentX + closest;
    this.clamp();
  }

  requestAnimationFrame() {
    this.rAF = requestAnimationFrame(this.run);
  }

  cancelAnimationFrame() {
    cancelAnimationFrame(this.rAF);
  }

  addEvents() {
    this.run();

    this.slider.addEventListener("mousemove", this.setPos, { passive: true });
    this.slider.addEventListener("mousedown", this.on, false);
    this.slider.addEventListener("mouseup", this.off, false);
    this.slider.addEventListener("touchmove", this.setPos, { passive: true });
    this.slider.addEventListener("touchstart", this.on, false);
    this.slider.addEventListener("touchend", this.off, false);

    window.addEventListener("resize", this.resize, false);
    window.onresize = this.resize;
  }

  removeEvents() {
    this.cancelAnimationFrame(this.rAF);

    this.slider.removeEventListener("mousemove", this.setPos, {
      passive: true
    });
    this.slider.removeEventListener("mousedown", this.on, false);
    this.slider.removeEventListener("mouseup", this.off, false);
    this.slider.removeEventListener("touchmove", this.setPos, {
      passive: true
    });
    this.slider.removeEventListener("touchstart", this.on, false);
    this.slider.removeEventListener("touchend", this.off, false);

    window.removeEventListener("resize", this.resize);
  }

  resize() {
    this.setBounds();
  }

  destroy() {
    this.removeEvents();

    this.opts = {};
  }

  sliderInit() {
    this.setBounds();
    this.addEvents();
    setTimeout(() => {
      this.toggleActiveElement();
      this.setActiveElementContext();
    }, 200);
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

  getClosest = (item, array, getDiff) => {
    var closest;
    var diff;

    if (!Array.isArray(array)) {
      throw new Error("Get closest expects an array as second argument");
    }

    array.forEach(function(comparedItem, comparedItemIndex) {
      var thisDiff = getDiff(comparedItem, item);

      if (thisDiff >= 0 && (typeof diff == "undefined" || thisDiff < diff)) {
        diff = thisDiff;
        closest = comparedItemIndex;
      }
    });

    return closest;
  };

  number = (item, array) => {
    return this.getClosest(item, array, function(comparedItem, item) {
      return Math.abs(comparedItem - item);
    });
  };

  lerp = (a, b, n) => {
    return (1 - n) * a + n * b;
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
            <h2 className="title">Latest Works</h2>
            <div className="js-slider-wrapper">
              <div className="js-slider">
                <div className="js-slider--inner">
                  {projects.map(item => (
                    <div
                      className="project js-slider--inner--item"
                      key={item.acf.slug}
                    >
                      <div className="project_wrapper">
                        <div className="image">
                          <img
                            src={item.acf.thumbnail}
                            alt={item.title.rendered}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="project--text" ref={this.projectTextRef}>
              <div className="project--text-wrapper">
                <h4 className="toggle-transition-element">
                  <div className="words">{activeSlideProjectInfo}</div>
                </h4>
                <h2 className="toggle-transition-element">
                  <div className="words">{activeSlideTitle}</div>
                </h2>
                <Link href={`/project/${activeSlideSlug}`}>
                  <a className="toggle-transition-element">
                    <div className="words">Go</div>
                    <div className="words">To</div>
                    <div className="words">Project</div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default Home;
