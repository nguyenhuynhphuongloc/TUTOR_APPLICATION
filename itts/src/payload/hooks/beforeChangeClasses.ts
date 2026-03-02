import type { Class } from "@/payload-types";
import { addDays, getDay, startOfDay } from "date-fns";
import isEmpty from "lodash-es/isEmpty";
import type { CollectionBeforeChangeHook } from "payload";
import { convertToVietnamTime } from "../utilities/convertDate";

export const beforeChangeClasses: CollectionBeforeChangeHook<Class> = async ({
  data,
  req,
}) => {
  const {
    days_of_week,
    time_per_session,
    session_time,
    sessions: currentSessions,
    course: courseId,
    startDate,
  } = data;

  // Nếu class đang active hoặc user đã custom sessions hoặc không có ngày khai giảng -> giữ nguyên
  if (!isEmpty(currentSessions) || !startDate) {
    return data;
  }

  const { payload } = req;

  // Lấy course để đọc total_hours
  const course = await payload.findByID({
    collection: "courses",
    id: courseId,
  });

  const totalSessions = course?.total_hours / time_per_session;

  // Chuẩn bị xây sessions mới
  const initialDate = new Date(startDate);
  const sessionStart = new Date(session_time);
  const hour = sessionStart.getHours();
  const minute = sessionStart.getMinutes();

  const newSessions = [];

  let iterateDate = initialDate;

  while (newSessions.length < totalSessions) {
    const day = String(getDay(iterateDate)) as any;

    if (days_of_week?.includes(day)) {
      const date = startOfDay(convertToVietnamTime(iterateDate));
      date.setHours(hour, minute, 0, 0);

      newSessions.push({
        date,
        homework_meta: [],
      });
    }
    iterateDate = addDays(iterateDate, 1);
  }

  // Trả về object mới (immutable)
  return {
    ...data,
    sessions: newSessions,
  };
};

export default beforeChangeClasses;
