export const SKILLS_OPTIONS = [
  { label: "Reading", value: "reading" },
  { label: "Writing", value: "writing" },
  { label: "Speaking", value: "speaking" },
  { label: "Listening", value: "listening" },
  { label: "Grammar", value: "grammar" },
  { label: "Vocabulary", value: "vocabulary" },
];

export const LEAD_TYPE = [
  { label: "Học sinh", value: "student" },
  { label: "Sinh viên", value: "college_student" },
  { label: "Người đi làm", value: "office_worker" },
  { label: "Phụ Huynh", value: "parent" },
  { label: "Khác", value: "other" },
];

export const SESSION_FEEDBACK_OPTIONS = [
  {
    id: 1,
    name: "ontime",
    title: "Giáo viên (GV) có đến trễ không?",
    options: [
      {
        label: "Đúng giờ hoặc sớm hơn 5 phút giờ vào lớp",
        value: "1",
      },
      {
        label: "Trễ từ 1 phút - 5 phút so với giờ vào lớp",
        value: "2",
      },
      {
        label: "GV trễ trên 5 phút",
        value: "3",
      },
    ],
  },
  {
    id: 2,
    name: "skill_score",
    title: "GV dạy hay không?",
    options: [
      { label: "Có, rất thú vị hào hứng vui vẻ", value: "1" },
      {
        label:
          "Không, chán buồn ngủ, có vẻ chưa soạn bài kỹ hoặc có soạn nhưng chán quá",
        value: "2",
      },
      {
        label: "Bình Thường, cần cải thiện thêm để học tập thú vị hơn.",
        value: "3",
      },
    ],
  },
  {
    id: 3,
    name: "homework_fix",
    title: "GV có sửa BTVN của bạn",
    options: [
      {
        label: "Có, GV sửa BTVN kỹ lưỡng, tận tâm và không sửa qua loa.",
        value: "1",
      },
      {
        label:
          "Bình thường. GV chỉ đọc đáp án rồi sửa qua loa. (Tôi không hiểu tại sao tôi sai và chẳng cảm thấy học được gì sau BTVN)",
        value: "2",
      },
      {
        label:
          "Không sửa. GV không sửa BTVN, sửa chung chung cả lớp và hẹn khi khác sửa.",
        value: "3",
      },
    ],
  },
  {
    id: 4,
    name: "homework_score",
    title: "Bạn thấy thế nào về BTVN hôm nay?",
    options: [
      { label: "Hơi ít so với sức em", value: "1" },
      {
        label: "Khá là ổn áp ạ",
        value: "2",
      },
      { label: "Hơi nhiều nhưng mà em thích cái challenge này", value: "3" },
      { label: "Quá tải so với em TT.TT", value: "4" },
    ],
  },
  {
    id: 5,
    name: "feedback",
    title:
      "Lí do bạn có phản hồi như trên, và xin cho The Tutors những mong muốn của bạn để cải thiện tình hình. Ghi N/A nếu không có hoặc chỉ cần một lời cám ơn đến GV của bạn!",
    type: "textarea",
  },
  {
    id: 6,
    name: "wow",
    title: "Bạn đã biết WOW chưa?",
    options: [
      {
        label:
          "Mình đã nhắn tin cho WOW, đội ngũ hỗ trợ học thuật IELTS 7.5, hỗ trợ luyện speaking 1-1 và giải đáp mọi thắc mắc của học viên về bài học.",
        value: "1",
      },
      {
        label:
          "Mình biết WOW là gì nhưng chưa liên hệ WOW tại https://www.facebook.com/vowedtomakeyouwow/",
        value: "2",
      },
      {
        label: "Mình chưa biết WOW là gì nhưng giờ thi biết rồi",
        value: "3",
      },
    ],
  },
];

export const TOUR_STEP_IDS = {
  TIMER: "timer",
  SKILL: "skill",
  SWITCH_QUESTION: "switch-question",
  PICK_ANSWER: "pick-answer",
  // SWITCH_SKILL: "switch-skill",
  LISTENING: "listening",
  TAB: "tab",
  SUBMIT: "submit",
};

export const TOUR_READING_IDS = {
  HIGHLIGHT: "reading-highlight",
};

export const TOUR_KEYS = {
  PLACEMENT_FULL_READING: "has_seen_tour_placement_full_reading",
  PLACEMENT_FULL_LISTENING: "has_seen_tour_placement_full_listening",
  PERIODIC_FULL_READING: "has_seen_tour_periodic_full_reading",
  PERIODIC_FULL_LISTENING: "has_seen_tour_periodic_full_listening",
};

export const HAS_SEEN_TOUR_KEY = "has_seen_tour";

export const PLACEMENT_ATTEMPTS_STATUS_OPTIONS = [
  { label: "Chưa Hoàn Thành", value: "pending" },
  { label: "Hoàn Thành", value: "completed" },
  { label: "Đang Làm", value: "in_progress" },
];

export const TIME_FORMAT_PLACEMENT_TEST_FULL = [40, 60, 60, 20];
export const TIME_FORMAT_TEST_FULL_MAPPING = {
  listening: 40,
  reading: 60,
  writing: 60,
  speaking: 20,
};

export const dayMap: Record<string, string> = {
  "0": "Chủ nhật",
  "1": "Thứ 2",
  "2": "Thứ 3",
  "3": "Thứ 4",
  "4": "Thứ 5",
  "5": "Thứ 6",
  "6": "Thứ 7",
};

export const DEFAULT_BADGE_COLORS = {
  "--nav-badge-red-bg": "var(--theme-error-500, #ef4444)",
  "--nav-badge-red-text": "#ffffff",
  "--nav-badge-yellow-bg": "var(--theme-warning-500, #eab308)",
  "--nav-badge-yellow-text": "#000000",
  "--nav-badge-blue-bg": "var(--theme-elevation-500, #3b82f6)",
  "--nav-badge-blue-text": "#ffffff",
  "--nav-badge-green-bg": "var(--theme-success-500, #22c55e)",
  "--nav-badge-green-text": "#ffffff",
};
