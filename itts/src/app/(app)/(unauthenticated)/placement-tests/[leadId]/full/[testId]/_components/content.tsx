"use client";

import type { Test } from "@/payload-types";

import Listening from "@/components/placement-tests/full/listening";
import Reading from "@/components/placement-tests/full/reading";
import Speaking from "@/components/placement-tests/full/speaking";
import Writing from "@/components/placement-tests/full/writing";

import { Media } from "@/components/media";
import { TOUR_STEP_IDS } from "@/constants";
import { useStore } from "@/zustand/placement-test/provider";

const COMPONENT_RESOLVER = {
  reading: Reading,
  writing: Writing,
  listening: Listening,
  speaking: Speaking,
};

export default function Content({
  data,
  part,
  testType,
}: {
  data: Test[];
  part: any;
  testType?: "placement" | "periodic";
}) {
  const selectedSkillIndex = useStore((s) => s.navigation.currentSkill);

  if (!data) return null;

  const skill = data[selectedSkillIndex];

  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!skill || !skill.type) {
    return null;
  }

  const Component = (COMPONENT_RESOLVER as any)[skill.type];

  if (!Component) {
    return null;
  }

  const listeningAudio = (skill as any)?.["listening-audio"];
  return (
    <div className="flex flex-col gap-4">
      {skill.type === "listening" && listeningAudio && (
        <div className="mb-4">
          <Media
            resource={listeningAudio}
            id={TOUR_STEP_IDS.LISTENING}
            disablePause={true}
          />
        </div>
      )}
      <Component {...skill} pickedParts={part} testType={testType} />
    </div>
  );
}
