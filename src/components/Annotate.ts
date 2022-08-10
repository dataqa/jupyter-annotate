import { h, VNode } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { ColorLabel, Span } from "../annotate";

import TopBar from "./TopBar";
import Highlightable from "./Highlightable";
import { HIGHLIGHT_COLORS } from "./colors";

interface Props {
  docs: string[];
  labels: string[];
  initialSpans: Span[][];
  onUpdateSpans: (span: Span[][]) => void;
  registerSpanChangeCallback: (callback: (span: Span[][]) => void) => void;
}

export default function Annotate({
  docs,
  labels,
  initialSpans,
  registerSpanChangeCallback,
  onUpdateSpans,
}: Props): VNode {
  const totalDocs = docs.length;
  const [selectedLabel, setSelectedLabel] = useState<ColorLabel>();
  const [docIndex, setDocIndex] = useState<number>(0);
  const [docSpans, setDocSpans] = useState<Span[][]>(
    initialSpans.length
      ? initialSpans
      : [...Array(totalDocs).keys()].map(() => [])
  );

  const text = useMemo<string>(() => {
    return docs[docIndex];
  }, [docIndex, docs]);

  useEffect(() => {
    registerSpanChangeCallback((spans: Span[][]) => {
      setDocSpans(spans);
    });
  }, []);

  const onChangeLabel = (label: ColorLabel) => {
    setSelectedLabel(label);
  };

  const onUpdate = (changedSpans: Span[]) => {
    const updatedSpans = [...docSpans];
    updatedSpans[docIndex] = changedSpans;
    setDocSpans(updatedSpans);
    onUpdateSpans(updatedSpans);
  };

  const onChangeNav = (docIndex: number) => {
    setDocIndex(docIndex);
  };

  const spans = docSpans[docIndex] || [];

  const coloredLabels = useMemo(() => {
    const colors = Object.keys(HIGHLIGHT_COLORS);
    return labels.map((text, index) => ({
      text,
      color: colors[index % colors.length],
    }));
  }, [labels]);

  const activeLabel = selectedLabel || coloredLabels[0];

  return h("div", null, [
    h(TopBar, {
      selectedLabel: activeLabel,
      labels: coloredLabels,
      totalDocs,
      docIndex,
      onChangeLabel,
      onChangeNav,
    }),
    h(Highlightable, { text, selectedLabel: activeLabel, spans, onUpdate }),
  ]);
}
