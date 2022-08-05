// Copyright (c) Stuart Quin
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import { MODULE_NAME, MODULE_VERSION } from './version';
import { annotate, Span } from './annotate';
// Import the CSS
import '../css/widget.css';

export class ExampleModel extends DOMWidgetModel {
  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };

  static model_name = 'ExampleModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'ExampleView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class ExampleView extends DOMWidgetView {
  render() {
    const text = this.model.get('text');
    const labels = this.model.get('labels');
    const initialSpans = this.model.get('spans');

    this.el.appendChild(
      annotate(text, labels, initialSpans, (spans) => this.handleChange(spans))
    );
  }

  handleChange(spans: Span[]) {
    this.model.set('spans', spans);
    this.model.save_changes();
  }
}
