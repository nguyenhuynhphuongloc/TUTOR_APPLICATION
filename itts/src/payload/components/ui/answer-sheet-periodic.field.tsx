/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import Editor from "@/components/editor";
import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";
import { ImageMediaAsync } from "@/components/media/image-media-async";
import type { EditorValue } from "@/components/placement-tests/types";
import StarDivider from "@/components/StarDivider/StarDivider";
import { countTotalWords } from "@/containers/tests/elements/result/entrance-test/utils";
import { roundIELTS } from "@/lib/utils";
import {
  RelationshipInput,
  TextareaInput,
  TextInput,
  useDocumentInfo,
  useForm,
  useFormFields,
  usePayloadAPI,
} from "@payloadcms/ui";
import * as Tabs from "@radix-ui/react-tabs";
import { isEmpty } from "lodash-es";
import { Fragment } from "react";
import AudioCommentArrayField from "../array/audio-comment-field";
import FeedbackArray from "../array/feedback-field";
import MistakeArray from "../array/mistake-field";

const format = {
  writing: [
    { key: "ta", title: "Task Achievement (TA)" },
    {
      key: "lr",
      title: "Lexical Resources (LR)",
    },
    { key: "cc", title: "Coherence & Cohesion (CC)" },
    {
      key: "gra",
      title: "Grammatical Range & Accuracy (GRA)",
    },
  ],
  speaking: [
    {
      key: "fc",
      title: "Fluency and Coherence (FC)",
    },
    { key: "lr", title: "Lexical Resource (LR)" },
    { key: "gra", title: "Grammatical Range & Accuracy (GRA)" },
    { key: "pr", title: "Pronunciation (PR)" },
  ],
};

const AnswerSheetEvaluate = ({
  title,
  questionNo,
  keyProps,
  onChange,
  value,
  skill,
}: {
  title: string;
  questionNo: number;
  keyProps: string;
  onChange: (
    questionNo: number,
    value: Record<string, string>,
    onlyNumber: boolean,
    skill: string,
  ) => void;
  value: Record<string, Record<string, string>>;
  skill: string;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <b className="text-[14px]">{title}</b>
        <TextInput
          value={value[skill]?.[questionNo]?.[`${keyProps}Score`] ?? ""}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(
              questionNo,
              { [`${keyProps}Score`]: event.target.value },
              true,
              skill,
            );
          }}
          path={`answerSheet.${skill}.answer.${questionNo}.${keyProps}Score`}
          className="w-20"
        />
      </div>
      <TextareaInput
        className="flex-1"
        label="Điểm mạnh"
        value={value[skill]?.[questionNo]![keyProps]?.strongPoints ?? ""}
        onChange={(event) => {
          onChange(
            questionNo,
            {
              [keyProps]: {
                ...value[skill]?.[questionNo]![keyProps],
                strongPoints: event.target.value,
              },
            },
            false,
            skill,
          );
        }}
        path={`answerSheet.${skill}.answer.${questionNo}.[${keyProps}].strongPoints`}
      />
      <TextareaInput
        className="flex-1"
        label="Điểm cần cải thiện"
        value={value[skill]?.[questionNo]?.[keyProps]?.improvementPoints ?? ""}
        onChange={(event) => {
          onChange(
            questionNo,
            {
              [keyProps]: {
                ...value[skill]?.[questionNo]?.[keyProps],
                improvementPoints: event.target.value,
              },
            },
            false,
            skill,
          );
        }}
        path={`answerSheet.${skill}.answer.${questionNo}.[${keyProps}].improvementPoints`}
      />
      {skill === "speaking" && (
        <TextareaInput
          className="flex-1"
          label="Đề xuất"
          value={value[skill]?.[questionNo]?.[keyProps]?.suggest ?? ""}
          onChange={(event) => {
            onChange(
              questionNo,
              {
                [keyProps]: {
                  ...value[skill]?.[questionNo]?.[keyProps],
                  suggest: event.target.value,
                },
              },
              false,
              skill,
            );
          }}
          path={`answerSheet.${skill}.answer.${questionNo}.[${keyProps}].suggest`}
        />
      )}
    </div>
  );
};

function AnswerSheetFieldPeriodicUI() {
  const { value } = useFormFields(([fields]) => fields.answerSheet);
  const { setModified, dispatchFields: dispatch } = useForm();

  const { initialData: record } = useDocumentInfo();

  const [{ data, isError, isLoading }] = usePayloadAPI(
    `/api/${!["full", "mini"].includes(record.type) ? "periodic_tests" : "placement_tests"}/${record.test}`,
    {
      initialParams: { depth: 999 },
    },
  );

  const isPeriodic = !["full", "mini"].includes(record.type);

  const speaking = data?.tests?.find(
    (test) => test.type === "speaking",
  )?.speaking;

  const {
    1: {
      comment,
      fc,
      fcScore,
      gra,
      graScore,
      lr,
      lrScore,
      pr,
      prScore,
      overallScore,
      ...restLevel1
    } = {},
    ...rest
  } = value?.speaking || {};

  const speakingData = {
    1: restLevel1,
    ...rest,
  };

  const onChange = (
    questionNo: number,
    payload: any,
    onlyNumber?: boolean,
    skill: string,
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

    const updatedValue = {
      ...value,
      [skill]: {
        ...value[skill],
        [questionNo]: {
          ...value[skill][questionNo],
          ...payload,
        },
      },
    };

    // Auto calculate overall score for writing and speaking
    if (["writing", "speaking"].includes(skill)) {
      const criteriaKeys = format[skill as keyof typeof format].map(
        (f) => `${f.key}Score`,
      );
      const isScoreUpdate = Object.keys(payload).some((key) =>
        criteriaKeys.includes(key),
      );

      if (isScoreUpdate) {
        const scores = criteriaKeys
          .map((key) => updatedValue[skill][questionNo][key])
          .filter((s) => s !== undefined && s !== "");

        if (scores.length === criteriaKeys.length) {
          const total = scores.reduce((sum, s) => sum + parseFloat(s), 0);
          const average = total / criteriaKeys.length;
          updatedValue[skill][questionNo].overallScore =
            roundIELTS(average).toString();
        }
      }
    }

    dispatch({
      type: "UPDATE",
      path: "answerSheet",
      value: updatedValue,
    });
  };
  const handleVocabField = (e) => {
    setModified(true);
    dispatch({
      type: "UPDATE",
      path: "answerSheet",
      value: {
        ...value,
        writing: {
          ...value.writing,
          vocabs: e,
        },
      },
    });
  };

  if (record!.status !== "completed") {
    return <p>Học viên chưa hoàn thành bài kiểm tra</p>;
  }
  if (isLoading) return <div>Loading</div>;
  const writing = data?.tests?.find((test) => test.type === "writing")?.writing;

  const haveSpeakingAnswer = !isEmpty(value.speaking);

  return (
    <>
      {writing ? (
        <Fragment>
          <div className="flex flex-col gap-4">
            <div className="text-[32px] font-bold">Writing</div>
            <Tabs.Root defaultValue="1">
              <Tabs.List className="flex">
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
                const { description, content, image } =
                  writing?.[questionNo - 1];

                return (
                  <Tabs.Content
                    key={questionNo}
                    value={`${questionNo}`}
                    className="flex gap-4 mt-2"
                  >
                    <div className="w-[50%] ">
                      <h2 className="font-bold">QUESTION</h2>
                      <Editor
                        value={description as EditorValue}
                        theme={previewEditorTheme}
                        mode="practice"
                      />
                      <div className="image">
                        {image && (
                          <div className="relative mb-4 select-none">
                            <ImageMediaAsync
                              imgClassName="rounded-[12px] object cover !relative"
                              resource={image}
                            />
                          </div>
                        )}
                        <Editor
                          value={content as EditorValue}
                          theme={previewEditorTheme}
                          mode="practice"
                        />
                      </div>
                      <TextareaInput
                        className="flex-1"
                        value={
                          value.writing?.[questionNo]?.[questionNo]?.answer
                        }
                        label="Answer"
                        path={`answerSheet.writing.answer.${questionNo}.${questionNo}.answer`}
                        readOnly
                      />
                      <p className="mt-2">
                        <b>Word count: </b>
                        {countTotalWords(
                          value.writing?.[questionNo]?.[questionNo]?.answer,
                        )}
                      </p>
                    </div>
                    <div className="w-[50%]">
                      <TextInput
                        value={value.writing?.[questionNo]?.overallScore ?? ""}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          onChange(
                            questionNo,
                            { overallScore: event.target.value },
                            true,
                            "writing",
                          );
                        }}
                        path={`answerSheet.writing.answer.${questionNo}.overallScore`}
                        label="Overall Score"
                        readOnly
                      />
                      <TextareaInput
                        className="flex-1"
                        value={value.writing?.[questionNo]?.comment ?? ""}
                        onChange={(event) => {
                          onChange(
                            questionNo,
                            { comment: event.target.value },
                            false,
                            "writing",
                          );
                        }}
                        label="Comment"
                        path={`answerSheet.writing.answer.${questionNo}.comment`}
                      />
                      <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-4">
                        {format.writing.map(({ key, title }) => (
                          <AnswerSheetEvaluate
                            keyProps={key}
                            key={key}
                            title={title}
                            questionNo={questionNo}
                            onChange={onChange}
                            value={value}
                            skill="writing"
                          />
                        ))}
                      </div>
                      {isPeriodic && <FeedbackArray questionNo={questionNo} />}
                    </div>
                  </Tabs.Content>
                );
              })}
            </Tabs.Root>
          </div>
          {isPeriodic && (
            <Fragment>
              <MistakeArray />
              <RelationshipInput
                path="answerSheet.writing.vocabs"
                relationTo={["words"]}
                label="Từ vựng của bài"
                hasMany
                onChange={handleVocabField}
                value={value.writing?.vocabs}
              />
            </Fragment>
          )}
        </Fragment>
      ) : (
        <p className="text-[#E72929] font-bold text-2xl my-4">
          Học viên không làm bài Writing hoặc bài thi này không có Writing
        </p>
      )}
      <StarDivider />
      {/* Speaking */}
      {haveSpeakingAnswer ? (
        <div className="flex flex-col gap-4 mt-4">
          <div className="text-[32px] font-bold">Speaking</div>
          <TextInput
            value={value.speaking?.[1]?.overallScore ?? ""}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onChange(
                1,
                { overallScore: event.target.value },
                true,
                "speaking",
              );
            }}
            path={`answerSheet.speaking.answer.${1}.overallScore`}
            label="Overall Score"
            readOnly
          />
          <TextareaInput
            className="flex-1"
            value={value.speaking?.[1]?.comment ?? ""}
            onChange={(event) => {
              onChange(1, { comment: event.target.value }, false, "speaking");
            }}
            label="Comment"
            path={`answerSheet.speaking.answer.${1}.comment`}
          />
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            {format.speaking.map(({ key, title }) => (
              <AnswerSheetEvaluate
                keyProps={key}
                key={key}
                title={title}
                questionNo={1}
                onChange={onChange}
                value={value}
                skill="speaking"
              />
            ))}
          </div>

          <div>
            {Object.entries(speakingData).map(([part, topics]) => (
              <div key={part} className="mb-6">
                <div className="text-[26px] font-extrabold mb-4">
                  Part {part}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {Object.entries(topics).map(([topic, questions]) => {
                    const currentTopic = speaking[part - 1].Topics[topic - 1];

                    return (
                      <div key={topic} className="mb-4">
                        <div className="text-[18px] font-bold mb-2">
                          {topics.length === 1 ? "Topic: " : `Topic ${topic}: `}
                          <span className="text-[#E72929]">
                            {currentTopic.topic}
                          </span>
                        </div>

                        {Object.entries(questions).map(([questionKey, q]) => {
                          const question =
                            currentTopic.questions[questionKey - 1];
                          return (
                            <div key={questionKey} className="mb-3">
                              <div className="text-[16px] font-semibold mb-2">
                                {questions.length === 1
                                  ? `Question: ${question.question}`
                                  : `Question ${questionKey}: ${question.question}`}
                              </div>
                              {!isPeriodic && q.answer.url && (
                                <audio src={q.answer.url} controls>
                                  <source src={q.answer.url} type="audio/wav" />
                                  Your browser does not support the audio
                                  element.
                                </audio>
                              )}
                              {isPeriodic && q.answer.url && (
                                <AudioCommentArrayField
                                  audioUrl={q.answer.url}
                                  locate={{
                                    part,
                                    topic,
                                    question: questionKey,
                                  }}
                                  isPeriodic={isPeriodic}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-[#E72929] font-bold text-2xl mt-2">
          Học viên không làm bài Speaking hoặc bài thi này không có Speaking
        </p>
      )}
    </>
  );
}

export default AnswerSheetFieldPeriodicUI;
