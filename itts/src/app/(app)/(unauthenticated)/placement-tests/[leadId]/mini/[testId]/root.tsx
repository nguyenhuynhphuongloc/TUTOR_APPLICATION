"use client";

import type { PlacementAttempt, Test } from "@/payload-types";
import type { ProgressItem } from "./types";

import dynamic from "next/dynamic";

import ActionBar from "./_components/action-bar";
import Content from "./_components/content";

const NoSSRProgressBar = dynamic(() => import("./_components/progress-bar"), {
  ssr: false,
});

import { TourAlertDialog, TourStep, useTour } from "@/components/tour/tour";
import { StoreProvider } from "@/zustand/placement-test/provider";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const TOUR_STEP_MINI_IDS = {
  TIMER: "mini-timer",
  SKILL: "mini-skill",
  PICK_ANSWER: "mini-pick-answer",
  SWITCH_QUESTION: "mini-switch-question",
  SWITCH_SKILL: "mini-switch-skill",
  HIGHLIGHT: "mini-highlight",
  SUBMIT: "mini-submit",
};

export const steps: TourStep[] = [
  {
    content: <div>This shows how much time you have left.</div>,
    selectorId: TOUR_STEP_MINI_IDS.TIMER,
    isFixedElement: true,
    position: "right",
  },
  {
    content: <div>This test has 4 parts. Read the instructions first.</div>,
    selectorId: TOUR_STEP_MINI_IDS.SKILL,
    position: "bottom",
    isFixedElement: true,
  },
  {
    content: (
      <div>Click on your answer. You can change it before you finish.</div>
    ),
    selectorId: TOUR_STEP_MINI_IDS.PICK_ANSWER,
    position: "bottom",
    isFixedElement: true,
  },
  {
    content: (
      <div>
        Use your mouse to highlight words in the <b>Reading</b> section
        <Image
          src="/Tour_Highlight.png"
          alt="highlight"
          width={200}
          height={200}
        />
      </div>
    ),
    selectorId: TOUR_STEP_MINI_IDS.HIGHLIGHT,
    isFixedElement: true,
    position: "bottom",
  },
  {
    content: <div>Click here to move to other questions.</div>,
    selectorId: TOUR_STEP_MINI_IDS.SWITCH_QUESTION,
    position: "right",
  },
  {
    content: (
      <div>
        <p>Click here to go to other skills.</p>
      </div>
    ),
    selectorId: TOUR_STEP_MINI_IDS.SWITCH_SKILL,
    position: "right",
  },
  {
    content: (
      <div>
        <p>{`Click here when you finish the test.`}</p>
        <p>
          Your answers are saved automatically. Don’t close the page or refresh
          it.
        </p>
      </div>
    ),
    selectorId: TOUR_STEP_MINI_IDS.SUBMIT,
    position: "bottom",
  },
];

const Description = () => (
  <div>
    <p>Please read these rules before you start:</p>
    <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
      <li>
        <b>Do not</b> leave this screen while doing the test
      </li>
      <li>Only one answer is correct for each question.</li>
      <li>
        You can do the test just <b>once</b>.{" "}
      </li>
      <li>The test will finish automatically when the time is over.</li>
    </ul>
    <p>
      Click <b>Start Tour</b> when you are ready.
    </p>
  </div>
);

function Root({
  attempt,
  tests,
  progress,
}: {
  attempt: PlacementAttempt;
  tests: Test[];
  progress: ProgressItem[];
}) {
  const { setSteps, isTourCompleted } = useTour();
  const [openTour, setOpenTour] = useState(false);
  const hasOpenedTour = useRef(false);

  useEffect(() => {
    setSteps(steps);
    if (!hasOpenedTour.current) {
      hasOpenedTour.current = true;
      const timer = setTimeout(() => {
        setOpenTour(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [setSteps]);

  return (
    <StoreProvider>
      <TourAlertDialog
        isOpen={openTour}
        title="Welcome to IELTS The Tutors's Mini Test"
        setIsOpen={setOpenTour}
        description={<Description />}
      />
      <ActionBar
        startedAt={attempt.startedAt!}
        type={attempt.type}
        data={progress}
        isTourCompleted={isTourCompleted}
      />
      <div className="relative my-[116px] mx-auto max-w-[1440px] px-6">
        <Content data={tests} />
      </div>
      <NoSSRProgressBar data={progress} />
    </StoreProvider>
  );
}

export default Root;
