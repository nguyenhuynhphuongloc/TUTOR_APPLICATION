"use client";

import { TextInput, useField } from "@payloadcms/ui";
import type { TextFieldLabelClientComponent } from "payload";
import React, { useEffect, useState } from "react";

const TimeInputField: TextFieldLabelClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<number>({ path });
  const [display, setDisplay] = useState("");

  // Convert seconds → mm:ss
  useEffect(() => {
    if (value != null) {
      const m = Math.floor(value / 60)
        .toString()
        .padStart(2, "0");
      const s = (value % 60).toString().padStart(2, "0");
      setDisplay(`${m}:${s}`);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDisplay(val);
    const match = val.match(/^(\d{1,2}):([0-5]\d)$/);
    if (match) {
      const seconds = parseInt(match[1]) * 60 + parseInt(match[2]);
      setValue(seconds);
    }
  };

  return (
    <div>
      <TextInput
        path={path}
        label={field?.label || field?.name}
        value={display}
        placeholder="mm:ss"
        onChange={handleChange}
        className="field-type text"
        required={field?.required}
      />
      <p style={{ color: "#888", marginTop: 8 }}>
        Hãy nhập thời gian dưới định dạng mm:ss ví dụ: {`[01:00]`}
      </p>
    </div>
  );
};

export default TimeInputField;
