import { h, VNode } from "preact";
import { ColorLabel } from "../annotate";
import { HIGHLIGHT_COLORS } from "./colors";

const Label = ({
  label,
  isSelected,
  onClick,
}: {
  label: ColorLabel;
  isSelected: boolean;
  onClick: (label: ColorLabel) => void;
}) => {
  const className = isSelected ? "label selected" : "label";
  const color = HIGHLIGHT_COLORS[label.color] || HIGHLIGHT_COLORS.red;

  const borderColor = isSelected ? color[300] : color[800];

  const style = {
    borderLeft: `solid 4px ${borderColor}`,
  };

  return h(
    "div",
    { style, className, onClick: () => onClick(label) },
    label.text
  );
};

interface Props {
  labels: ColorLabel[];
  selectedLabel: ColorLabel;
  onChangeLabel: (label: ColorLabel) => void;
}

const Labels = ({ labels, selectedLabel, onChangeLabel }: Props): VNode => {
  return h(
    "div",
    { className: "labelContainer" },
    labels.map((label) =>
      h(Label, {
        label,
        isSelected: label.text === selectedLabel.text,
        onClick: onChangeLabel,
      })
    )
  );
};

export default Labels;
