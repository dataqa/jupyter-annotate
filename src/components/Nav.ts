import { h, VNode } from "preact";

import ChevronRight from "./icons/ChevronRight";
import ChevronLeft from "./icons/ChevronLeft";

interface Props {
  docIndex: number;
  totalDocs: number;
  onChangeNav: (docIndex: number) => void;
}

const Nav = ({ docIndex, totalDocs, onChangeNav }: Props): VNode => {
  const onPrev = () => {
    if (docIndex > 0) {
      onChangeNav(docIndex - 1);
    }
  };
  const onNext = () => {
    if (docIndex < totalDocs - 1) {
      onChangeNav(docIndex + 1);
    }
  };

  return h("div", { className: "nav" }, [
    h(
      "div",
      { className: "navLink", onClick: onPrev, title: "Previous Document" },
      h(ChevronLeft, null)
    ),
    h("div", null, `${docIndex + 1} / ${totalDocs}`),
    h(
      "div",
      { className: "navLink", onClick: onNext, title: "Next Document" },
      h(ChevronRight, null)
    ),
  ]);
};

export default Nav;
