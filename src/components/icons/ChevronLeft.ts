import { h, VNode } from "preact";

const ChevronLeft = (): VNode => {
  return h(
    "svg",
    {
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      "stroke-width": "2",
    },
    [
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        d: "M15 19l-7-7 7-7",
      }),
    ]
  );
};

export default ChevronLeft;
