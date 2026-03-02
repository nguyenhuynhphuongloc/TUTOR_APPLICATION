/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import { Button } from "@/components/ui/button";
import { playSound } from "@/lib/utils";
import { shuffleArray } from "@/payload/utilities/shuffleArray";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";

export default function Stage2({ data = [], setStage }) {
  const [wordList, setWordList] = useState(data);
  const [effect, setEffect] = useState({});
  const [matched, setMatched] = useState([]);
  const [meanings, setMeanings] = useState([]);

  useEffect(() => {
    const meanings = shuffleArray(
      data.map((word, index) => ({
        id: String(index + 1),
        text: `${word["meaning-en"]}`,
        type: word.type,
      })),
    );
    setMeanings(meanings);
  }, []);

  const handleContinue = () => {
    setStage((stage: number) => stage + 1);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const draggedWord = wordList.find((word) => word.id === result.draggableId);
    const droppedOnMeaning = meanings.find(
      (meaning) => meaning.id === destination.droppableId,
    );

    if (draggedWord && droppedOnMeaning) {
      if (draggedWord["meaning-en"] === droppedOnMeaning.text) {
        // ✅ Correct match: Turn green, then disappear
        setEffect((prev) => ({
          ...prev,
          [destination.droppableId]: "bg-green-400 text-white",
        }));
        playSound("vocab-correct");

        setTimeout(() => {
          setMatched([...matched, draggedWord.id, droppedOnMeaning.id]);
          setWordList(wordList.filter((word) => word.id !== draggedWord.id));
          setEffect((prev) => {
            const updated = { ...prev };
            delete updated[destination.droppableId];
            return updated;
          });
        }, 1000);
      } else {
        // ❌ Incorrect match: Turn red, then reset
        setEffect((prev) => ({
          ...prev,
          [destination.droppableId]: "bg-red-400 text-white",
        }));
        playSound("vocab-error");

        setTimeout(() => {
          setEffect((prev) => {
            const updated = { ...prev };
            delete updated[destination.droppableId];
            return updated;
          });
        }, 1000);
      }
    }
  };

  return (
    <div className="">
      <p className="mt-6 text-2xl font-bold">Stage 2 - Read and match</p>
      <div
        className="mt-6 flex min-h-[500px] w-full flex-col items-center rounded-[26px] bg-white py-[60px] mb-4"
        style={{ boxShadow: "0 0 60px rgba(0, 0, 0, 0.1)" }}
      >
        <p className="text-2xl font-bold text-[#6D737A]">
          Match the words to their meanings
        </p>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="mt-6 flex w-full justify-center gap-[80px] px-8">
            {/* Draggable Words */}
            <Droppable droppableId="words">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex w-[330px] flex-col items-center justify-center space-y-8 text-center"
                >
                  {wordList.map((word, index) => (
                    <Draggable
                      key={word.id}
                      draggableId={word.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="text-[#6D737A] flex min-h-[60px] h-auto w-full cursor-pointer items-center justify-center rounded-lg bg-white px-4 py-3 text-center shadow-[0px_0px_60px_0px_rgba(0,0,0,0.1)]"
                        >
                          {word.word}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Droppable Meanings */}
            <div className="w-[420px] space-y-8">
              {meanings.map(
                (meaning) =>
                  !matched.includes(meaning.id) && ( // Hide matched meanings
                    <Droppable key={meaning.id} droppableId={meaning.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`relative min-h-[60px] h-auto w-full rounded-lg border-2 border-dashed px-4 py-3 text-center transition-all duration-300 flex items-center justify-center ${effect[meaning.id] || "bg-gray-100"}`}
                        >
                          {/* content position */}
                          <div className="">
                            {meaning.text} ({meaning.type})
                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ),
              )}
            </div>
          </div>
        </DragDropContext>
        <Button
          className={`mt-[20px] transition-opacity duration-500 ${wordList.length === 0 ? "visible opacity-100" : "invisible opacity-0"}`}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
