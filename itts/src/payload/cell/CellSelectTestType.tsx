/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DefaultServerCellComponentProps } from "payload";

const TYPE_COLOR = {
  homework: "bg-[#A550A7]",
  extra_homework: "bg-[#0866FF]",
  mini_test: "bg-[#23BD33]",
  mid_term: "bg-[#FBA631]",
  final_term: "bg-[#FD4444]",
  bank: "bg-[#D9D9D9]",
  entrance_test: "bg-[#E5748F]",
};

const TYPE_TEST = {
  homework: "Bài tập về nhà",
  extra_homework: "Bài tập bổ trợ",
  mini_test: "Mini Test",
  mid_term: "Kiểm tra giữa kỳ",
  final_term: "Kiểm tra cuối kỳ",
  bank: "Kho đề",
  entrance_test: "Kiểm tra đầu vào",
};

const CellSelectTestType: React.FC<DefaultServerCellComponentProps> = async ({
  cellData,
}) => {
  return Array.isArray(cellData) ? (
    <div className="space-x-2 space-y-2">
      {cellData.map((type: string) => (
        <Badge
          key={type}
          className={cn(
            "text-white rounded-md hover:text-black text-[12px]",
            TYPE_COLOR[type],
          )}
          variant={"destructive"}
        >
          {TYPE_TEST[type]}
        </Badge>
      ))}
    </div>
  ) : (
    <Badge
      className={cn(
        "text-white rounded-md hover:text-black text-[12px]",
        TYPE_COLOR[cellData],
      )}
      variant={"destructive"}
    >
      {TYPE_TEST[cellData]}
    </Badge>
  );
};

export default CellSelectTestType;
