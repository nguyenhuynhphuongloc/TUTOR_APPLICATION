export type FeedbackWeek = "week3" | "week8";

export type FeedbackComment = {
  studentId?: string;
  studentName?: string;
  teacherId?: string;
  teacherName?: string;
  createdAt?: string;
  comment: string;
};

export type FeedbackByWeek = {
  week3?: FeedbackComment[];
  week8?: FeedbackComment[];
};

export type FeedbackFormState = {
  comment: string;
};

export type SessionFeedbackData = {
  session?: number;
  overall_score?: string;
  target?: string;
  [key: string]: any;
};

export type FeedbackRecord = {
  id: string;
  class: string | { id: string };
  type: string;
  student_review_session: Record<string, Record<string, SessionFeedbackData>>;
  createdAt: string;
};
