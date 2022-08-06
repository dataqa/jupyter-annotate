import { h, VNode } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { Span } from "../annotate";

const SpanLabel = ({
  text,
  label,
  onClick,
}: {
  text: string;
  label: string;
  onClick: () => void;
}): VNode => {
  return h("span", { className: "span", onClick }, [
    text,
    h("span", { className: "spanLabel" }, label),
  ]);
};

const getHighlightedText = (
  text: string,
  spans: Span[],
  onRemoveSpan: (span: Span) => void
): VNode[] => {
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
      chunks.push(
        SpanLabel({
          text: span.text,
          label: span.label,
          onClick: () => onRemoveSpan(span),
        })
      );
      prevOffset = span.end;
    });
  chunks.push(h("span", { "data-offset": prevOffset }, text.slice(prevOffset)));

  return chunks;
};

interface Props {
  text: string;
  selectedLabel: string;
  spans: Span[];
  onUpdate: (span: Span[]) => void;
}

const Highlightable = ({
  text,
  selectedLabel,
  spans,
  onUpdate,
}: Props): VNode => {
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

  const onRemoveSpan = (span: Span) => {
    onUpdate(spans.filter((s) => s.start !== span.start));
  };

  useEffect(() => {
    const el: any = ref.current;
    if (el) {
      el.addEventListener("mouseup", onSelect);
    }
  }, [ref.current, onSelect]);

  return h(
    "div",
    { ref, className: "content" },
    getHighlightedText(text, spans, onRemoveSpan)
  );
};

export default Highlightable;
