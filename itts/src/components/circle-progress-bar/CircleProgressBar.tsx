/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React from "react";
import {
  VIEWBOX_CENTER_X,
  VIEWBOX_CENTER_Y,
  VIEWBOX_HEIGHT,
  VIEWBOX_HEIGHT_HALF,
  VIEWBOX_WIDTH,
} from "./constants";
import Path from "./Path";
import type {
  CircularProgressbarDefaultProps,
  CircularProgressbarProps,
} from "./types";

const CircularProgressbar: React.FC<CircularProgressbarProps> = (props) => {
  const {
    background = false,
    backgroundPadding = 0,
    circleRatio = 0.66,
    classes = {
      root: "CircularProgressbar",
      trail: "CircularProgressbar-trail",
      path: "CircularProgressbar-path",
      text: "CircularProgressbar-text",
      background: "CircularProgressbar-background",
    },
    counterClockwise = false,
    className = "",
    maxValue = 100,
    minValue = 0,
    strokeWidth = 8,
    styles = {
      root: {},
      trail: {},
      path: {},
      text: {},
      background: {},
    },
    text = "",
  }: CircularProgressbarDefaultProps = props;

  const getBackgroundPadding = () => (background ? backgroundPadding : 0);

  const getPathRadius = () => {
    return VIEWBOX_HEIGHT_HALF - strokeWidth / 2 - getBackgroundPadding();
  };

  const getPathRatio = () => {
    const { value } = props;
    const boundedValue = Math.min(Math.max(value, minValue), maxValue);
    return (boundedValue - minValue) / (maxValue - minValue);
  };

  const pathRadius = getPathRadius();
  const pathRatio = getPathRatio();

  return (
    <svg
      className={`${classes.root} ${className}`}
      style={styles.root}
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      data-test-id="CircularProgressbar"
    >
      {background && (
        <circle
          className={classes.background}
          style={styles.background}
          cx={VIEWBOX_CENTER_X}
          cy={VIEWBOX_CENTER_Y}
          r={VIEWBOX_HEIGHT_HALF}
        />
      )}

      <Path
        className={classes.trail}
        counterClockwise={counterClockwise}
        dashRatio={circleRatio}
        pathRadius={pathRadius}
        strokeWidth={strokeWidth}
        style={styles.trail}
      />

      <Path
        className={classes.path}
        counterClockwise={counterClockwise}
        dashRatio={pathRatio * circleRatio}
        pathRadius={pathRadius}
        strokeWidth={strokeWidth}
        style={styles.path}
      />

      {text && (
        <text
          className={classes.text}
          style={styles.text}
          x={VIEWBOX_CENTER_X}
          y={VIEWBOX_CENTER_Y}
        >
          {text}
        </text>
      )}
    </svg>
  );
};

export default CircularProgressbar;
