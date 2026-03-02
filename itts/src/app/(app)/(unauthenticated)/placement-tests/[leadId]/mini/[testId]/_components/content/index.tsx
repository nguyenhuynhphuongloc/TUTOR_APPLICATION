"use client";

import type { Test } from "@/payload-types";

import Grammar from "@/components/placement-tests/mini/grammar";
import Reading from "@/components/placement-tests/mini/reading";
import Vocabulary from "@/components/placement-tests/mini/vocabulary";
import Writing from "@/components/placement-tests/mini/writing";

import { useStore } from "@/zustand/placement-test/provider";
import { TOUR_STEP_MINI_IDS } from "../../root";

const COMPONENT_RESOLVER = {
  reading: Reading,
  writing: Writing,
  listening: null,
  speaking: null,
  grammar: Grammar,
  vocab: Vocabulary,
};

export default function Content({ data }: { data: Test[] }) {
  const selectedSkill = useStore((s) => s.navigation.currentSkill);

  if (!data) return null;

  const skill = data[selectedSkill];

  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!skill || !skill.type) {
    return null;
  }

  const Component = COMPONENT_RESOLVER[skill.type];

  if (!Component) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <h3
        className="text-[#151515] text-[32px] font-bold"
        id={TOUR_STEP_MINI_IDS.SKILL}
      >
        Instruction: This test is comprised of 4 modules (Grammar, Vocabulary,
        Reading &amp; Writing). Candidates&#39; time allowance is{" "}
        <span className="text-[#E72929]">30 minutes.</span>
      </h3>
      <Component {...skill} />
    </div>
  );
}
