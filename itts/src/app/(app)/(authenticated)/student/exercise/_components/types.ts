import { PeriodicTest } from "@/payload-types";

export interface ClassInfo {
  name: string;
  sub: string;
  value: number;
  max: number;
}

export interface Session {
  date: string;
  homework?: PeriodicTest[] | null;
  extra_homework?: (string | PeriodicTest)[] | null;
  link_recording?: string | null;
  id?: string | null;
}
