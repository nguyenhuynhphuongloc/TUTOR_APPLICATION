"use client";

import type { StaticImageData } from "next/image";

import NextImage from "next/image";
import React from "react";

import type { Props as MediaProps } from "../types";

import { cn } from "@/lib/utils";

const cssVariables = {
  breakpoints: {
    "3xl": 1920,
    "2xl": 1536,
    xl: 1280,
    lg: 1024,
    md: 768,
    sm: 640,
  },
};
const { breakpoints } = cssVariables;

// A base64 encoded image to use as a placeholder while the image is loading
const placeholderBlur =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAYUlEQVR4nO2WwQ3AIAwDj8r7z9g3M1tg/XL2jGwBGVgeAm4GNoGqT2dAuvOAZQgl1AyoTNoLMIAEnW2wCbiCGH0CsWMyOYFCjlMGjkO4Y0QhYZxYmCQrJb1oF4xOcH/YBoL8cvgAAAABJRU5ErkJggg==";

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    imgClassName,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    loading: loadingFromProps,
  } = props;

  let width: number | undefined;
  let height: number | undefined;
  let alt = altFromProps;
  let src: StaticImageData | string = srcFromProps || "";

  if (!src && resource && typeof resource === "object") {
    const {
      alt: altFromResource,
      height: fullHeight,
      url,
      width: fullWidth,
    } = resource;

    width = fullWidth!;
    height = fullHeight!;
    alt = altFromResource ?? "";

    const cacheTag = resource.updatedAt;

    // src = `${getClientSideURL()}${url}?${cacheTag}`;
    if (url) {
      const separator = url.includes("?") ? "&" : "?";
      src = `${url}${separator}v=${cacheTag}`;
    }
  }

  const loading = loadingFromProps ?? (!priority ? "lazy" : undefined);

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
        .join(", ");

  return (
    <picture>
      <NextImage
        alt={alt ?? ""}
        className={cn(imgClassName)}
        fill={fill}
        height={!fill ? height : undefined}
        placeholder="blur"
        blurDataURL={placeholderBlur}
        priority={priority}
        quality={100}
        loading={loading}
        sizes={sizes}
        src={src}
        width={!fill ? width : undefined}
      />
    </picture>
  );
};
