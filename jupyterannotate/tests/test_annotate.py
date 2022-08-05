#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Stuart Quin.
# Distributed under the terms of the Modified BSD License.

import pytest

from jupyterannotate.annotate import AnnotateWidget


def test_annotate_widget():
    w = AnnotateWidget()
    assert w.spans == []
