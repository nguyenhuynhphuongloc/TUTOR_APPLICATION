interface AudioProgressBarProps
  extends React.ComponentPropsWithoutRef<"input"> {
  duration: number;
  currentProgress: number;
}

export default function AudioProgressBar(props: AudioProgressBarProps) {
  const { duration, currentProgress, ...rest } = props;

  const progressPercent =
    duration && !isNaN(currentProgress / duration)
      ? (currentProgress / duration) * 100
      : 0;

  return (
    <div
      className=" h-[6px] bg-[#E729291A] w-full rounded-full relative cursor-pointer"
      {...rest}
    >
      <div
        style={{
          width: `${progressPercent}%`,
        }}
        className="h-[6px] rounded-full bg-[#E72929] transition-all duration-100 ease-in-out"
      ></div>
      <div
        className="absolute top-1/2 h-3 w-3 bg-[#E72929] rounded-full transform -translate-y-1/2 -translate-x-1/2 transition-all duration-100 ease-in-out"
        style={{
          left: `${progressPercent}%`,
        }}
      ></div>
      <input
        type="range"
        min={0}
        max={duration}
        value={currentProgress}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        {...rest}
      />
    </div>
  );
}
