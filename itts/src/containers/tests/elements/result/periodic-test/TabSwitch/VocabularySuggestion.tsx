import type { Word } from "@/payload-types";
import { MoveRight, PlusCircleIcon } from "lucide-react";
import { Fragment } from "react";
import { getHigherLevelWords } from "../../entrance-test/utils";

import { handleSearch } from "../../entrance-test/utils";

const VocabularySuggestion = ({
  words,
  onlyShowHigherWord = true,
  passageRef,
}: {
  words: Word[];
  onlyShowHigherWord?: boolean;
  passageRef: React.RefObject<HTMLDivElement>;
}) => {
  const handleClickWord = (word: string) => {
    handleSearch(passageRef as any, word);
  };

  return (
    <div className="flex flex-col gap-6">
      {words && words.length > 0 ? (
        words.map((vocab) => {
          const rawSynonyms = (vocab.synonyms || []).filter(
            (s): s is Word => typeof s !== "string",
          );
          const synonyms: Word[] = onlyShowHigherWord
            ? getHigherLevelWords(vocab.level as any, rawSynonyms) || []
            : rawSynonyms;

          return (
            <div key={vocab.id} className="text-[16px] flex items-center gap-2">
              <div
                className="gap-1 flex items-center font-bold text-[#A11528] bg-[#FFD2D8] rounded-[10px] p-2 hover:brightness-110 hover:shadow-md transition cursor-pointer"
                onClick={() => handleClickWord(vocab.word)}
              >
                <PlusCircleIcon color="#A11528" width={16} height={16} />
                {vocab.word}
              </div>

              {synonyms && synonyms.length > 0 ? (
                <Fragment>
                  <MoveRight width={24} height={24} color="#E72929" />
                  <div className="flex flex-col">
                    {synonyms.map((s) => (
                      <p
                        key={s.id}
                        className="font-semibold text-[#6D737A] text-left"
                      >{`${s.word}`}</p>
                    ))}
                  </div>
                </Fragment>
              ) : undefined}
            </div>
          );
        })
      ) : (
        <p className="font-semibold text-[20px] text-center">
          Không có Từ vựng gợi ý
        </p>
      )}
    </div>
  );
};

export default VocabularySuggestion;
