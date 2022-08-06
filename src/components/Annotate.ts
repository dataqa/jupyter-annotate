import { h, VNode } from "preact";
import { useMemo, useState } from "preact/hooks";
import { Span } from "../annotate";

import TopBar from "./TopBar";
import Highlightable from "./Highlightable";

interface Props {
  docs: string[];
  labels: string[];
  onUpdateSpans: (span: Span[][]) => void;
}

export default function Annotate({
  docs,
  labels,
  onUpdateSpans,
}: Props): VNode {
  const totalDocs = docs.length;
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [docIndex, setDocIndex] = useState<number>(0);
  const [docSpans, setDocSpans] = useState<Span[][]>([]);

  const text = useMemo<string>(() => {
    return docs[docIndex];
  }, [docIndex, docs]);

  const onChangeLabel = (label: string) => {
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

  return h("div", null, [
    h(TopBar, {
      selectedLabel,
      labels,
      totalDocs,
      docIndex,
      onChangeLabel,
      onChangeNav,
    }),
    h(Highlightable, { text, selectedLabel, spans, onUpdate }),
  ]);
}
