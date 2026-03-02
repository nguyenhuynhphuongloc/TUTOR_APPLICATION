"use client";

import { Suspense, lazy } from "react";
import type { FieldProps } from "./types";

const FieldComponent = lazy(async () => await import("./FieldComponent"));

export const LexicalRichTextFieldComponent = (props: FieldProps) => {
  return (
    <Suspense fallback={null}>
      <FieldComponent {...props} />
    </Suspense>
  );
};

export const LexicalRichTextCell = () => {
  return null;
};
