// Copyright (c) Stuart Quin
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from "@jupyter-widgets/base";

import { h, render } from "preact";

import { MODULE_NAME, MODULE_VERSION } from "./version";
import { Span } from "./annotate";
import Annotate from "./components/Annotate";
// Import the CSS
import "../css/widget.css";

export class AnnotateModel extends DOMWidgetModel {
  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };

  static model_name = "AnnotateModel";
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = "AnnotateView"; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class AnnotateView extends DOMWidgetView {
  render(): void {
    const docs = this.model.get("docs") || [];
    const labels = this.model.get("labels");
    // const initialSpans = this.model.get("spans");

    const app = h(
      "div",
      { className: "app" },
      h(Annotate, {
        docs,
        labels,
        onUpdateSpans: (spans: Span[][]) => this.handleChange(spans),
      })
    );

    render(app, this.el);
  }

  handleChange(spans: Span[][]): void {
    this.model.set("spans", spans);
    this.model.save_changes();
  }
}
