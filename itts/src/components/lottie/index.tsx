import { cn } from "@/lib/utils";
import lottie, { AnimationConfig, AnimationItem } from "lottie-web";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface AnimationEventListener {
  eventName: string;
  callback: (args?: any) => void;
}

interface LottieOptions extends Partial<AnimationConfig> {
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  segments?: number[];
  rendererSettings?: {
    preserveAspectRatio?: string;
    clearCanvas?: boolean;
    progressiveLoad?: boolean;
    hideOnTransparent?: boolean;
  };
}

interface LottieAnimationProps {
  options: LottieOptions;
  eventListeners?: AnimationEventListener[];
  height?: number | string;
  width?: number | string;
  isStopped?: boolean;
  isPaused?: boolean;
  speed?: number;
  segments?: number[];
  direction?: number;
  // ariaRole?: string;
  ariaLabel?: string;
  isClickToPauseDisabled?: boolean;
  title?: string;
  style?: React.CSSProperties;
  className?: string;
  isActive?: boolean;
  playOnHover?: boolean;
  handleClick?: (T: never) => void;
  name: string;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  options,
  eventListeners = [],
  width,
  height,
  isStopped = false,
  isPaused = false,
  speed = 1,
  segments,
  direction = 1,
  // ariaRole = "button",
  ariaLabel = "animation",
  title = "",
  style = {},
  className,
  isActive = false,
  playOnHover = false,
  handleClick = () => null,
  name,
}) => {
  const element = useRef<HTMLDivElement>(null);
  const lottieInstance = useRef<AnimationItem | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Initialize animation
  useEffect(() => {
    if (!element.current) return;
    element.current.style.display = "block";

    // Create animation config
    const config: AnimationConfig = {
      container: element.current,
      renderer: "svg",
      loop: options.loop !== false,
      autoplay: options.autoplay ?? isActive,
      animationData: options.animationData,
      rendererSettings: options.rendererSettings,
      name,
    };

    // Load animation
    lottieInstance.current = lottie.loadAnimation(config);

    // Register event listeners
    eventListeners.forEach(({ eventName, callback }) => {
      lottieInstance.current?.addEventListener(eventName, callback);
    });

    // Cleanup function
    // return () => {
    //   eventListeners.forEach(({ eventName, callback }) => {
    //     lottieInstance.current?.removeEventListener(eventName, callback);
    //   });
    //   lottieInstance.current = null;
    // };
  }, [options.animationData]); // Only re-run if animation data changes

  // Handle active state and hover state
  useEffect(() => {
    if (!lottieInstance.current) return;

    if (isActive || (playOnHover && isHovered)) {
      lottieInstance.current.play();
    } else {
      lottieInstance.current.stop();
    }
  }, [isActive, isHovered, playOnHover]);

  // Handle speed and direction changes
  useEffect(() => {
    if (!lottieInstance.current) return;

    lottieInstance.current.setSpeed(speed);
    lottieInstance.current.setDirection(direction);
  }, [speed, direction]);

  // Handle play/pause/stop states
  useEffect(() => {
    if (!lottieInstance.current) return;

    if (isStopped) {
      lottieInstance.current.stop();
    } else if (segments) {
      lottieInstance.current.playSegments(segments, true);
    } else if (isPaused) {
      lottieInstance.current.pause();
    }
  }, [isStopped, isPaused, segments]);

  useEffect(() => {
    if (!lottieInstance.current) return;

    const onComplete = () => {
      // ẩn animation khi xong
      if (element.current) {
        element.current.style.display = "none";
      }
    };

    lottieInstance.current.addEventListener("complete", onComplete);

    return () => {
      lottieInstance.current?.removeEventListener("complete", onComplete);
    };
  }, []);

  const lottieStyles = useMemo(
    (): React.CSSProperties => ({
      width: typeof width === "number" ? `${width}px` : (width ?? "100%"),
      height: typeof height === "number" ? `${height}px` : (height ?? "100%"),
      overflow: "hidden",
      outline: "none",
      zIndex: 100,
      ...style,
    }),
    [width, height, style],
  );

  return (
    <div
      ref={element}
      style={lottieStyles}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title}
      // role={ariaRole}
      aria-label={ariaLabel}
      tabIndex={0}
      className={cn(className, `lottie-animation ${name}`)}
    />
  );
};

export default LottieAnimation;
