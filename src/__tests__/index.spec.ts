// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

// Add any needed widget imports here (or from controls)
// import {} from '@jupyter-widgets/base';

import { createTestModel } from "./utils";

import { AnnotateModel } from "..";

describe("AnnotateModel", () => {
  it("should be createable", () => {
    const model = createTestModel(AnnotateModel);
    expect(model).toBeInstanceOf(AnnotateModel);
  });

  it("should be createable with a value", () => {
    const state = { text: "Foo Bar!" };
    const model = createTestModel(AnnotateModel, state);
    expect(model).toBeInstanceOf(AnnotateModel);
    expect(model.get("text")).toEqual("Foo Bar!");
  });
});
