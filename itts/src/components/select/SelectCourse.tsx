/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import type { SelectFieldClientComponent } from "payload";

import type { Coupon, Course } from "@/payload-types";
import formatCurrency from "@/payload/utilities/formatCurrency";
import {
  SelectInput,
  useDocumentInfo,
  useField,
  useFormFields,
} from "@payloadcms/ui";
import { useEffect, useState } from "react";

type Option = {
  label: string;
  value: string;
  tuition: number;
};

const CustomSelectFieldClient: SelectFieldClientComponent = ({ path }) => {
  const { collectionSlug } = useDocumentInfo();
  const { value, setValue } = useField<string>({ path });

  const couponIds = useFormFields(
    ([fields]) => fields?.coupon?.value,
  ) as string;

  const status = useFormFields(([fields]) => fields?.status?.value);
  const [coupons, setCoupons] = useState<Coupon[]>();

  const [options, setOptions] = useState<Option[]>([]);
  useEffect(() => {
    const fetchOptions = async (): Promise<void> => {
      try {
        const data: Array<Course> = await fetch("/api/courses?limit=0")
          .then((res) => res.json())
          .then((res) => res.docs as Course[]);

        const courseOptions: Option[] = data.map((course: Course) => ({
          label: course.courseName || "",
          value: course.id || "",
          tuition: course.tuition ?? 0,
        }));

        setOptions(courseOptions);
      } catch (error) {
        throw new Error("Error fetching data:");
      }
    };

    const fetchCoupon = async () => {
      try {
        const result: Coupon[] = await fetch(`/api/coupons?depth=0&limit=0`)
          .then((res) => res.json())
          .then((res) => res.docs as Coupon[]);

        if (result) setCoupons(result);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCoupon();
    fetchOptions();
  }, []);

  useEffect(() => {
    if (value && !Array.isArray(value)) {
      // convert saved stringified array back to an array
      const newValue = JSON.parse(value) as string;
      setValue(newValue);
    }
  }, [value]);

  const totalPrice =
    value &&
    options.reduce((total: number, item) => {
      if (value.includes(item.value)) {
        return total + item.tuition;
      }
      return total;
    }, 0);

  // ensure that this condition only checked within Lead route
  if (collectionSlug === "leads" && status !== "paid_case") {
    return;
  }

  const calculateFinalAmount = (
    totalAmount: number,
    coupons: Coupon[] = [],
    selectedCoupons: string[],
  ) => {
    // Lọc các coupon được chọn
    const selected = coupons?.filter((coupon: Coupon) =>
      selectedCoupons.includes(coupon.id),
    );

    // Tính tổng giảm theo phần trăm
    const totalPercentDiscount = selected
      .filter((coupon) => coupon.type === "percent")
      .reduce((total, coupon) => total + coupon.discount, 0);

    // Tính số tiền sau khi giảm phần trăm
    let finalAmount = totalAmount;
    if (totalPercentDiscount > 0) {
      finalAmount -= (finalAmount * totalPercentDiscount) / 100;
    }

    // Trừ các giá trị giảm trực tiếp (money)
    const totalMoneyDiscount = selected
      .filter((coupon) => coupon.type === "money")
      .reduce((total, coupon) => total + coupon.discount, 0);

    finalAmount -= totalMoneyDiscount;

    // Đảm bảo số tiền không âm
    return Math.max(finalAmount, 0);
  };

  return (
    <div style={{ width: "31%" }}>
      <label className="field-label">Khóa Học Lead Mua</label>
      <SelectInput
        path={path}
        name={path}
        hasMany={true}
        options={options}
        value={value}
        onChange={(selectedOption) => {
          if (!Array.isArray(selectedOption)) return;
          const newValue = selectedOption.map((option) => option.value);
          setValue(newValue);
        }}
      />
      {value &&
        Array.isArray(value) &&
        options.map(
          (option) =>
            value.includes(option.value) && (
              <div
                key={option.value}
                className="flex justify-between"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>{option.label}</span>
                <span>{formatCurrency(option.tuition)}</span>
              </div>
            ),
        )}
      {value && (
        <div>
          <hr />
          <div
            className="flex justify-between"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>Giá</span>
            <span
              style={{
                textDecoration:
                  couponIds && couponIds.length > 0 ? "line-through" : "none",
              }}
            >
              {formatCurrency(totalPrice)}
            </span>
          </div>
          {couponIds && couponIds.length > 0 && (
            <div style={{ textAlign: "end" }}>
              <span>
                {formatCurrency(
                  calculateFinalAmount(totalPrice, coupons, couponIds),
                )}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelectFieldClient;
