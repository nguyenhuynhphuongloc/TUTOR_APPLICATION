import { Category, Clipboard, MessageNotif } from "@/components/icons";
import StarDivider from "@/components/StarDivider/StarDivider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Word } from "@/payload-types";
import type { FeedbackItem } from "@/payload/components/array/feedback-field";
import { CircleAlert, MoveRight, XCircleIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { stringify } from "qs-esm";
import { type JSX, type RefObject, useEffect, useMemo, useState } from "react";
import { handleSearch } from "../../entrance-test/utils";
import CommentItem from "./CommentItem";
import VocabularySuggestion from "./VocabularySuggestion";

type TabItem = {
  name: string;
  label: string;
  icon: JSX.Element;
  content: JSX.Element;
};

export default function TabSwitch({
  mistakes,
  feedbacks,
  passageRef,
  wordCount,
  vocabs,
}: {
  feedbacks: FeedbackItem[];
  mistakes: { mistake?: string; feedback?: string; id: string; type: string }[];
  passageRef: RefObject<HTMLDivElement>;
  wordCount: number;
  vocabs: { label: string; value: string }[];
}) {
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    if (!vocabs || vocabs.length === 0) return;

    const stringifiedQuery = stringify(
      { where: { id: { in: vocabs.map((vocab) => vocab.value) } }, limit: 0 },
      { addQueryPrefix: true },
    );

    const fetchWords = async () => {
      const data = await fetch(`/api/words${stringifiedQuery}`)
        .then((res) => res.json())
        .then((res) => res.docs as Word[]);
      setWords(data);
    };

    fetchWords();
  }, [vocabs]);

  const handleOpenTab = (tab: string) => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  const tabs: TabItem[] = useMemo(
    () => [
      {
        name: "overview",
        label: "Overview",
        icon: Category,
        content: (
          <div className="text-[16px] flex items-center justify-between">
            <p className="font-medium">Words Count</p>
            <p className="font-semibold text-[#E72929]">{wordCount}</p>
          </div>
        ),
      },
      {
        name: "feedback",
        label: "Teacher Feedback",
        icon: MessageNotif,
        content: (
          <div className="flex flex-col gap-6">
            {feedbacks ? (
              feedbacks.map((feedback) => (
                <CommentItem
                  key={feedback.id}
                  data={feedback}
                  handleClick={handleSearch}
                  contentRef={passageRef}
                  type="feedback"
                />
              ))
            ) : (
              <p className="font-semibold text-[20px] text-center">
                Không có feedback
              </p>
            )}
          </div>
        ),
      },
      {
        name: "vocab",
        label: "Vocabulary Suggestion",
        icon: Clipboard,
        content: <VocabularySuggestion words={words} passageRef={passageRef} />,
      },
      {
        name: "mistakes",
        label: "Mistakes",
        icon: CircleAlert,
        content: (
          <div className="flex flex-col gap-6">
            {mistakes ? (
              mistakes.map(({ id, mistake, feedback, type }) => (
                <div key={id} className="text-[16px] flex items-center gap-2">
                  <div
                    className={cn(
                      "gap-1 flex items-center font-bold rounded-[10px] p-2",
                      type === "spelling"
                        ? "text-[#0D2585] bg-[#CDD7FE]"
                        : "text-[#12727D] bg-[#AEF4FC]",
                    )}
                  >
                    <s>{mistake}</s>
                  </div>
                  <MoveRight width={24} height={24} color="#E72929" />
                  <p className="font-medium text-[#6D737A] text-left">{`"${feedback}"`}</p>
                </div>
              ))
            ) : (
              <p className="font-semibold text-[20px] text-center">
                Không có mistake
              </p>
            )}
          </div>
        ),
      },
    ],
    [wordCount, feedbacks, mistakes, passageRef, words],
  );

  const active = tabs.find((t) => t.name === activeTab);

  return (
    <div className="flex gap-4">
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="rounded-[20px] border-2 border-dashed min-w-[354px]"
          >
            <div className="px-4 py-6 flex justify-between items-center">
              <p className="font-semibold text-[20px]">{active.label}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveTab(undefined)}
                className="rounded-full"
              >
                <XCircleIcon className="text-[#6D737A] cursor-pointer" />
              </Button>
            </div>
            <StarDivider />
            <div className="px-4 py-6">{active.content}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col gap-[27px]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <div
              key={tab.name}
              className={cn(
                "cursor-pointer group/item hover:bg-[#E72929] transition-colors duration-200 w-11 h-11 border border-[#E7EAE9] rounded-[12px] flex items-center justify-center",
                active?.name === tab.name && "bg-[#E72929]",
              )}
              onClick={() => handleOpenTab(tab.name)}
            >
              <Icon
                className={cn(
                  "group-hover/item:text-white",
                  active?.name === tab.name && "text-white",
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
