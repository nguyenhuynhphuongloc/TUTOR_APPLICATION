/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Button,
  TextareaInput,
  TextInput,
  useAuth,
  useField,
  useForm,
} from "@payloadcms/ui";
import { format } from "date-fns";
import { pick } from "lodash-es";
import { useCallback } from "react";

export type FeedbackItem = {
  feedback_location: string;
  content: string;
  createdAt: string;
  createdBy: { fullName: string; avatarUrl: string; id: string };
  id: string;
};

export default function FeedbackArray({ questionNo }: { questionNo: number }) {
  const { value, setValue } = useField({ path: "answerSheet" });
  const { user } = useAuth();
  const { setModified } = useForm();
  const getFeedbacks = () => value.writing?.[questionNo]?.feedbacks || [];

  const setFeedback = useCallback(
    (newList: FeedbackItem[]) => {
      setModified(true);
      const newAnswerSheet = {
        ...value,
        writing: {
          ...value.writing,
          [questionNo]: {
            ...value.writing[questionNo],
            feedbacks: newList,
          },
        },
      };
      setValue(newAnswerSheet);
    },
    [value.writing],
  );

  const handleAdd = () => {
    const list = getFeedbacks();
    const createdAt = format(new Date(), "dd/MM/yyyy");
    const createdBy = pick(user, ["fullName", "avatarUrl", "id"]);

    const newItem = {
      id: list.length + 1,
      feedback_location: "",
      content: "",
      createdAt,
      createdBy,
    };

    setFeedback([...list, newItem]);
  };

  const handleRemove = (index: number) => {
    const list = getFeedbacks();
    const next = list.filter((_, i) => i !== index);
    setFeedback(next);
  };

  const handleChange = (
    index: number,
    field: "feedback_location" | "content" | "createdAt" | "createdBy",
    v: string,
  ) => {
    const list = getFeedbacks();
    const next = list.map((item, i) =>
      i === index ? { ...item, [field]: v } : item,
    );
    setFeedback(next);
  };

  const feedbacks = getFeedbacks();

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl font-semibold">Feedbacks</div>
        <Button
          buttonStyle="icon-label"
          className={`array-field__add-row`}
          icon="plus"
          iconPosition="left"
          iconStyle="with-border"
          onClick={handleAdd}
        >
          Add Feedback
        </Button>
      </div>

      {feedbacks.length === 0 ? (
        <div className="text-gray-500 italic">No data yet</div>
      ) : null}

      <div className="flex flex-col gap-4 mt-2">
        {feedbacks.map((item, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-4 bg-white flex flex-col"
          >
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold">Feedback {idx + 1}</p>
              <Button
                iconStyle="with-border"
                buttonStyle="icon-label"
                className={`array-field__add-row self-end`}
                icon="x"
                onClick={() => handleRemove(idx)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label={`Feedback Location`}
                value={item?.feedback_location ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(idx, "feedback_location", e.target.value)
                }
                path={
                  "answerSheet.writing.feedbacks." + idx + ".feedback_location"
                }
              />

              <TextareaInput
                label="Content"
                value={item?.content ?? ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleChange(idx, "content", e.target.value)
                }
                path={"answerSheet.writing.feedbacks." + idx + ".content"}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
