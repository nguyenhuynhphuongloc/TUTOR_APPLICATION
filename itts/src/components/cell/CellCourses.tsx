/* eslint-disable @typescript-eslint/no-unsafe-return */
"use server";
import { Coupon, Course } from "@/payload-types";
import formatCurrency from "@/payload/utilities/formatCurrency";
import type { DefaultServerCellComponentProps } from "payload";

const CellCourses: React.FC<DefaultServerCellComponentProps> = async ({
  payload,
  rowData,
}) => {
  const { id } = rowData;
  const { courses, coupon } = (await payload.findByID({
    collection: "orders",
    id,
    depth: 2,
  })) as { courses: Course[]; coupon: Coupon };

  const totalPrice = courses!.reduce(
    (total, course: any) => total + course.tuition,
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
