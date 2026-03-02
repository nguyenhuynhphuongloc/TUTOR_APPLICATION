"use client";

import {
  CheckboxInput,
  TextareaInput,
  useForm,
  useFormFields,
} from "@payloadcms/ui";

function AnswerSheetFieldUI() {
  const answerSheetField = useFormFields(([fields]) => fields.answerSheet);
  const { setModified, dispatchFields: dispatch } = useForm();

  const answerSheetValue = answerSheetField?.value;

  if (!answerSheetValue) return null;

  const skills = Object.keys(answerSheetValue).reduce((acc, skill) => {
    const arrSkill = Object.values(answerSheetValue[skill]);
    const score = arrSkill.reduce((acc: number, answer: any) => {
      if (answer.isCorrect) {
        return acc + 1;
      }
      return acc;
    }, 0);
    const max = arrSkill.length;
    const correct = `${score}/${max}`;
    acc[skill] = {
      name: skill,
      score: score.toFixed(1),
      correct,
      max,
    };
    return acc;
  }, {});

  const onToggle = (questionNo: number) => {
    setModified(true);
    dispatch({
      type: "UPDATE",
      path: "answerSheet",
      value: {
        ...answerSheetValue,
        writing: {
          ...answerSheetValue.writing,
          [questionNo]: {
            ...answerSheetValue.writing[questionNo],
            isCorrect: !Boolean(
              answerSheetValue.writing[questionNo]?.isCorrect,
            ),
          },
        },
      },
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mt-8 gap-6">
        {Object.keys(skills).map((skill) => {
          const attr = skills[skill];
          return (
            <div
              key={attr.name}
              className="p-3 w-[193px] h-[78px] bg-white rounded-full border-[#E7EAE9] border flex items-center gap-3"
            >
              <div className="font-bold w-[54px] h-[54px] rounded-full bg-[#E729291A] border-[#E7292933] flex items-center justify-center text-[#E72929]">
                {attr.score}
              </div>
              <div>
                <p className="text-[#151515] font-semibold capitalize">
                  {attr.name}
                </p>
                <p className="text-[#6D737A]">{attr.correct}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-4">
        {Object.values(answerSheetValue?.writing ?? {}).map((writing, index) => {
          return (
            <div key={index} className="flex items-center gap-4 justify-center">
              <TextareaInput
                className="flex-1"
                label={`Writing ${index + 1}`}
                value={writing.answer}
                path={`answerSheet.writing.${index}.answer`}
                readOnly
              />
              <CheckboxInput
                label="Is Correct"
                checked={Boolean(writing.isCorrect)}
                onToggle={() => onToggle(index + 1)}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default AnswerSheetFieldUI;
