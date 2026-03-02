/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import {
  TextareaInput,
  TextInput,
  useForm,
  useFormFields,
  usePayloadAPI,
} from "@payloadcms/ui";
import * as Tabs from "@radix-ui/react-tabs";
import { isEmpty } from "lodash-es";
import { useMemo } from "react";

function AnswerSheetFieldUI() {
  const { value } = useFormFields(([fields]) => fields.answerSheet);
  const { setModified, dispatchFields: dispatch, getData } = useForm();

  const record = getData();

  const [{ data, isError, isLoading }] = usePayloadAPI(
    `/api/placement_tests/${record.test}`,
    {
      initialParams: { depth: 1 },
    },
  );

  const speaking = data?.tests?.[3]?.speaking;
  const speakingWithQuestion = useMemo(() => {
    const questionMap: Record<string, string> = {};

    speaking?.forEach((section) => {
      section.Topics.forEach((topic) => {
        topic.questions.forEach((q) => {
          questionMap[q.id] = q.question;
        });
      });
    });

    const clone = JSON.parse(JSON.stringify(value.speaking || {}));

    Object.values(clone).forEach((section: any) => {
      Object.values(section).forEach((topic: any) => {
        Object.values(topic).forEach((q: any) => {
          if (q && typeof q === "object" && "id" in q) {
            q.question = questionMap[q.id] ?? null;
          }
        });
      });
    });

    return clone;
  }, [speaking]);

  const onChange = (
    questionNo: number,
    payload: any,
    onlyNumber?: boolean,
    skill: string = "writing",
  ) => {
    if (isEmpty(value[skill]?.[questionNo]?.[questionNo])) {
      return;
    }

    if (onlyNumber) {
      const value = Object.values(payload)[0] as string;
      const regex = /^(?:[0-9](?:[.]\d?)?)?$/;

      if (!regex.test(value)) {
        return;
      }
      const num = parseFloat(value);
      if (num < 0 || num > 9) {
        return;
      }
    }

    setModified(true);
    dispatch({
      type: "UPDATE",
      path: "answerSheet",
      value: {
        ...value,
        [skill]: {
          ...value[skill],
          [questionNo]: {
            [questionNo]: {
              ...value[skill][questionNo][questionNo],
              ...payload,
            },
          },
        },
      },
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="text-[32px] font-bold">Writing</div>
        <Tabs.Root defaultValue="1">
          <Tabs.List className="flex shrink-0">
            <Tabs.Trigger
              className="outline-none h-[45px] data-[state=active]:border-b-2 data-[state=active]:border-b-black flex-1 cursor-default select-none items-center justify-center bg-white px-5 text-[15px] leading-none border-transparent"
              value="1"
            >
              <div className="text-[24px] font-semibold">Task 1</div>
            </Tabs.Trigger>
            <Tabs.Trigger
              className="outline-none h-[45px] data-[state=active]:border-b-2 data-[state=active]:border-b-black flex-1 cursor-default select-none items-center justify-center bg-white px-5 text-[15px] leading-none border-transparent"
              value="2"
            >
              <div className="text-[24px] font-semibold">Task 2</div>
            </Tabs.Trigger>
          </Tabs.List>
          {[1, 2].map((questionNo) => {
            if (!value.writing?.[questionNo]?.[questionNo]?.answer) {
              return null;
            }

            return (
              <Tabs.Content
                key={questionNo}
                value={`${questionNo}`}
                className="flex flex-col gap-4"
              >
                <TextareaInput
                  className="flex-1"
                  value={
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    value.writing?.[questionNo]?.[questionNo]?.answer
                  }
                  label="Answer"
                  path={`answerSheet.writing.answer.${questionNo}.${questionNo}.answer`}
                  readOnly
                />
                <TextInput
                  value={
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    value.writing?.[questionNo]?.[questionNo]?.overallScore ??
                    ""
                  }
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    onChange(
                      questionNo,
                      { overallScore: event.target.value },
                      true,
                    );
                  }}
                  path={`answerSheet.writing.answer.${questionNo}.${questionNo}.overallScore`}
                  label="Overall Score"
                />
                <TextareaInput
                  className="flex-1"
                  value={
                    value.writing?.[questionNo]?.[questionNo]?.comment ?? ""
                  }
                  onChange={(event) => {
                    onChange(questionNo, { comment: event.target.value });
                  }}
                  label="Comment"
                  path={`answerSheet.writing.answer.${questionNo}.${questionNo}.comment`}
                />
                <div className="grid grid-cols-2 grid-rows-2 gap-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      Task Achievement (TA)
                      <TextInput
                        value={
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                          value.writing?.[questionNo]?.[questionNo]?.taScore ??
                          ""
                        }
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          onChange(
                            questionNo,
                            { taScore: event.target.value },
                            true,
                          );
                        }}
                        path={`answerSheet.writing.answer.${questionNo}.${questionNo}.taScore`}
                        className="w-20"
                      />
                    </div>
                    <TextareaInput
                      className="flex-1"
                      value={
                        value.writing?.[questionNo]?.[questionNo]?.ta ?? ""
                      }
                      onChange={(event) => {
                        onChange(questionNo, { ta: event.target.value });
                      }}
                      path={`answerSheet.writing.answer.${questionNo}.${questionNo}.ta`}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      Lexical Resources (LR)
                      <TextInput
                        value={
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                          value.writing?.[questionNo]?.[questionNo]?.lrScore ??
                          ""
                        }
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          onChange(
                            questionNo,
                            { lrScore: event.target.value },
                            true,
                          );
                        }}
                        path={`answerSheet.writing.answer.${questionNo}.${questionNo}.lrScore`}
                        className="w-20"
                      />
                    </div>
                    <TextareaInput
                      className="flex-1"
                      value={
                        value.writing?.[questionNo]?.[questionNo]?.lr ?? ""
                      }
                      onChange={(event) => {
                        onChange(questionNo, { lr: event.target.value });
                      }}
                      path={`answerSheet.writing.answer.${questionNo}.${questionNo}.lr`}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      Coherence &amp; Cohesion (CC)
                      <TextInput
                        value={
                          value.writing?.[questionNo]?.[questionNo]?.ccScore ??
                          ""
                        }
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          onChange(
                            questionNo,
                            { ccScore: event.target.value },
                            true,
                          );
                        }}
                        path={`answerSheet.writing.answer.${questionNo}.${questionNo}.ccScore`}
                        className="w-20"
                      />
                    </div>
                    <TextareaInput
                      className="flex-1"
                      value={
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        value.writing?.[questionNo]?.[questionNo]?.cc ?? ""
                      }
                      onChange={(event) => {
                        onChange(questionNo, { cc: event.target.value });
                      }}
                      path={`answerSheet.writing.answer.${questionNo}.${questionNo}.cc`}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      Grammatical Range &amp; Accuracy (GRA)
                      <TextInput
                        value={
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                          value.writing?.[questionNo]?.[questionNo]?.graScore ??
                          ""
                        }
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          onChange(
                            questionNo,
                            {
                              graScore: event.target.value,
                            },
                            true,
                          );
                        }}
                        path={`answerSheet.writing.answer.${questionNo}.${questionNo}.graScore`}
                        className="w-20"
                      />
                    </div>
                    <TextareaInput
                      className="flex-1"
                      value={
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        value.writing?.[questionNo]?.[questionNo]?.gra ?? ""
                      }
                      onChange={(event) => {
                        onChange(questionNo, { gra: event.target.value });
                      }}
                      path={`answerSheet.writing.answer.${questionNo}.${questionNo}.gra`}
                    />
                  </div>
                </div>
              </Tabs.Content>
            );
          })}
        </Tabs.Root>
      </div>

      <div className="flex flex-col gap-4 mt-10">
        <div className="text-[32px] font-bold">Speaking</div>
        <TextInput
          value={
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value.speaking?.[1]?.[1]?.overallScore ?? ""
          }
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(1, { overallScore: event.target.value }, true, "speaking");
          }}
          path={`answerSheet.speaking.answer.${1}.${1}.overallScore`}
          label="Overall Score"
        />
        <TextareaInput
          className="flex-1"
          value={
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value.speaking?.[1]?.[1]?.comment ?? ""
          }
          onChange={(event) => {
            onChange(1, { comment: event.target.value }, false, "speaking");
          }}
          label="Comment"
          path={`answerSheet.speaking.answer.${1}.${1}.comment`}
        />
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              Fluency and Coherence (FC)
              <TextInput
                value={
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  value.speaking?.[1]?.[1]?.fcScore ?? ""
                }
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  onChange(
                    1,
                    { fcScore: event.target.value },
                    true,
                    "speaking",
                  );
                }}
                path={`answerSheet.speaking.answer.${1}.${1}.fcScore`}
                className="w-20"
              />
            </div>
            <TextareaInput
              className="flex-1"
              value={
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                value.speaking?.[1]?.[1]?.fc ?? ""
              }
              onChange={(event) => {
                onChange(1, { fc: event.target.value }, false, "speaking");
              }}
              path={`answerSheet.speaking.answer.${1}.${1}.fc`}
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              Lexical Resources (LR)
              <TextInput
                value={value.speaking?.[1]?.[1]?.lrScore ?? ""}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  onChange(
                    1,
                    { lrScore: event.target.value },
                    true,
                    "speaking",
                  );
                }}
                path={`answerSheet.speaking.answer.${1}.${1}.lrScore`}
                className="w-20"
              />
            </div>
            <TextareaInput
              className="flex-1"
              value={value.speaking?.[1]?.[1]?.lr ?? ""}
              onChange={(event) => {
                onChange(1, { lr: event.target.value }, false, "speaking");
              }}
              path={`answerSheet.speaking.answer.${1}.${1}.lr`}
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              Grammatical Range &amp; Accuracy (GRA)
              <TextInput
                value={value.speaking?.[1]?.[1]?.graScore ?? ""}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  onChange(
                    1,
                    { graScore: event.target.value },
                    true,
                    "speaking",
                  );
                }}
                path={`answerSheet.speaking.answer.${1}.${1}.graScore`}
                className="w-20"
              />
            </div>
            <TextareaInput
              className="flex-1"
              value={value.speaking?.[1]?.[1]?.gra ?? ""}
              onChange={(event) => {
                onChange(1, { gra: event.target.value }, false, "speaking");
              }}
              path={`answerSheet.speaking.answer.${1}.${1}.gra`}
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              Pronunciation (PR)
              <TextInput
                value={value.speaking?.[1]?.[1]?.prScore ?? ""}
                onChange={(event) => {
                  onChange(
                    1,
                    { prScore: event.target.value },
                    true,
                    "speaking",
                  );
                }}
                path={`answerSheet.speaking.answer.${1}.${1}.prScore`}
                className="w-20"
              />
            </div>
            <TextareaInput
              className="flex-1"
              value={value.speaking?.[1]?.[1]?.pr ?? ""}
              onChange={(event) => {
                onChange(1, { pr: event.target.value }, false, "speaking");
              }}
              path={`answerSheet.speaking.answer.${1}.${1}.pr`}
            />
          </div>

          <div>
            {Object.values(speakingWithQuestion || {}).map(
              (partItem, index) => {
                return (
                  <div key={index} className="">
                    <div className="text-[24px] font-bold mb-2">
                      Part {index + 1}
                    </div>
                    {Object.values(partItem || {}).map((topicItem, tIndex) => {
                      return (
                        <div key={topicItem.id}>
                          <div className="text-[18px] font-bold mb-2">
                            Topic {tIndex + 1}
                          </div>

                          {Object.values(topicItem).map((question, qIndex) =>
                            question && typeof question === "object" ? (
                              <div key={question.id}>
                                <div>
                                  Question {qIndex + 1} : {question.question}
                                </div>
                                {question.answer?.url && (
                                  <div>
                                    Answer:
                                    <div>
                                      <audio controls>
                                        <source
                                          src={question.answer.url}
                                          type="audio/wav"
                                        />
                                        Your browser does not support the audio
                                        tag.
                                      </audio>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : null,
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AnswerSheetFieldUI;
