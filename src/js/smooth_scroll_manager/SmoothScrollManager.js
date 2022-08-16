const { debounce } = require('@ykob/js-util');
const isiOS = require('./isiOS');
const isAndroid = require('./isAndroid');
const Hookes = require('./Hookes').default;
const ScrollItems = require('./ScrollItems').default;

const contents = document.querySelector('.js-contents');
const dummyScroll = document.querySelector('.js-dummy-scroll');

export default class SmoothScrollManager {
  constructor() {
    this.scrollItems = new ScrollItems(this);
    this.scrollTop = 0;
    this.scrollFrame = 0;
    this.scrollTopPause = 0;
    this.resolution = {
      x: 0,
      y: 0
    };
    this.bodyResolution = {
      x: 0,
      y: 0
    };
    this.X_SWITCH_SMOOTH = 1024;
    this.hookes = {};
    this.scrollPrev = null;
    this.scrollNext = null;
    this.resizeReset = null;
    this.resizePrev = null;
    this.resizeNext = null;
    this.renderPrev = null;
    this.renderNext = null;
    this.isWorking = false;
    this.isWorkingSmooth = false;
    this.isAlreadyAddEvent = false;
  }
  start(callback) {
    setTimeout(() => {
      this.scrollTop = window.pageYOffset;

      this.initHookes();
      this.scrollItems.init();

      const { hash } = location;
      const target = (hash) ? document.querySelector(hash) : null;
      let anchorY = 0;
      if (target) {
        const targetRect = target.getBoundingClientRect();
        anchorY = this.scrollTop + targetRect.top;
      }

      this.resize(() => {
        this.scroll();
        this.isWorkingSmooth = true;
        this.renderLoop();
        this.on();
        if (callback) callback();
      });
    }, 100);
  }
  pause() {
    this.isWorking = false;
    contents.style.position = 'fixed';

    this.hookes.contents.velocity[1] = this.hookes.contents.anchor[1] = this.scrollTop * -1;
    this.scrollTopPause = this.scrollTop;
    window.scrollTo(0, this.scrollTop);
  }
  play() {
    contents.style.position = '';
    this.scrollTop = this.scrollTopPause;
    if (this.resolution.x <= this.X_SWITCH_SMOOTH) {
      this.hookes.contents.velocity[1] = this.hookes.contents.anchor[1] = 0;
    }
    window.scrollTo(0, this.scrollTop);
    this.isWorking = true;
  }
  initDummyScroll() {
    if (this.resolution.x <= this.X_SWITCH_SMOOTH) {
      contents.style.transform = '';
      contents.classList.remove('is-fixed');
      dummyScroll.style.height = `0`;
    } else {
      contents.classList.add('is-fixed');
      dummyScroll.style.height = `${contents.clientHeight}px`;
    }
    this.render();
  }
  initHookes() {
    this.hookes = {
      contents: new Hookes({ k: 0.575, d: 0.8 }),
      smooth:   new Hookes({ k: 0.18, d: 0.75 }),
      parallax: new Hookes({ k: 0.28, d: 0.7 }),
    }
  }
  scrollBasis() {
    if (this.resolution.x > this.X_SWITCH_SMOOTH) {
      this.hookes.contents.anchor[1] = this.scrollTop * -1;
      this.hookes.smooth.velocity[1] += this.scrollFrame;
      this.hookes.parallax.anchor[1] = this.scrollTop + this.resolution.y * 0.5;
    }

    this.scrollItems.scroll();
  }
  scroll(event) {
    if (this.isWorking === false) return;

    const pageYOffset = window.pageYOffset;
    this.scrollFrame = pageYOffset - this.scrollTop;
    this.scrollTop = pageYOffset;

    if (this.scrollPrev) this.scrollPrev();
    this.scrollBasis();
    if (this.scrollNext) this.scrollNext();
  }
  tilt(event) {
    if (this.isWorking === false) return;
    if (this.resolution.x > this.X_SWITCH_SMOOTH) {
      this.hookes.parallax.anchor[0] = (event.clientX / this.resolution.x * 2 - 1) * -100;
    }
  }
  resizeBasis() {
    this.scrollItems.resize();
  }
  resize(callback) {
    this.isWorking = false;

    if (this.resizeReset) this.resizeReset();

    this.scrollTop = window.pageYOffset;
    this.resolution.x = window.innerWidth;
    this.resolution.y = window.innerHeight;
    this.bodyResolution.x = document.body.clientWidth;
    this.bodyResolution.y = document.body.clientHeight;

    if (this.resolution.x > this.X_SWITCH_SMOOTH) {
      this.hookes.contents.velocity[1] = this.hookes.contents.anchor[1] = -this.scrollTop;
      this.hookes.parallax.velocity[1] = this.hookes.parallax.anchor[1] = this.scrollTop + this.resolution.y * 0.5;
    } else {
      for (var key in this.hookes) {
        switch (key) {
          case 'contents':
          case 'parallax':
            this.hookes[key].anchor[1] = this.hookes[key].velocity[1] = 0;
            break;
          default:
            this.hookes[key].velocity[1] = 0;
        }
      }
    }

    if (this.resizePrev) this.resizePrev();

    this.initDummyScroll();
    this.render();
    window.scrollTo(0, this.scrollTop);

    this.resizeBasis();
    if (this.resizeNext) this.resizeNext();

    this.isWorking = true;
    if (callback) callback();
  }
  render() {
    if (this.renderPrev) this.renderPrev();

    const y = Math.floor(this.hookes.contents.velocity[1] * 1000) / 1000;
    contents.style.transform = `translate3D(0, ${y}px, 0)`;

    for (var key in this.hookes) {
      this.hookes[key].render();
    }

    this.scrollItems.render(this.isValidSmooth());
    if (this.renderNext) this.renderNext();
  }
  renderLoop() {
    this.render();
    if (this.isWorkingSmooth) {
      requestAnimationFrame(() => {
        this.renderLoop();
      });
    }
  }
  on() {
    if (this.isAlreadyAddEvent) return;

    const hookEventForResize = (isiOS() || isAndroid()) ? 'orientationchange' : 'resize';

    window.addEventListener('scroll', (event) => {
      this.scroll(event);
    }, false);
    window.addEventListener('mousemove', (event) => {
      this.tilt(event);
    }, false);
    window.addEventListener(hookEventForResize, debounce((event) => {
      this.resize();
    }, 400), false);
    window.onafterunload = () => {
      window.scrollTo(0, 0);
    }

    this.isAlreadyAddEvent = true;
  }
  off() {
    this.scrollPrev = null;
    this.scrollNext = null;
    this.resizeReset = null;
    this.resizePrev = null;
    this.resizeNext = null;
    this.renderPrev = null;
    this.renderNext = null;
  }
  isValidSmooth() {
    return this.isWorkingSmooth && this.resolution.x > this.X_SWITCH_SMOOTH;
  }
}
