/* eslint-disable @typescript-eslint/no-unsafe-return */
"use server";
import { Coupon, Course } from "@/payload-types";
import formatCurrency from "@/payload/utilities/formatCurrency";
import type { DefaultServerCellComponentProps } from "payload";

const CellCourses: React.FC<DefaultServerCellComponentProps> = async ({
  payload,
  rowData,
  cellData
}) => {
  // courses should be in cellData or rowData.courses depending on how it's passed, but usually cellData for the column.
  // However, Orders.ts defines this field as 'courses', so cellData is likely the courses array.
  // And coupon is on rowData.

  const courses = (cellData as Course[]) || [];
  const coupon = rowData.coupon as Coupon | undefined;

  // Ensure courses is an array and has items before reduce
  if (!Array.isArray(courses)) return null;

  const totalPrice = courses.reduce(
    (total, course: any) => total + (course.tuition || 0),
    0,
  );

  return (
    <div>
      {courses!.map(({ courseName, tuition }) => (
        <div
          key={courseName}
          className="flex justify-between"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>{courseName}</span>
          <span>{formatCurrency(tuition || 0)}</span>
        </div>
      ))}

      <div>
        <hr />
        <div
          className="flex justify-between"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>Giá</span>
          <span
            style={{
              textDecoration: coupon && totalPrice ? "line-through" : "none",
            }}
          >
            <span>{formatCurrency(totalPrice)}</span>
          </span>
        </div>
        {coupon && totalPrice ? (
          <div style={{ textAlign: "end" }}>
            <span>
              {formatCurrency(totalPrice * (1 - (coupon.discount || 0) / 100))}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CellCourses;
