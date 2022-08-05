import { h, VNode } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { Span } from "../annotate";

const SpanLabel = ({ text, label }: { text: string; label: string }): VNode => {
  return h("span", { className: "span" }, [
    text,
    h("span", { className: "spanLabel" }, label),
  ]);
};

const Labels = ({
  labels,
  selectedLabel,
  onChangeLabel,
}: {
  labels: string[];
  selectedLabel: string;
  onChangeLabel: (label: string) => void;
}): VNode => {
  const labelNodes = labels.map((label) => {
    const className = label === selectedLabel ? "label selected" : "label";

    return h("div", { className, onClick: () => onChangeLabel(label) }, label);
  });
  return h("div", { className: "labelContainer" }, labelNodes);
};

const getHighlightedText = (text: string, spans: Span[]): VNode[] => {
  const chunks: VNode[] = [];
  let prevOffset = 0;

  spans
    .sort((a, b) => (a.start > b.start ? 1 : -1))
    .forEach((span) => {
      chunks.push(
        h(
          "span",
          { "data-offset": prevOffset },
          text.slice(prevOffset, span.start)
        )
      );
      chunks.push(SpanLabel({ text: span.text, label: span.label }));
      prevOffset = span.end;
    });
  chunks.push(h("span", { "data-offset": prevOffset }, text.slice(prevOffset)));

  return chunks;
};

function Highlightable({
  text,
  selectedLabel,
  spans,
  onUpdate,
}: {
  text: string;
  selectedLabel: string;
  spans: Span[];
  onUpdate: (spans: Span[]) => void;
}): VNode {
  const ref = useRef(null);

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

    onUpdate(
      spans.concat([
        {
          start: start + offset,
          end: end + offset,
          text: selectedText,
          label: selectedLabel,
        },
      ])
    );
  }

  useEffect(() => {
    const el: any = ref.current;
    if (el) {
      el.addEventListener("mouseup", onSelect);
    }
  }, [ref.current, onSelect]);

  return h(
    "div",
    { ref, className: "content" },
    getHighlightedText(text, spans)
  );
}

export default function Annotate({ text, labels, onUpdateSpans }: any): VNode {
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [spans, setSpans] = useState<Span[]>([]);
  const onChangeLabel = (label: string) => {
    setSelectedLabel(label);
  };

  const onUpdate = (updatedSpans: Span[]) => {
    setSpans(updatedSpans);
    onUpdateSpans(updatedSpans);
  };

  return h("div", null, [
    h(
      "div",
      { className: "topBar" },
      h(Labels, { selectedLabel, labels, onChangeLabel })
    ),
    h(Highlightable, { text, selectedLabel, spans, onUpdate }),
  ]);
}
