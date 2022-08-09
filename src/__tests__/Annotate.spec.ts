import { h } from "preact";
import { faker } from "@faker-js/faker";

import { render, fireEvent, waitFor } from "@testing-library/preact";
import Annotate from "../components/Annotate";

const RANGE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const LABELS = RANGE.map(() => faker.random.word());
const DOCUMENTS = RANGE.map(() => faker.hacker.phrase());

describe("Annotate", () => {
  beforeEach(() => {
    const originalSelection = window.getSelection();
    window.getSelection = () => {
      return {
        ...originalSelection,
        toString: () => "Test",
        anchorOffset: 8,
        focusOffset: 12,
      } as Selection;
    };
  });

  test("should navigate between docs", async () => {
    const { container, findByText, findByTitle } = render(
      h(Annotate, {
        labels: LABELS,
        initialSpans: [],
        onUpdateSpans: jest.fn(),
        docs: DOCUMENTS,
      })
    );

    expect(container.textContent).toContain(DOCUMENTS[0]);
    expect(container.textContent).toContain("1 / 10");
    fireEvent.click(await findByTitle("Next Document"));
    await findByText(DOCUMENTS[1]);
    expect(container.textContent).not.toContain(DOCUMENTS[0]);
    expect(container.textContent).toContain("2 / 10");
  });

  test("should apply new span", async () => {
    const onUpdateSpans = jest.fn();
    const docs = [faker.lorem.sentence(20)];
    const { findByText, findByTitle } = render(
      h(Annotate, {
        labels: LABELS,
        initialSpans: [],
        onUpdateSpans,
        docs,
      })
    );

    const highlightableEl = await findByText(docs[0]);
    fireEvent.mouseUp(highlightableEl);

    const targetText = docs[0].slice(8, 12);
    await waitFor(() =>
      expect(onUpdateSpans).toHaveBeenCalledWith([
        [
          {
            start: 8,
            end: 12,
            text: targetText,
            label: { color: "red", text: LABELS[0] },
          },
        ],
      ])
    );

    const span = await findByTitle(LABELS[0]);
    expect(span.textContent).toEqual(targetText);
  });
});
