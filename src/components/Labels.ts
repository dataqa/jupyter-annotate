import { h, VNode } from "preact";

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

export default Labels;
