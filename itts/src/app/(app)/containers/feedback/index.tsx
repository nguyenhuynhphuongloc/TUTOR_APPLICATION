type FeedbackProps = {
  student: any;
  teacher: any;
  class: any;
  studyDates: string;
  score: number;
  highlight: string;
  improvement: string;
};

export default function Feedback({
  student,
  teacher,
  class: classRef,
  studyDates,
  score,
  highlight,
  improvement,
}: FeedbackProps) {
  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Feedback Học Tập
      </h1>

      {/* INFO */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong>Học viên:</strong>{" "}
          {student?.fullName || student?.email}
        </div>
        <div>
          <strong>Giáo viên:</strong>{" "}
          {teacher?.fullName || teacher?.email}
        </div>
        <div>
          <strong>Lớp:</strong> {classRef?.title || classRef?.id}
        </div>
        <div>
          <strong>Ngày học:</strong> {studyDates}
        </div>
        <div>
          <strong>Điểm Overall:</strong>{" "}
          <span className="font-semibold">{score}</span>
        </div>
      </div>

      {/* HIGHLIGHT */}
      <div>
        <h2 className="font-semibold">📌 Điểm nổi bật</h2>
        <p className="mt-1 whitespace-pre-line">{highlight}</p>
      </div>

      {/* IMPROVEMENT */}
      <div>
        <h2 className="font-semibold">📌 Cần cải thiện</h2>
        <p className="mt-1 whitespace-pre-line">{improvement}</p>
      </div>
    </div>
  );
}
