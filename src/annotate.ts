export interface Span {
  start: number;
  end: number;
  text: string;
  label: string;
}

interface Props {
  [key: string]: any;
}
interface Component {
  render: (props?: Props) => HTMLElement;
}

const Labels = (
  labels: string[],
  onLabelChange: (label: string) => void
): Component => {
  const el = document.createElement("div");
  el.classList.add("labelContainer");

  function render(props?: Props) {
    el.innerHTML = "";

    labels.forEach((label) => {
      const labelEl = document.createElement("div");
      labelEl.classList.add("label");
      if (label === props?.selectedLabel) {
        labelEl.classList.add("selected");
      }
      labelEl.innerHTML = label;
      labelEl.addEventListener("click", () => onLabelChange(label));
      el.appendChild(labelEl);
    });

    return el;
  }

  return {
    render,
  };
};

const Nav = (onNext: () => void, onPrev: () => void) => {
  const el = document.createElement("div");
  el.classList.add("nav");

  function render() {
    el.innerHTML = "";
    const prevEl = document.createElement("div");
    prevEl.classList.add("navLink", "prev");
    prevEl.innerHTML = "⏵";
    prevEl.addEventListener("click", onPrev);

    const nextEl = document.createElement("div");
    nextEl.classList.add("navLink", "next");
    nextEl.innerHTML = "⮕";
    nextEl.addEventListener("click", onNext);

    el.appendChild(prevEl);
    el.appendChild(nextEl);

    return el;
  }

  return { render };
};

const TopBar = (
  labels: string[],
  onLabelChange: (label: string) => void,
  onNext: () => void,
  onPrev: () => void
): Component => {
  const el = document.createElement("div");
  el.classList.add("topBar");
  const labelComponent = Labels(labels, onLabelChange);
  const navComponent = Nav(onNext, onPrev);

  function render(props?: Props) {
    el.innerHTML = "";
    el.appendChild(
      labelComponent.render({ selectedLabel: props?.selectedLabel })
    );
    el.appendChild(navComponent.render());
    return el;
  }

  return {
    render,
  };
};

export function annotate(
  initialText: string,
  labels: string[],
  initialSpans: Span[],
  onChange: (spans: Span[]) => void
): HTMLElement {
  // TODO this is state
  let spans = initialSpans || [];
  let selectedLabel = labels.length ? labels[0] : "";

  const wrapperEl = document.createElement("div");
  const contentEl = document.createElement("div");
  contentEl.classList.add("content");
  contentEl.innerHTML = initialText;

  const onChangeLabel = (label: string) => {
    if (selectedLabel !== label) {
      selectedLabel = label;
      navComponent.render({ selectedLabel });
    }
  };

  const onNext = () => {
    console.log("Next");
  };

  const onPrev = () => {
    console.log("Prev");
  };

  wrapperEl.innerHTML = "";
  const navComponent = TopBar(labels, onChangeLabel, onNext, onPrev);
  wrapperEl.appendChild(navComponent.render({ selectedLabel }));
  wrapperEl.appendChild(contentEl);

  function getSpanEl(text: string, span: Span) {
    const spanEl = document.createElement("span");
    spanEl.classList.add("span");
    const content = text.slice(span.start, span.end);
    spanEl.title = content;

    const spanLabelEl = document.createElement("span");
    spanLabelEl.classList.add("spanLabel");
    spanLabelEl.innerHTML = span.label;

    const spanContentEl = document.createElement("span");
    spanContentEl.innerHTML = content;

    spanEl.appendChild(spanContentEl);
    spanEl.appendChild(spanLabelEl);

    spanEl.addEventListener("click", () => {
      spans = spans.filter((s: Span) => s.start !== span.start);
      updateSpans();
    });

    return spanEl;
  }

  function renderSpans() {
    contentEl.innerHTML = "";
    contentEl.appendChild(getHighlightedText(initialText));
  }

  function updateSpans() {
    onChange(spans);
    renderSpans();
  }

  function getHighlightedText(text: string) {
    const textEl = document.createElement("div");
    let prevOffset = 0;

    spans
      .sort((a, b) => (a.start > b.start ? 1 : -1))
      .forEach((span) => {
        const prevEl = document.createElement("span");
        prevEl.dataset.offset = `${prevOffset}`;
        prevEl.innerHTML = text.slice(prevOffset, span.start);
        textEl.appendChild(prevEl);
        textEl.appendChild(getSpanEl(text, span));

        prevOffset = span.end;
      });

    const prevEl = document.createElement("span");
    prevEl.dataset.offset = `${prevOffset}`;
    prevEl.innerHTML = text.slice(prevOffset);
    textEl.appendChild(prevEl);

    return textEl;
  }

  function onSelect(event: any): void {
    const dataset = event.target?.dataset || {};
    const offset = parseInt(dataset.offset || "0", 10);
    const selected = window.getSelection();
    const selectedText = selected?.toString() || "";
    if (!selectedText.trim() || !selected) {
      return;
    }

    const start =
      selected.anchorOffset > selected.focusOffset
        ? selected.focusOffset
        : selected.anchorOffset;
    const end =
      selected.anchorOffset < selected.focusOffset
        ? selected.focusOffset
        : selected.anchorOffset;

    spans = spans.concat([
      {
        start: start + offset,
        end: end + offset,
        text: selectedText,
        label: selectedLabel,
      },
    ]);
    updateSpans();
  }

  contentEl.addEventListener("mouseup", onSelect);
  renderSpans();

  return wrapperEl;
}
