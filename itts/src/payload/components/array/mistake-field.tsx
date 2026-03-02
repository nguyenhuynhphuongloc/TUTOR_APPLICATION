/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Button,
  SelectInput,
  TextareaInput,
  TextInput,
  useForm,
  useFormFields,
} from "@payloadcms/ui";

export default function MistakeArray() {
  const { value } = useFormFields(([fields]) => fields.answerSheet);
  const { setModified, dispatchFields: dispatch } = useForm();

  const getMistakes = () => value.writing?.mistakes || [];

  const setMistakes = (
    newList: Array<{ mistake?: string; feedback?: string }>,
  ) => {
    setModified(true);

    const newAnswerSheet = {
      ...value,
      writing: {
        ...value.writing,
        mistakes: newList,
      },
    };

    dispatch({
      type: "UPDATE",
      path: "answerSheet",
      value: newAnswerSheet,
    });
  };

  const handleAdd = () => {
    const list = getMistakes();
    setMistakes([...list, { id: list.length + 1, mistake: "", feedback: "" }]);
  };

  const handleRemove = (index: number) => {
    const list = getMistakes();
    const next = list.filter((_, i) => i !== index);
    setMistakes(next);
  };

  const handleChange = (
    index: number,
    field: "mistake" | "feedback" | "type",
    v: string,
  ) => {
    const list = getMistakes();
    const next = list.map((item, i) =>
      i === index ? { ...item, [field]: v } : item,
    );
    setMistakes(next);
  };

  const mistakes = getMistakes();

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl font-semibold">Mistakes</div>
        <Button
          buttonStyle="icon-label"
          className={`array-field__add-row`}
          icon="plus"
          iconPosition="left"
          iconStyle="with-border"
          onClick={handleAdd}
        >
          Add Mistake
        </Button>
      </div>

      {mistakes.length === 0 ? (
        <div className="text-gray-500 italic">No data yet</div>
      ) : null}

      <div className="flex flex-col gap-4 mt-2">
        {mistakes.map((item, idx) => (
          <div
            key={idx}
            className="border rounded-lg p-4 bg-white flex flex-col"
          >
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold">Mistake {idx + 1}</p>

              <Button
                iconStyle="with-border"
                buttonStyle="icon-label"
                className={`array-field__add-row self-end`}
                icon="x"
                onClick={() => handleRemove(idx)}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <TextInput
                label={`Mistake `}
                value={item?.mistake ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(idx, "mistake", e.target.value)
                }
                path={"answerSheet.writing.mistakes." + idx + ".mistake"}
              />

              <TextareaInput
                label="Feedback"
                value={item?.feedback ?? ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleChange(idx, "feedback", e.target.value)
                }
                path={"answerSheet.writing.mistakes." + idx + ".feedback"}
              />
              <SelectInput
                label="Type"
                value={item?.type ?? ""}
                options={[
                  { label: "Grammar", value: "grammar" },
                  { label: "Spelling", value: "spelling" },
                ]}
                onChange={(e) => {
                  handleChange(idx, "type", e.value);
                }}
                path={"answerSheet.writing.mistakes." + idx + ".type"}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
