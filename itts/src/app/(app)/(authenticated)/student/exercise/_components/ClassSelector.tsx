import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Class } from "@/payload-types";

interface ClassSelectorProps {
  currentClassId?: string;
  classes: Class[];
  onClassChange: (selectedClass: Class) => void;
}

export const ClassSelector = ({
  currentClassId,
  classes,
  onClassChange,
}: ClassSelectorProps) => {
  return (
    <Select
      defaultValue={currentClassId}
      onValueChange={(value) => {
        const selectedClass = classes.find((c) => c.id === value);
        if (selectedClass) onClassChange(selectedClass);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Chọn khóa học" />
      </SelectTrigger>
      <SelectContent>
        {classes.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
