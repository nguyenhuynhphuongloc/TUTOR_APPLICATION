import * as migration_20241123_150550 from "./20241123_150550";

export const migrations = [
  {
    up: migration_20241123_150550.up,
    down: migration_20241123_150550.down,
    name: "20241123_150550",
  },
];
