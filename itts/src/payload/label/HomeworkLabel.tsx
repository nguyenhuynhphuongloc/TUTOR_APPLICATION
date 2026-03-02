"use client";

import { useField } from "@payloadcms/ui";
import type { RelationshipFieldLabelClientComponent } from "payload";

const HomeworkLabel: RelationshipFieldLabelClientComponent = (props) => {
  const { path } = props;
  const { value: sessionValues } = useField({ path: "sessions" });

  const index = Number(path!.split(".")[1]);

  const isMidTerm = index === Math.floor(sessionValues / 2) - 1;

  const isFinalTerm = index === sessionValues - 1;

  if (isMidTerm)
    return (
      <label className="field-label font-bold text-[#E72929]">
        Bài thi giữa kỳ
      </label>
    );
  if (isFinalTerm)
    return (
      <label className="field-label font-bold text-[#E72929]">
        Bài thi cuối kỳ
      </label>
    );
  return <label className="field-label">Bài tập về nhà</label>;
};

export default HomeworkLabel;
