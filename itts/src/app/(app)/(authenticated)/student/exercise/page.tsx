"use client";
import PageLoading from "@/components/PageLoading";
import { ClassSelector } from "./_components/ClassSelector";
import { ExerciseSection } from "./_components/ExerciseSection";
import { OverviewCards } from "./_components/OverviewCards";
import { SessionNavigator } from "./_components/SessionNavigator";
import { useExerciseData } from "./_components/useExerciseData";

export default function ExercisePage() {
  const {
    classData,
    classes,
    isLoading,
    tab,
    session,
    homeworkAttempts,
    learnedSession,
    sessionInfo,
    exercises,
    deadline,
    classProgressInfo,
    attendanceData,
    user,
    setClasses,
    setTab,
    setSession,
  } = useExerciseData();

  if (isLoading || !classData || !session || !classes) {
    return <PageLoading />;
  }

  return (
    <div className="w-full">
      <ClassSelector
        currentClassId={classes.id}
        classes={classData}
        onClassChange={setClasses}
      />

      <OverviewCards classInfo={classProgressInfo} />

      <SessionNavigator
        session={session}
        classes={classes}
        sessionInfo={sessionInfo}
        learnedSession={learnedSession}
        attendanceData={attendanceData}
        userId={user?.id as string}
        onSessionChange={setSession}
      />

      <ExerciseSection
        classId={classes.id}
        session={session}
        tab={tab}
        onTabChange={setTab}
        exercises={exercises}
        homeworkAttempts={homeworkAttempts}
        deadline={deadline}
        sessionInfo={sessionInfo}
      />
    </div>
  );
}
