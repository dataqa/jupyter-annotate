export interface Span {
  start: number;
  end: number;
  text: string;
  label: string;
}

export function annotate(
  initialText: string,
  labels: string[],
  initialSpans: Span[],
  onChange: (spans: Span[]) => void
): HTMLElement {
  // TODO this is state
  let spans = initialSpans || [];
  console.log('SPANS', spans);
  let selectedLabel = labels.length ? labels[0] : '';

  const wrapperEl = document.createElement('div');
  const labelContainerEl = document.createElement('div');
  labelContainerEl.classList.add('flex');
  labelContainerEl.classList.add('labelContainer');
  const contentEl = document.createElement('div');
  contentEl.classList.add('content');
  contentEl.innerHTML = initialText;

  wrapperEl.innerHTML = '';
  wrapperEl.appendChild(labelContainerEl);
  wrapperEl.appendChild(contentEl);

  function getSpanEl(text: string, span: Span) {
    const spanEl = document.createElement('span');
    spanEl.classList.add('span');
    const content = text.slice(span.start, span.end);
    spanEl.title = content;

    const spanLabelEl = document.createElement('span');
    spanLabelEl.classList.add('spanLabel');
    spanLabelEl.innerHTML = span.label;

    const spanContentEl = document.createElement('span');
    spanContentEl.innerHTML = content;

    spanEl.appendChild(spanContentEl);
    spanEl.appendChild(spanLabelEl);

    spanEl.addEventListener('click', () => {
      spans = spans.filter((s: Span) => s.start !== span.start);
      updateSpans();
    });

    return spanEl;
  }

  function renderLabels() {
    labelContainerEl.innerHTML = '';

    labels.forEach((label) => {
      const labelEl = document.createElement('div');
      labelEl.classList.add('label');
      if (label === selectedLabel) {
        labelEl.classList.add('selected');
      }
      labelEl.innerHTML = label;
      labelEl.addEventListener('click', () => {
        if (selectedLabel !== label) {
          selectedLabel = label;
          renderLabels();
        }
      });
      labelContainerEl.appendChild(labelEl);
    });
  }
  function renderSpans() {
    contentEl.innerHTML = '';
    contentEl.appendChild(getHighlightedText(initialText));
  }

  function updateSpans() {
    onChange(spans);
    renderSpans();
  }

  function getHighlightedText(text: string) {
    const textEl = document.createElement('div');
    let prevOffset = 0;

    spans
      .sort((a, b) => (a.start > b.start ? 1 : -1))
      .forEach((span) => {
        const prevEl = document.createElement('span');
        prevEl.dataset.offset = `${prevOffset}`;
        prevEl.innerHTML = text.slice(prevOffset, span.start);
        textEl.appendChild(prevEl);
        textEl.appendChild(getSpanEl(text, span));

        prevOffset = span.end;
      });

    const prevEl = document.createElement('span');
    prevEl.dataset.offset = `${prevOffset}`;
    prevEl.innerHTML = text.slice(prevOffset);
    textEl.appendChild(prevEl);

    return textEl;
  }

  function onSelect(event: any): void {
    const dataset = event.target?.dataset || {};
    const offset = parseInt(dataset.offset || '0', 10);
    const selected = window.getSelection();
    const selectedText = selected?.toString() || '';
    if (!selectedText.trim() || !selected) {
      return;
    }
    spans = spans.concat([
      {
        start: selected.anchorOffset + offset,
        end: selected.focusOffset + offset,
        text: selectedText,
        label: selectedLabel,
      },
    ]);
    updateSpans();
  }

  contentEl.addEventListener('mouseup', onSelect);
  renderLabels();
  renderSpans();

  return wrapperEl;
}
