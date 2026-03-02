import { cn } from "@/lib/utils";

const answerMapping = {
  true: "True",
  false: "False",
  not_given: "Not Given",
};

/**
 * Renders an answer with a "!" if the answer is not given.
 *
 * @param {{
 *   isPdf: boolean;
 *   isCorrect: boolean;
 *   correctAnswers: string | string[];
 *   answer: string | undefined;
 * }} props
 * @returns {React.ReactElement}
 */
function Answer({
  isPdf,
  isCorrect,
  correctAnswers,
  answer,
  number,
}: {
  isPdf: boolean;
  isCorrect: boolean;
  correctAnswers: string | string[];
  answer: string | undefined;
  number: number;
}): React.ReactElement {
  return (
    <div className="grid grid-cols-[auto,1fr] gap-2 items-center">
      <div
        className={cn(
          "w-10 h-10 rounded-full flex border items-center justify-center font-bold text-[16px] text-center",
          isCorrect
            ? "bg-[#23BD331A] border-[#23BD3333] text-[#23BD33]"
            : answer
              ? "bg-[#E729291A]  border-[#E7292933] text-[#E72929]"
              : "bg-[#EBA3521A] border-[#EBA35233] text-[#EBA352]",
        )}
      >
        <span style={{ marginTop: isPdf ? -14 : 0 }}>{number}</span>
      </div>

      <div
        className={cn(
          "ml-2 text-[16px] font-semibold flex flex-wrap break-words whitespace-normal",
          isCorrect ? "text-[#23BD33]" : "text-[#E72929]",
        )}
        style={{ marginTop: isPdf ? -18 : 0 }}
      >
        {answer ? (
          <span>
            {answerMapping[answer as keyof typeof answerMapping] || answer}
            {!isCorrect && (
              <>
                {" : "}
                <span className="text-[#23BD33]">
                  {Array.isArray(correctAnswers)
                    ? correctAnswers
                        .map(
                          (c) =>
                            answerMapping[c as keyof typeof answerMapping] ?? c,
                        )
                        .join(" / ")
                    : answerMapping[
                        correctAnswers as keyof typeof answerMapping
                      ] || correctAnswers}
                </span>
              </>
            )}
          </span>
        ) : (
          <div
            className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center bg-[#EBA352]",
            )}
            style={{ marginBottom: isPdf ? -18 : 0 }}
          >
            <span
              style={{ marginTop: isPdf ? -12 : 0 }}
              className="text-white text-[12px]"
            >
              !
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Answer;
