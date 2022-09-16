export default class ScrollItem {
  constructor(elm) {
    this.elm = elm;
    this.elmChildren = elm.querySelectorAll('.js-scroll-item-child');
    this.top = 0;
    this.bottom = 0;
  }
  init(scrollTop) {
    const rect = this.elm.getBoundingClientRect();
    this.top = scrollTop + rect.top;
    this.bottom = this.top + rect.height;
  }
  show(top, bottom) {

  }
}
