"use client";

import { Fragment, useEffect, useState } from "react";

import Editor from "@/components/editor";
import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";

import { TourAlertDialog, TourStep, useTour } from "@/components/tour/tour";
import { TOUR_KEYS, TOUR_READING_IDS, TOUR_STEP_IDS } from "@/constants";
import type { Test } from "@/payload-types";
import { useStore } from "@/zustand/placement-test/provider";
import Image from "next/image";
import { useShallow } from "zustand/react/shallow";
import { blockResolver } from "../../blocks";
import type { Answer, EditorValue } from "../../types";

export const steps: TourStep[] = [
  {
    content: (
      <div>
        Here is the remaining time for the test. When the time is up, the system
        will automatically submit your answers.
      </div>
    ),
    selectorId: TOUR_STEP_IDS.TIMER,
    position: "right",
    isFixedElement: true,
  },
  {
    content: (
      <div>
        The test includes 4 skills:{" "}
        <b>Listening, Reading, Speaking and Writing</b>. Please read the
        instructions for each section carefully before you begin
      </div>
    ),
    selectorId: TOUR_STEP_IDS.SKILL,
    position: "left",
  },
  {
    content: (
      <div>
        Click to select an answer. You can change your answer before submitting
        the test.
        <Image
          src="/Tour_Pick_answer.png"
          alt="pick answer"
          width={350}
          height={200}
        />
      </div>
    ),
    selectorId: TOUR_STEP_IDS.PICK_ANSWER,
    position: "bottom",
  },
  // {
  //   content: (
  //     <div>
  //       In the <b>Reading</b> Section: Use your left mouse button to highlight
  //       text and select your preferred highlight color.
  //       <Image
  //         src="/Tour_Highlight.png"
  //         alt="highlight"
  //         width={200}
  //         height={200}
  //       />
  //     </div>
  //   ),
  //   selectorId: TOUR_STEP_IDS.HIGHLIGHT,
  //   position: "right",
  // },
  {
    content: <div>Use this panel to move between questions.</div>,
    selectorId: TOUR_STEP_IDS.SWITCH_QUESTION,
    position: "right",
  },
  // {
  //   content: (
  //     <div>
  //       <p>{`You can move on to the next skills here.`}</p>
  //       <p>
  //         <b>Note:</b> You cannot go back to the previous skills once you've
  //         moved on.
  //       </p>
  //     </div>
  //   ),
  //   selectorId: TOUR_STEP_IDS.SWITCH_SKILL,
  //   position: "right",
  // },
  {
    content: (
      <div>
        <b>Note: In Listening skill</b>
        <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
          <li>
            The audio will <b>play only once.</b>
          </li>
          <li>
            You <b>cannot pause</b>, rewind, or replay the audio.
          </li>
          <li>
            Make sure you are ready <b>before the audio starts.</b>.
          </li>
        </ul>
      </div>
    ),
    selectorId: TOUR_STEP_IDS.LISTENING,
    position: "bottom",
    isFixedElement: true,
  },
  {
    content: (
      <div>
        <b>{`You can press "Tab" to move between each question.`}</b>
      </div>
    ),
    selectorId: TOUR_STEP_IDS.TAB,
    position: "top",
  },
  {
    content: (
      <div>
        <p>{`Click here to submit your answers when you're finished.`}</p>
        <p>
          <b>Reminder:</b> Your progress is saved automatically. Do not refresh
          or close your browser during the test.
        </p>
      </div>
    ),
    selectorId: TOUR_STEP_IDS.SUBMIT,
    position: "bottom",
    isFixedElement: true,
  },
];
const Description = () => (
  <div>
    <p>
      Your first step toward studying abroad, immigration, and building a global
      career.
    </p>
    <p>
      We wish you the best of luck - this test is the first step in creating a
      personalized IELTS study plan tailored to your goals.
    </p>
    <p>Before you begin, please read the following instructions carefully:</p>
    <ul
      style={{ listStyleType: "disc", marginLeft: "20px", marginRight: "20px" }}
    >
      <li>
        Do <b>not</b> leave or close the test screen during the test.
      </li>
      <li>
        Each multiple-choice question has only <b>one correct answer</b>.
      </li>
      <li>
        The test can be taken <b>only once</b>.
      </li>
      <li>
        The system will <b>automatically submit</b> your answers when the time
        is up.
      </li>
    </ul>
    <p>
      {`When you're ready, click `}
      <b>{`"Start Tour" to get familiar with the test interface.`}</b>
    </p>
  </div>
);

function Listening({
  listening,
  "listening-audio": listeningAudio,
  pickedParts,
  testType,
}: Test & { testType?: "placement" | "periodic"; pickedParts?: any }) {
  const selectedSection = useStore(
    useShallow((s) => s.navigation.currentSection),
  );
  const filledAnswers = useStore(
    useShallow((s) => s.answerSheetFull.listening),
  );
  const setAnswer = useStore(useShallow((state) => state.setAnswer));
  const setSection = useStore(useShallow((s) => s.setSection));

  const setSkillQuestionNo = useStore(
    useShallow((state) => state.setQuestionNo),
  );
  const getSkillQuestionNo = useStore(
    useShallow((state) => state.getQuestionNo),
  );

  const { setSteps, isTourCompleted, setStorageKey } = useTour();
  const [openTour, setOpenTour] = useState(false);

  useEffect(() => {
    const key =
      testType === "periodic"
        ? TOUR_KEYS.PERIODIC_FULL_LISTENING
        : TOUR_KEYS.PLACEMENT_FULL_LISTENING;
    setStorageKey(key);
  }, [setStorageKey, testType]);

  useEffect(() => {
    if (!pickedParts) return;
    setSection(pickedParts[0] - 1);
  }, []);

  useEffect(() => {
    setSteps(steps);
    setOpenTour(true);
  }, [setSteps]);

  const setQuestionNo = (questionId: string) => {
    setSkillQuestionNo("listening", questionId);
  };
  const getQuestionNo = (questionId: string) => {
    return getSkillQuestionNo("listening", questionId);
  };

  useStore(useShallow((state) => state.questionNoMap));

  const currentSection = listening?.[selectedSection];
  const part = selectedSection + 1;

  if (!currentSection) {
    return null;
  }
  const { description, sections, listeningType } = currentSection;

  return (
    <Fragment>
      <TourAlertDialog
        isOpen={openTour}
        title="Welcome to IELTS The Tutors's Placement Test"
        setIsOpen={setOpenTour}
        description={<Description />}
      />
      <div className="">
        <div className="mb-[18px]">
          <div className="flex flex-col gap-6">
            <div className="font-bold uppercase text-[32px] text-[#E72929]">
              LISTENING {listeningType}
            </div>
            <div className="relative">
              <Editor
                key={`listening-part-${part}-description`}
                value={description as EditorValue}
                theme={previewEditorTheme}
                mode="practice"
                cacheKey={`listening-part-${part}-description`}
              />
            </div>
          </div>
        </div>
        <div>
          {sections?.map((section) => {
            return (
              <div key={section?.id}>
                <div className="relative mb-6" id={TOUR_READING_IDS.HIGHLIGHT}>
                  <Editor
                    key={`listening-part-${part}-section-${section?.id}`}
                    value={section?.description as EditorValue}
                    theme={previewEditorTheme}
                    mode="practice"
                    cacheKey={`listening-part-${part}-section-${section?.id}`}
                  />
                </div>
                <div>
                  {section?.content.map((block, index) => {
                    const setListeningAnswer = ({
                      questionNumber,
                      ...payload
                    }: Answer) => {
                      setAnswer(
                        "listening",
                        questionNumber,
                        payload,
                        String(part),
                      );
                    };
                    const BlockComponent = (blockResolver as any)[
                      block?.blockType
                    ];

                    if (!BlockComponent) {
                      return null;
                    }

                    return (
                      <BlockComponent
                        key={block.id ?? index}
                        filledAnswers={filledAnswers?.[part] as any}
                        setAnswer={setListeningAnswer as any}
                        setQuestionNo={setQuestionNo as any}
                        getQuestionNo={getQuestionNo as any}
                        mode="practice"
                        cacheKey={`listening-part-${part}-block-${block.id ?? index}`}
                        {...(block as any)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
}

export default Listening;
