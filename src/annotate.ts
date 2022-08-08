export interface ColorLabel {
  text: string;
  color: string;
}

export interface Span {
  start: number;
  end: number;
  text: string;
  label: ColorLabel;
}
