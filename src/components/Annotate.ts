import { h, VNode } from "preact";
import { useState } from "preact/hooks";
import { Span } from "../annotate";

import TopBar from "./TopBar";
import Highlightable from "./Highlightable";

interface Props {
  text: string;
  labels: string[];
  onUpdateSpans: (span: Span[]) => void;
}

export default function Annotate({
  text,
  labels,
  onUpdateSpans,
}: Props): VNode {
  const totalDocs = 15;
  const docIndex = 5;
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [spans, setSpans] = useState<Span[]>([]);
  const onChangeLabel = (label: string) => {
    setSelectedLabel(label);
  };

  const onUpdate = (updatedSpans: Span[]) => {
    setSpans(updatedSpans);
    onUpdateSpans(updatedSpans);
  };

  const onChangeNav = (docIndex: number) => {
    console.log(docIndex);
  };

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
