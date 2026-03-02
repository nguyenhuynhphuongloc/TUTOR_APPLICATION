"use client";

import { FieldLabel, useField } from "@payloadcms/ui";
import dynamic from "next/dynamic";
import { type JSX } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { cn } from "@/lib/utils";

import type { FieldProps, FieldValue } from "./types";

import "./FieldComponent.css";

const Editor = dynamic(() => import("@/components/editor"));

function fallbackRender({ error }: { error: Error }): JSX.Element {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

const FieldComponent = (props: FieldProps) => {
  const {
    field: { label, name, required },
    path,
  } = props;
  const { value, setValue } = useField<FieldValue>({ path: path || name });

  return (
    <div className={cn("field-type custom-editor")}>
      <FieldLabel
        htmlFor={`field-${path.replace(/\./gi, "__")}`}
        label={label}
        required={required}
      />
      <ErrorBoundary fallbackRender={fallbackRender}>
        <Editor value={value} setValue={setValue} />
      </ErrorBoundary>
    </div>
  );
};

export default FieldComponent;
