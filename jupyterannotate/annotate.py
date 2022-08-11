#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Stuart Quin.
# Distributed under the terms of the Modified BSD License.

from ipywidgets import DOMWidget, ValueWidget
from traitlets import Unicode, List
from ._frontend import module_name, module_version


class AnnotateWidget(DOMWidget, ValueWidget):
    """Interactive text annotation widget for Jupyter

    Keyword arguments:
    docs -- List of string documents (required)
    labels -- List of labels (default [])
    spans -- List of Lists containing span dicts, (default [])

    span dict format:
    {'start': 2, 'end': 7, 'text': 'Hello', 'label': 'Test'},
    """

    _model_name = Unicode("AnnotateModel").tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode("AnnotateView").tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    docs = List(trait=Unicode()).tag(sync=True)
    spans = List([]).tag(sync=True)
    labels = List([]).tag(sync=True)
