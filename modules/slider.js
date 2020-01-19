function getClosest(item, array, getDiff) {
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
}

function number(item, array) {
  return getClosest(item, array, function(comparedItem, item) {
    return Math.abs(comparedItem - item);
  });
}

function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}

class Slider {
  constructor(options = {}) {
    this.bind();

    this.opts = {
      el: options.el || ".js-slider",
      inner: options.inner || ".js-slider--inner",
      slide: ".js-slider--inner--item",
      ease: options.ease || 0.1,
      speed: options.speed || 2,
      velocity: 50,
      scroll: options.scroll || false
    };

    this.slider = document.querySelector(this.opts.el);
    this.sliderInner = document.querySelector(this.opts.inner);
    this.slides = [...this.slider.querySelectorAll(this.opts.slide)];
    this.slidesNumb = this.slides.length;

    this.rAF = undefined;

    this.sliderWidth = 0;

    this.onX = 0;
    this.offX = 0;

    this.currentX = 0;
    this.lastX = 0;

    this.min = 0;
    this.max = 0;

    this.centerX = window.innerWidth / 2;
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
    this.lastX = lerp(this.lastX, this.currentX, this.opts.ease);
    this.lastX = Math.floor(this.lastX * 100) / 100;

    const sd = this.currentX - this.lastX;
    const acc = sd / window.innerWidth;
    const velo = +acc;

    this.sliderInner.style.transform = `translate3d(${
      this.lastX
    }px, 0, 0) skewX(${velo * this.opts.velocity}deg)`;

    this.requestAnimationFrame();
  }

  toggleActiveElement() {
    const parentSlide = this.slider.getBoundingClientRect();
    const activeIndex = Math.ceil(Math.abs(this.lastX) / parentSlide.width);

    this.slides.forEach((slide, index) => {
      if (
        slide &&
        index !== activeIndex &&
        slide.classList.contains("active")
      ) {
        slide.classList.remove("active");
      }
    });

    const activeElement = this.slides[activeIndex];
    if (activeElement) activeElement.classList.add("active");
  }

  on(e) {
    this.isDragging = true;
    this.onX = e.clientX;
    this.slider.classList.add("is-grabbing");
  }

  off(e) {
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

    let closest = number(0, numbers);
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
  }

  resize() {
    this.setBounds();
  }

  destroy() {
    this.removeEvents();

    this.opts = {};
  }

  init() {
    this.setBounds();
    this.addEvents();
  }
}

export default Slider;
