import { SESSION_FEEDBACK_OPTIONS } from "@/constants";

/** Mapping feedback value → label dựa trên SESSION_FEEDBACK_OPTIONS */
export function mapFeedbackValueToLabel(name: string, value: string): string {
  if (name === "overall_score") return value; // Overall score hiện raw số/5
  if (name === "target") return value;

  const option = SESSION_FEEDBACK_OPTIONS.find((opt) => opt.name === name);
  if (!option) return value;
  if (option.type === "textarea") return value;
  const matched = option.options?.find((o) => o.value === value);
  return matched?.label ?? value;
}

/** Lấy Title cho các field không nằm trong SESSION_FEEDBACK_OPTIONS */
export function getFeedbackFieldTitle(name: string): string {
  if (name === "overall_score") return "Overall Score của tiết học hôm nay";
  if (name === "target") return "Target";
  if (name === "session") return "Buổi học";
  return name;
}
