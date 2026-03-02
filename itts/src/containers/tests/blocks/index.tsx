import Matching from "./matching";
import MatchingParagraphInfo from "./matching-paragraph-info";

import MultipleChoice from "./multiple-choice";
import TrueFalse from "./true-false";
import YesNo from "./yes-no";

import ShortAnswer from "./short-answer";

import Completion from "./completion";
import DiagramCompletion from "./diagram-completion";
import DiagramLabeling from "./diagram-labeling";

// function InProgress() {
//   return <div className="mb-6">Comming soon...</div>;
// }

export const blockResolver = {
  multipleChoice: MultipleChoice,
  shortAnswer: ShortAnswer,
  chooseTitle: MultipleChoice,
  yesNoNotGiven: YesNo,
  trueFalseNotGiven: TrueFalse,
  matchingHeading: Matching,
  matchingName: Matching,
  matchingInfo: Matching,
  matchingSentenceEnding: Matching,
  matchingParagraphInfo: MatchingParagraphInfo,
  flowChartCompletion: Completion,
  tableCompletion: Completion,
  summaryCompletion: Completion,
  sentenceCompletion: Completion,
  digramCompletion: DiagramCompletion,
  planMapDiagramLabeling: DiagramLabeling,
};
