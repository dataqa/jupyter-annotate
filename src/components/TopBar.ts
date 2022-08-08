import { h, VNode } from "preact";
import { ColorLabel } from "../annotate";
import Labels from "./Labels";
import Nav from "./Nav";

interface Props {
  labels: ColorLabel[];
  selectedLabel: ColorLabel;
  docIndex: number;
  totalDocs: number;
  onChangeLabel: (label: ColorLabel) => void;
  onChangeNav: (docIndex: number) => void;
}

const TopBar = ({
  labels,
  selectedLabel,
  docIndex,
  totalDocs,
  onChangeLabel,
  onChangeNav,
}: Props): VNode => {
  return h("div", { className: "topBar" }, [
    h(Labels, { labels, selectedLabel, onChangeLabel }),
    h(Nav, { docIndex, totalDocs, onChangeNav }),
  ]);
};

export default TopBar;
