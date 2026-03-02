/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useAuth } from "@/app/(app)/_providers/Auth";
import buildStyles from "@/components/circle-progress-bar/buildStyles";
import CircleProgressBar from "@/components/circle-progress-bar/CircleProgressbarWithChildren";
import "@/components/circle-progress-bar/styles.css";
import CreateBookingModal from "@/components/modal/CreateBookingModal";
import PageLoading from "@/components/PageLoading";
import { ToggleGroup } from "@/components/toggle-group/ToggleGroup";
import type { BookingSchedule } from "@/payload-types";
import { useQuery } from "@tanstack/react-query";

import { addMinutes, format } from "date-fns";
import { CalendarIcon, GraduationCap, Link } from "lucide-react";
import { stringify } from "qs-esm";
import type { JSX } from "react";
import { useMemo, useState } from "react";

/**
 * A component to display a single booking schedule item with a timeline dot,
 * instructor, title, type, and original index.
 *
 * @param {{
 *   time: string;
 *   date: string;
 *   instructor: string;
 *   title: string;
 *   type?: string;
 *   originalIndex: number;
 * }} props - The properties for the component.
 * @returns {JSX.Element} The JSX element for the component.
 */
const BookingItem = ({
  time,
  date,
  instructor,
  type,
  originalIndex,
}: {
  time: string;
  date: string;
  instructor: string;
  type?: string;
  originalIndex: number;
}): JSX.Element => {
  return (
    <div className="relative flex items-start gap-[5.1875rem] pb-8">
      <div className="absolute left-[calc(50%-1px)] top-0 flex h-full flex-col items-center">
        <div className="relative">
          <div className="absolute left-[-7px] top-0 h-[13px] w-[13px] rounded-full bg-red-500">
            <div className="border-1 absolute -inset-1 rounded-full border-[#E7292933] bg-[#E7292933]"></div>
          </div>
        </div>
        <div className="h-full w-0 border-l border-dashed border-gray-200"></div>
      </div>

      {/* Left side - Time & Date */}
      <div className="w-1/2 pr-8 text-right">
        <div className="text-2xl font-bold text-[#E72929]">{time}</div>
        <div className="text-md flex items-center justify-end gap-2 text-gray-600">
          <CalendarIcon className="h-5 w-5" />
          <span className="text-[#6D737A] font-medium">{date}</span>
        </div>
      </div>

      {/* Right side - Booking Details */}
      <div className="w-1/2 pl-8">
        <h3 className="text-md font-semibold">Booking Buổi {originalIndex}</h3>
        <div className="mt-2 flex items-center gap-2 text-gray-600">
          <GraduationCap className="h-5 w-5" />
          <p className="text-sm font-medium">
            Wow phụ trách: <span className="font-bold">{instructor}</span>
          </p>
        </div>
        {type && (
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
            <Link className="h-5 w-5" />
            <span>{type}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Wow() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("upcoming");
  const query = stringify(
    { where: { student: user?.id }, limit: 0 },
    { addQueryPrefix: true },
  );

  const { data, isLoading, error } = useQuery<{ docs: BookingSchedule[] }>({
    queryKey: ["booking_schedule"],
    queryFn: () =>
      fetch(`/api/booking_schedule${query}`).then((res) => res.json()),
  });

  const filteredBookings = useMemo(() => {
    if (!data?.docs) return [];
    const now = new Date();

    return data.docs
      .filter((booking: BookingSchedule) => {
        const bookingDate = new Date(booking.date_time);
        if (filter === "upcoming") {
          return (
            (booking.status === "pending" || booking.status === "accepted") &&
            bookingDate > now
          );
        }
        if (filter === "past") {
          return booking.status === "accepted" && bookingDate <= now;
        }
        if (filter === "cancelled") {
          return booking.status === "cancelled";
        }
        return true;
      })
      .map((booking: BookingSchedule) => {
        const isoDate = new Date(booking.date_time);
        const date = format(isoDate, "EEE, dd/MM/yyyy");
        const time = format(isoDate, "H:mm");
        const timeEnd = format(addMinutes(isoDate, 30), "H:mm");

        return {
          ...booking,
          date,
          time: `${time} - ${timeEnd}`,
        };
      });
  }, [data?.docs, filter]);

  const totalAccepted = useMemo(() => {
    if (!data?.docs) return 0;
    return data.docs.filter(
      (booking: BookingSchedule) => booking.status === "accepted",
    ).length;
  }, [data?.docs]);

  if (isLoading) return <PageLoading />;

  const booking = filteredBookings;

  return (
    <div>
      <div className="border-b-2 border-dashed border-[#E7EAE9] pb-6">
        <ToggleGroup
          className="gap-4 bg-white font-semibold"
          itemCn="border border-[#E7EAE9] w-[8.125rem] p-3 bg-[#F8F8F8] h-[2.6875rem] font-semibold transition-colors duration-200 
        hover:bg-[#E7292926] hover:border-[#E72929] data-[state=on]:bg-[#E7292926] data-[state=on]:border-[#E72929] border-[2px] text-md rounded-[12px]"
          defaultValue="upcoming"
          onValueChange={(value) => value && setFilter(value)}
          data={[
            {
              value: "upcoming",
              label: "Upcoming",
            },
            {
              value: "past",
              label: "Past",
            },
            {
              value: "cancelled",
              label: "Cancelled",
            },
          ]}
        />
      </div>

      <div className="relative">
        <div className="max-w-[40rem] p-6">
          {booking.length > 0 ? (
            booking.map((book, index: number) => (
              <BookingItem
                key={index}
                originalIndex={booking.length - index}
                time={book.time}
                date={book.date}
                instructor={
                  typeof book.teacher !== "string"
                    ? (book.teacher as any)?.fullName || "Unknown"
                    : "..."
                }
                type={book.skill}
              />
            ))
          ) : (
            <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-gray-100 text-gray-400">
              Không có dữ liệu đặt lịch cho trạng thái này.
            </div>
          )}
        </div>
        <div className="absolute right-0 top-6 flex h-[18.3125rem] w-[28rem] items-center justify-center rounded-xl bg-white p-6 shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="w-[7.9375rem]">
              <CircleProgressBar
                value={(totalAccepted * 100) / 40}
                styles={buildStyles({
                  rotation: 1 / 2 + 1 / 6,
                  trailColor: "#F8EFE2",
                  pathColor: "#E72929",
                })}
              >
                <div>
                  <div className="mt-6 text-2xl font-bold text-[#E72929] text-center">
                    {totalAccepted}
                  </div>
                  <div className="text-md mt-[-6px] text-[#151515]">{`(40)`}</div>
                </div>
              </CircleProgressBar>
            </div>
            <p className="text-lg text-[#A8ABB2]">
              {totalAccepted > 0 ? "Số buổi đã booking" : "Bạn chưa đặt lịch"}
            </p>
            {totalAccepted < 40 && <CreateBookingModal />}
          </div>
        </div>
      </div>
    </div>
  );
}
