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
      el: ".frontpage",
      inner: ".frontpage-carousell",
      slide: ".frontpage-carousell-block",
      ease: 0.1,
      speed: 1.5,
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

    this.lastY = 0;
    this.currentY = 0;

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

  componentWillUnmount() {
    this.removeEvents();
  }

  bind() {
    ["resize"].forEach(fn => (this[fn] = this[fn].bind(this)));
  }

  getClosestNumber(goal) {
    const parentSlide = this.slider.getBoundingClientRect();
    const slideWidth = parentSlide.width;
    const counts = [];

    this.slides.forEach((slide, index) => {
      counts.push(index * slideWidth);
    });

    return counts.reduce((prev, curr) => {
      return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
    });
  }

  getActiveIndex() {
    const closestNumber = this.getClosestNumber(Math.abs(this.currentX));
    const activeIndex = Math.floor(closestNumber / window.screen.height);
    return activeIndex;
  }

  async fadeInFirstElement() {
    const { projects } = this.props;
    const element = projects[this.getActiveIndex()];

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
    this.currentX += closest;
    this.clamp();
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

  setTransformTopPosition(event) {
    if (event.wheelDelta > 0) {
      this.sliderInner.style.transform = `translate3d(0, ${this.currentY -
        window.screen.height}px, 0) skewX(0)`;
      this.currentY = window.screen.height - this.currentY;
    } else {
      this.sliderInner.style.transform = `translate3d(0, ${this.currentY +
        window.screen.height}px, 0) skewX(0)`;
      this.currentY = window.screen.height + this.currentY;
    }
  }

  changeBlock = e => {
    console.log(e);
    this.setTransformTopPosition(e);
    this.lastY = this.lastY + window.screen.height;
  };

  addEvents() {
    window.addEventListener("wheel", this.changeBlock, { passive: true });

    window.addEventListener("resize", this.resize, false);
    window.onresize = this.resize;
  }

  removeEvents() {
    window.removeEventListener("wheel", this.changeBlock, {
      passive: true
    });

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
    document.body.scroll = "no";
    document.body.style.overflow = "hidden";
    document.height = window.innerHeight;
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
