import { h, VNode } from "preact";

interface Props {
  docIndex: number;
  totalDocs: number;
  onChangeNav: (docIndex: number) => void;
}

const Nav = ({ docIndex, totalDocs, onChangeNav }: Props): VNode => {
  const onPrev = () => {
    onChangeNav(docIndex - 1);
  };
  const onNext = () => {
    onChangeNav(docIndex + 1);
  };

  return h("div", { className: "nav" }, [
    h("div", { className: "navLink", onClick: onPrev }, "<"),
    h("div", null, `${docIndex + 1} / ${totalDocs}`),
    h("div", { className: "navLink", onClick: onNext }, ">"),
  ]);
};

export default Nav;
