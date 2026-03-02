/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Editor from "@/components/editor";
import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";
import { blockResolver } from "@/components/placement-tests/blocks";
import type { Answer, EditorValue } from "@/components/placement-tests/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Test } from "@/payload-types";
import { useStore } from "@/zustand/placement-test/provider";
import isFunction from "lodash-es/isFunction";
import isObject from "lodash-es/isObject";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HeadphonesIcon,
} from "lucide-react";
import Image from "next/image";
import { Fragment, type RefObject, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { handleSearch, handleSearchInEditor } from "../../entrance-test/utils";
import { AnswerExplainTable } from "../AnswerExplainTable";

const letters = ["A", "B", "C", "D", "E", "F"];

function Result({
  correctAnswer,
  passageRef,
  answerLocation,
  type = "multipleChoice",
  locateTime,
  skill,
  playerRef,
}: {
  correctAnswer?: string;
  passageRef: RefObject<HTMLDivElement | null>;
  answerLocation: string;
  type?: string;
  locateTime?: number;
  skill: string;
  playerRef: RefObject<HTMLAudioElement | null>;
}) {
  const handleSeek = () => {
    if (playerRef.current && locateTime) {
      playerRef.current.seekTo(locateTime);
    }
  };

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="text-[#6D737A] flex gap-2 items-center">
        Correct Answer:{" "}
        <div
          className={cn(
            "text-[#23BD33] font-bold",
            correctAnswer && correctAnswer.length <= 2
              ? "rounded-full flex items-center justify-center bg-[#23BD33]/10 border border-[#23BD33]/20 w-7 h-7 text-[12px] px-2"
              : "text-[14px]",
          )}
        >
          {correctAnswer}
        </div>
        {/* <Button variant="ghost" size="icon">
          <Image
            src="/question-circle.svg"
            alt="question-circle"
            width={24}
            height={24}
          />
        </Button> */}
        {answerLocation && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              skill === "reading"
                ? handleSearchInEditor(passageRef, answerLocation)
                : handleSearch(passageRef, answerLocation)
            }
          >
            <Image src="/compass.svg" alt="compass" width={24} height={24} />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {skill === "listening" && locateTime && (
          <Button variant="outline" className="h-10" onClick={handleSeek}>
            <HeadphonesIcon /> Listen from here
          </Button>
        )}
        <Button variant="outline" className="h-10">
          Report
        </Button>
      </div>
    </div>
  );
}

export default function AnswerExplain({
  selectedSection,
  listeningLength,
  setSection,
  currentSection,
  passageRef,
  skill,
  playerRef,
}: {
  selectedSection: number;
  listeningLength: number;
  setSection: (number: number) => void;
  currentSection: Test["listening"][0];
  passageRef: RefObject<HTMLParagraphElement | null>;
  skill: "listening" | "reading";
  playerRef: RefObject<HTMLAudioElement | null>;
}) {
  const setAnswer = useStore(useShallow((state) => state.setAnswer));
  const setSkillQuestionNo = useStore(
    useShallow((state) => state.setQuestionNo),
  );
  const getSkillQuestionNo = useStore(
    useShallow((state) => state.getQuestionNo),
  );
  const answerSheetFull = useStore(
    useShallow((state) => state.answerSheetFull),
  );
  const { description, sections } = currentSection;
  const part = selectedSection + 1;

  const currentAnswers = useMemo(() => {
    return answerSheetFull[skill]?.[part] || {};
  }, [answerSheetFull, skill, part]);

  const setQuestionNo = (questionId: string) => {
    setSkillQuestionNo(skill, questionId);
  };
  const getQuestionNo = (questionId: string) => {
    return getSkillQuestionNo(skill, questionId);
  };
  const handleNext = () => {
    if (selectedSection < listeningLength - 1) {
      setSection(selectedSection + 1);
    }
  };

  const handlePrev = () => {
    if (selectedSection > 0) {
      setSection(selectedSection - 1);
    }
  };
  return (
    <ScrollArea className="w-[50%] pr-6 border-r-2 border-[#CBCBCB] border-dashed relative">
      <div className="flex items-center justify-between">
        <div className="font-bold text-[28px] gap-2">
          <div className="text-left">
            {skill === "listening" ? "Part" : "Passage"} {part}:
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className={cn(
              "rounded-[8px] h-10 w-10 border border-[#F1F1F1] flex items-center justify-center",
              selectedSection === 0 ? "bg-[#A8ABB2] text-[A8ABB2]" : "",
            )}
            disabled={selectedSection === 0}
            onClick={handlePrev}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "rounded-[8px] h-10 w-10 border border-[#F1F1F1] flex items-center justify-center",
              selectedSection === listeningLength - 1
                ? "bg-[#A8ABB2] text-[A8ABB2]"
                : "",
            )}
            onClick={handleNext}
            disabled={selectedSection === listeningLength - 1}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
      {description && (
        <Editor
          value={description as EditorValue}
          theme={previewEditorTheme}
          mode="practice"
        />
      )}
      <div>
        <div>
          {sections?.map((section) => {
            return (
              <div key={section?.id}>
                <div className="relative mb-6 text-left">
                  <Editor
                    value={section?.description as EditorValue}
                    theme={previewEditorTheme}
                    mode="read_only"
                  />
                </div>
                <div className="text-left">
                  {section?.content.map((block, index) => {
                    const setListeningAnswer = ({
                      questionNumber,
                      ...payload
                    }: Answer) => {
                      setAnswer(skill, questionNumber, payload, String(part));
                    };
                    const BlockComponent = blockResolver[
                      block?.blockType
                    ] as any;

                    if (!BlockComponent) {
                      return null;
                    }
                    if (
                      [
                        "multipleChoice",
                        "trueFalseNotGiven",
                        "yesNoNotGiven",
                        "chooseTitle",
                      ].includes(block?.blockType)
                    ) {
                      const { questions } = block;
                      return (
                        <Fragment key={block.id ?? index}>
                          {questions?.map((q) => {
                            const { id, question, answerLocation, locateTime } =
                              q;
                            const questionNo =
                              (isFunction(getQuestionNo) && id
                                ? getQuestionNo(id)
                                : -1) ?? -1;

                            let displayAnswers = [];
                            if (
                              ["multipleChoice", "chooseTitle"].includes(
                                block.blockType,
                              )
                            ) {
                              displayAnswers = q.answer || [];
                            } else if (
                              block.blockType === "trueFalseNotGiven"
                            ) {
                              displayAnswers = [
                                {
                                  answer: "True",
                                  correctAnswer: q.correctAnswer === "true",
                                },
                                {
                                  answer: "False",
                                  correctAnswer: q.correctAnswer === "false",
                                },
                                {
                                  answer: "Not Given",
                                  correctAnswer:
                                    q.correctAnswer === "not_given",
                                },
                              ];
                            } else if (block.blockType === "yesNoNotGiven") {
                              displayAnswers = [
                                {
                                  answer: "Yes",
                                  correctAnswer: q.correctAnswer === "yes",
                                },
                                {
                                  answer: "No",
                                  correctAnswer: q.correctAnswer === "no",
                                },
                                {
                                  answer: "Not Given",
                                  correctAnswer:
                                    q.correctAnswer === "not_given",
                                },
                              ];
                            }

                            const correctIndex = displayAnswers.findIndex(
                              (a) => a.correctAnswer === true,
                            );

                            const correctAnswerForBubble =
                              correctIndex !== -1
                                ? letters[correctIndex]
                                : q.correctAnswer || null;

                            const userAnswer =
                              currentAnswers[questionNo as number]?.answer;

                            return (
                              <div key={id}>
                                <div className="text-left font-bold">
                                  <div>
                                    {questionNo}. {question}
                                    {displayAnswers.map((ans, index) => {
                                      const isUserAnswer =
                                        userAnswer === letters[index] ||
                                        (userAnswer &&
                                          typeof userAnswer === "string" &&
                                          userAnswer.toLowerCase() ===
                                            ans.answer?.toLowerCase());

                                      return (
                                        <div
                                          key={index}
                                          className="flex items-center gap-2 mb-2 mt-3"
                                        >
                                          <div
                                            className={cn(
                                              "border w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold",
                                              isUserAnswer
                                                ? "bg-[#E72929]/10 border-[#E72929]/20 text-[#E72929] shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
                                                : "border-[#E7EAE9] text-[#6D737A] bg-[#F8F8F8]",
                                            )}
                                          >
                                            {letters[index]}
                                          </div>
                                          <div
                                            className={cn(
                                              "text-[16px]",
                                              isUserAnswer
                                                ? "text-[#E72929] font-semibold"
                                                : "text-[#6D737A] font-normal",
                                            )}
                                          >
                                            {ans.answer}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <Result
                                    correctAnswer={correctAnswerForBubble}
                                    passageRef={passageRef}
                                    answerLocation={answerLocation}
                                    skill={skill}
                                    locateTime={locateTime}
                                    playerRef={playerRef}
                                  />

                                  <div>
                                    <AnswerExplainTable
                                      data={q}
                                      skill={skill}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </Fragment>
                      );
                    } else {
                      // if (block.blockType === "matchingParagraphInfo") {
                      if (!isObject(block?.questions?.correctAnswers)) {
                        return (
                          <Fragment key={block.id ?? index}>
                            <div className="text-left">
                              <BlockComponent
                                setAnswer={setListeningAnswer}
                                setQuestionNo={setQuestionNo}
                                getQuestionNo={getQuestionNo}
                                mode="view_result"
                                {...block}
                              />
                            </div>
                            {block?.questions?.map((q) => {
                              const {
                                id,
                                question,
                                correctAnswer,
                                answerLocation,
                                locateTime,
                              } = q;
                              const questionNo =
                                isFunction(getQuestionNo) && id
                                  ? getQuestionNo(id)
                                  : -1;

                              return (
                                <div key={id}>
                                  <div className="text-left font-bold">
                                    <div>
                                      {questionNo}. {question}
                                    </div>
                                    <Result
                                      correctAnswer={correctAnswer}
                                      passageRef={passageRef}
                                      answerLocation={answerLocation}
                                      skill={skill}
                                      locateTime={locateTime}
                                      playerRef={playerRef}
                                    />
                                    <div>
                                      <AnswerExplainTable
                                        data={q}
                                        skill={skill}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </Fragment>
                        );
                      } else {
                        const answers = block.questions.correctAnswers;

                        return (
                          <Fragment key={block.id ?? index}>
                            <BlockComponent
                              setAnswer={setListeningAnswer}
                              setQuestionNo={setQuestionNo}
                              getQuestionNo={getQuestionNo}
                              mode="view_result"
                              {...block}
                            />
                            {Object.keys(answers).map((id) => {
                              const questionNo =
                                isFunction(getQuestionNo) && id
                                  ? getQuestionNo(id)
                                  : -1;

                              return (
                                <div className="text-left font-bold" key={id}>
                                  <div>{questionNo}.</div>
                                  <Result
                                    correctAnswer={answers[id].answer}
                                    passageRef={passageRef}
                                    type={block.blockType}
                                    answerLocation={answers[id].answerLocation}
                                    skill={skill}
                                    locateTime={answers[id].locateTime}
                                    playerRef={playerRef}
                                  />

                                  <div>
                                    <AnswerExplainTable
                                      data={answers[id]}
                                      skill={skill}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </Fragment>
                        );
                      }
                    }
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}
