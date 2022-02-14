const PADDING = 20;
const MIN_WIDTH = 300;

customElements.define("water-fall", class extends HTMLElement {
  observer = new ResizeObserver(([{borderBoxSize: [{inlineSize: width}]}]) => this.updateWidth(width));
  constructor() {
    super();
    this.observer.observe(this);
    this.addEventListener("resize", () => this.updateLayout())
  }

  lastWidth = 0;
  column = 2;
  columnWidth = 0;
  columnWidthWithPadding = 0;
  frame = -1;

  updateWidth(width) {
    if (this.lastWidth == width) return;
    this.lastWidth = width;
    this.column = width / MIN_WIDTH | 0;
    this.columnWidth = (width - PADDING * (this.column - 1)) / this.column;
    this.columnWidthWithPadding = this.columnWidth + PADDING;
    this.style.setProperty("--card-width", `${this.columnWidth}px`);
    this.style.setProperty("--card-width-padding", `${this.columnWidthWithPadding}px`);
  }

  updateLayout() {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.deferredUpdateLayout());
  }

  deferredUpdateLayout() {
    const arr = [...Array(this.column)].map(x => 0);
    let height = 0;
    for (const card of this.querySelectorAll("index-card")) {
      const idx = arr.reduce((r, v, i, a) => v > a[r] ? r : i, -1);
      card.style.setProperty("--column", idx + "");
      card.style.setProperty("--offset-y", arr[idx] + "px");
      height = arr[idx] += card.height + PADDING;
    }
    this.style.height = height + "px";
  }
});

customElements.define("index-card", class extends HTMLElement {
  observer = new ResizeObserver(([{borderBoxSize: [{blockSize: height}]}]) => this.height = height);

  constructor() {
    super();
    this.observer.observe(this);
  }

  _height = 0;

  set height(value) {
    if (this._height == value) return
    this._height = value;
    this.dispatchEvent(new CustomEvent("resize", { bubbles: true }));
  }

  get height() {
    return this._height;
  }
});
