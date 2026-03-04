import { AttendanceRecord } from "@/payload/collections/AttendanceRecord";
import type { CollectionConfig } from "payload";
import { Admins } from "./Admins";
import { BandScore } from "./BandScore";
import { BookingSchedule } from "./BookingSchedule";
import { Branches } from "./Branches";
import { Classes } from "./Classes";
import { Coupons } from "./Coupons";
import { Courses } from "./Courses";
import { Feedbacks } from "./Feedbacks";
import { Leads } from "./Leads";
import { Media } from "./Media";
import { Notifications } from "./Notifications";
import { Orders } from "./Orders";
import { Pages } from "./Pages";
import { PeriodicTestAttempts } from "./PeriodicTestAttempts";
import { PeriodicTests } from "./PeriodicTests";
import { PersonalVocabulary } from "./PersonalVocabulary";
import { PlacementAttempts } from "./PlacementAttempts";
import { PlacementTests } from "./PlacementTests";
import { RolePermissions } from "./RolePermissions";
import { Rooms } from "./Rooms";
import { StudentCare } from "./StudentCare";
import { TestBackups } from "./TestBackups";
import { Tests } from "./Tests";
import { Users } from "./Users";
import { Vocabulary } from "./Vocabulary";
import { VocabularyProgress } from "./VocabularyProgress";
import { Words } from "./Words";

const collections: CollectionConfig[] = [
  Courses,
  PlacementTests,
  PlacementAttempts,
  Media,
  Pages,
  Users,
  Admins,
  Coupons,
  Orders,
  Leads,
  Tests,
  Classes,
  Feedbacks,
  Vocabulary,
  Branches,
  Rooms,
  BandScore,
  Words,
  VocabularyProgress,
  PersonalVocabulary,
  PeriodicTests,
  BookingSchedule,
  PeriodicTestAttempts,
  StudentCare,
  TestBackups,
  AttendanceRecord,
  Notifications,
  RolePermissions,
  // QuestionSets,
];

export default collections;
