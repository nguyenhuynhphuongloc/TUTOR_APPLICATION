/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { formatTime } from "@/lib/utils";
import {
  Button,
  TextareaInput,
  TextInput,
  useAuth,
  useForm,
  useFormFields,
} from "@payloadcms/ui";
import { format } from "date-fns";
import pick from "lodash-es/pick";
import set from "lodash-es/set";
import { useCallback, useRef } from "react";

export type CommentItem = {
  locate_time: number;
  content: string;
  createdAt: string;
  createdBy: { fullName: string; avatarUrl: string; id: string };
  id: string;
};

export default function AudioCommentArrayField({
  audioUrl,
  locate,
}: {
  audioUrl: string;
  locate: Record<string, string>;
}) {
  const { value } = useFormFields(([fields]) => fields.answerSheet);
  const { setModified, dispatchFields: dispatch } = useForm();
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { part, topic, question } = locate;

  const getComment = (): CommentItem[] =>
    value.speaking?.[part]?.[topic]?.[question]?.comments || [];

  const setComment = useCallback(
    (newList: CommentItem[]) => {
      setModified(true);

      const newAnswerSheet = set(
        { ...value },
        `speaking.${part}.${topic}.${question}.comments`,
        newList,
      );

      dispatch({
        type: "UPDATE",
        path: "answerSheet",
        value: newAnswerSheet,
      });
    },
    [value.speaking],
  );

  const handleAdd = () => {
    const list = getComment();
    const createdAt = format(new Date(), "dd/MM/yyyy");
    const createdBy = pick(user, ["fullName", "avatarUrl", "id"]);

    if (!audioRef.current) return;
    audioRef.current.pause();

    const currentTime = Math.floor(audioRef.current.currentTime);

    const newItem: CommentItem = {
      id: String(list.length + 1),
      locate_time: currentTime,
      content: "",
      createdAt,
      createdBy,
    };

    setComment([...list, newItem]);
  };
  const handleRemove = (index: number) => {
    const list = getComment();
    const next = list.filter((_, i) => i !== index);
    setComment(next);
  };

  const handleChange = (
    index: number,
    field: "locate_time" | "content" | "createdAt" | "createdBy",
    v: string,
  ) => {
    const list = getComment();
    const next = list.map((item, i) =>
      i === index ? { ...item, [field]: v } : item,
    );
    setComment(next);
  };
  const comments = getComment();

  return audioUrl ? (
    <div>
      <audio ref={audioRef} src={audioUrl} controls>
        <source src={audioUrl} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl font-semibold">Comments</div>
        <Button
          buttonStyle="icon-label"
          className={`array-field__add-row`}
          icon="plus"
          iconPosition="left"
          iconStyle="with-border"
          onClick={handleAdd}
        >
          Add Comment
        </Button>
      </div>
      {comments.length === 0 ? (
        <div className="text-gray-500 italic">No data yet</div>
      ) : null}
      <div className="flex flex-col gap-4 mt-2">
        {comments.map((item, idx: number) => (
          <div
            key={idx}
            className="border rounded-lg p-4 bg-white flex flex-col"
          >
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold">Comment {idx + 1}</p>
              <Button
                iconStyle="with-border"
                buttonStyle="icon-label"
                className={`array-field__add-row self-end`}
                icon="x"
                onClick={() => handleRemove(idx)}
              />
            </div>

            <div className="flex justify-between gap-4">
              <TextInput
                label="Time Locate"
                value={formatTime(item?.locate_time ?? 0)}
                readOnly
                style={{ width: 80 }}
                path={`answerSheet.speaking.${part}.${topic}.${question}.comments.${idx}.locate_time`}
              />
              <TextareaInput
                label="Content"
                value={item?.content ?? ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleChange(idx, "content", e.target.value)
                }
                path={`answerSheet.speaking.${part}.${topic}.${question}.comments.${idx}.content`}
                style={{ flex: 1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <p>Không có file audio</p>
  );
}
