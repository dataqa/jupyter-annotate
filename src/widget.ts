// Copyright (c) Stuart Quin
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
  WidgetModel,
} from "@jupyter-widgets/base";

import { h, render } from "preact";

import { MODULE_NAME, MODULE_VERSION } from "./version";
import { Span, PythonSpan, ColorLabel } from "./annotate";
import Annotate from "./components/Annotate";
// Import the CSS
import "../css/widget.css";
import { HIGHLIGHT_COLORS } from "./components/colors";

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

const getSpansFromPyton = (
  pythonSpans: PythonSpan[][],
  labels: ColorLabel[]
): Span[][] => {
  return pythonSpans.map((spans: PythonSpan[]) => {
    return spans.map((span) => {
      const label = labels.find((l) => l.text === span.label) || labels[0];
      return {
        ...span,
        label,
      };
    });
  });
};

export class AnnotateView extends DOMWidgetView {
  render(): void {
    const docs = this.model.get("docs") || [];
    const labels: string[] = this.model.get("labels");
    const initialSpans: PythonSpan[][] = this.model.get("spans") || [];

    const colors = Object.keys(HIGHLIGHT_COLORS);
    const colorLabels = labels.map((text, index) => ({
      text,
      color: colors[index % colors.length],
    }));

    const registerSpanChangeCallback = (
      callback: (spans: Span[][]) => void
    ) => {
      this.model.on(
        "change:spans",
        (model: WidgetModel) => {
          if (callback) {
            callback(getSpansFromPyton(model.changed.spans, colorLabels));
          }
        },
        this
      );
    };

    const app = h(
      "div",
      { className: "app" },
      h(Annotate, {
        docs,
        registerSpanChangeCallback,
        labels: colorLabels,
        initialSpans: getSpansFromPyton(initialSpans, colorLabels),
        onUpdateSpans: (spans: Span[][]) => this.handleChange(spans),
      })
    );

    render(app, this.el);
  }

  handleChange(spans: Span[][]): void {
    const pythonSpans: PythonSpan[][] = spans.map((s: Span[]) => {
      return s.map((span) => ({
        ...span,
        label: span.label.text,
      }));
    });
    this.model.set("spans", pythonSpans);
    this.model.save_changes();
  }
}
