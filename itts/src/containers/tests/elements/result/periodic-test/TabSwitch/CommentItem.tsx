/* eslint-disable react/display-name */
import { formatTime } from "@/lib/utils";
import type { CommentItem } from "@/payload/components/array/audio-comment-field";
import type { FeedbackItem } from "@/payload/components/array/feedback-field";
import { Calendar, GraduationCapIcon } from "lucide-react";
import { memo, type RefObject } from "react";

const CommentItem = memo(
  ({
    data,
    handleClick,
    contentRef,
    type = "feedback",
  }: {
    data: FeedbackItem | CommentItem;
    handleClick: (
      passageRef: RefObject<HTMLDivElement | null>,
      location: string,
    ) => void;
    contentRef?: RefObject<HTMLDivElement | null>;
    type: string;
  }) => {
    const { content, createdAt, createdBy } = data;

    const location =
      type === "feedback" ? data.feedback_location : data.locate_time;

    const onClick = () => {
      if (type === "comment") {
        return handleClick(location);
      }
      handleClick(contentRef, location);
    };

    return (
      <div
        className="text-[14px] hover:cursor-pointer hover:bg-[#F1F1F1] hover:rounded-[12px] p-2"
        onClick={onClick}
      >
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-full border flex items-center justify-center">
            {createdBy.avatarUrl || (
              <GraduationCapIcon width={16} height={16} />
            )}
          </div>
          <div>
            <p className="font-semibold text-left">{createdBy.fullName}</p>
            <div className="flex items-center justify-center gap-2 ">
              <Calendar width={16} height={16} />
              <p className="font-medium text-[#6D737A] text-[12px]">
                {createdAt}
              </p>
            </div>
          </div>
        </div>
        {type === "comment" ? (
          <div className="text-[#6D737A] text-left mt-3 whitespace-pre-line flex items-center gap-2">
            <p className="text-[#E72929] font-bold">{formatTime(location)}</p>
            {"-"}
            <p>{content}</p>
          </div>
        ) : (
          <p className="text-[#6D737A] text-left mt-3">{content}</p>
        )}
      </div>
    );
  },
);

export default CommentItem;
