const PADDING = 20;
const MIN_WIDTH = 300;

customElements.define(
  "water-fall",
  class extends HTMLElement {
    observer = new ResizeObserver(
      () => this.updateWidth(this.offsetWidth - 30)
    );
    constructor() {
      super();
      this.observer.observe(this);
      this.addEventListener("resize", () => this.updateLayout());
    }

    lastWidth = 0;
    column = 2;
    frame = -1;

    updateWidth(width) {
      if (this.lastWidth == width) return;
      this.lastWidth = width;
      this.column = (width / MIN_WIDTH) | 0;
      const columnWidth = (width - PADDING * (this.column - 1)) / this.column;
      this.classList.toggle("multi-column", this.column > 1);
      this.style.setProperty("--card-width", `${columnWidth}px`);
      this.style.setProperty(
        "--card-width-padding",
        `${columnWidth + PADDING}px`
      );
      this.updateLayout();
    }

    updateLayout() {
      if (this.frame != -1) return;
      this.frame = requestAnimationFrame(() => {
        this.frame = -1;
        this.deferredUpdateLayout();
      });
    }

    deferredUpdateLayout() {
      const arr = [...Array(this.column)];
      let height = 0;
      let first = true;
      for (const card of this.querySelectorAll("index-card")) {
        if (first) {
          first = false;
          height = card.height + PADDING;
          arr.fill(height);
        } else {
          const idx = arr.reduce((r, v, i, a) => (v >= a[r] ? r : i), -1);
          card.style.setProperty("--column", idx + "");
          card.style.setProperty("--offset-y", arr[idx] + "px");
          height = arr[idx] += card.height + PADDING;
        }
      }
      this.style.height = height + "px";

      this.classList.toggle("updated", true);
    }
  }
);

customElements.define(
  "index-card",
  class extends HTMLElement {
    observer = new ResizeObserver(
      () => (this.height = this.offsetHeight)
    );

    constructor() {
      super();
      this.observer.observe(this);
    }

    _height = 0;

    set height(value) {
      if (this._height == value) return;
      this._height = value;
      this.dispatchEvent(new CustomEvent("resize", { bubbles: true }));
    }

    get height() {
      return this._height;
    }
  }
);
