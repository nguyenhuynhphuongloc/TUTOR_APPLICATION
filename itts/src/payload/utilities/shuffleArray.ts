/**
 * Fisher-Yates shuffle algorithm for shuffling an array of elements.
 * @param {T[]} array The array to be shuffled.
 * @returns {T[]} A new array with the elements shuffled.
 * @template T
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
