#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Stuart Quin.
# Distributed under the terms of the Modified BSD License.

import json
from os.path import exists

if exists("./package.json"):
    package_json = None
    with open("./package.json", "r") as package_json_file:
        package_json = json.loads(package_json_file.read())

    __version__ = package_json["version"]
else:
    __version__ = "0.0.0"

version_info = tuple(__version__.split("."))
