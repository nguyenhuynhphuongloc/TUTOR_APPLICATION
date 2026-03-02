"use client";

import dynamic from "next/dynamic";
import React, { Fragment } from "react";

import type { Props } from "./types";

const ImageMedia = dynamic(() =>
  import("./image-media").then((mod) => mod.ImageMedia),
);
const VideoMedia = dynamic(() =>
  import("./video-media").then((mod) => mod.VideoMedia),
);
const AudioMedia = dynamic(
  () => import("./audio-media").then((mod) => mod.AudioPlayer),
  { ssr: false },
);

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = "div", resource, disablePause } = props;

  const isVideo =
    typeof resource === "object" && resource?.mimeType?.includes("video");
  const isAudio =
    typeof resource === "object" && resource?.mimeType?.includes("audio");

  const Tag =
    typeof htmlElement === "string"
      ? (htmlElement as keyof React.JSX.IntrinsicElements)
      : Fragment;

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      {isVideo ? (
        <VideoMedia {...props} />
      ) : isAudio ? (
        <AudioMedia {...props} />
      ) : (
        <ImageMedia {...props} />
      )}
    </Tag>
  );
};
