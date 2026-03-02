import { TZDate } from "@date-fns/tz";

export const convertToVietnamTime = (dateTime: Date) => {
  const vietnamTimeZone = "Asia/Bangkok";
  const zonedTime = new TZDate(dateTime, vietnamTimeZone);
  return zonedTime.toISOString();
};
