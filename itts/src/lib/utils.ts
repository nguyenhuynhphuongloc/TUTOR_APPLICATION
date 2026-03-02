/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { SkillAnswers } from "@/components/placement-tests/types";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { cloneDeep } from "lodash-es";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLastName(fullName: string) {
  if (typeof fullName !== "string" || !fullName.trim()) return "";

  const nameParts = fullName.trim().split(/\s+/);
  return nameParts.length > 1 ? nameParts.pop() : nameParts[0];
}

/**
 * Creates a lookup map from an array of options.
 * @param {Record<string, unknown>[]} options - the array of options
 * @param {string} [key="value"] - the key to use for the map key
 * @param {string} [value="label"] - the key to use for the map value
 * @returns {Map<string, string>} - a new Map with the options
 */
export const createLookupMap = <T extends Record<string, unknown>>(
  options: T[],
  key: keyof T = "value" as keyof T,
  value: keyof T = "label" as keyof T,
): Map<string, string> =>
  new Map(options.map((item) => [item[key] as string, item[value] as string]));

export const generatePDF = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id ${elementId} not found`);
  }
  const canvas = await html2canvas(element, {
    scale: 2, // Keep scale for higher resolution
    useCORS: true, // Enable if external resources are used
    logging: true, // Debug rendering issues
  });
  const data = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [canvas.width / 8, canvas.height / 8 + 10],
  });
  const imgProperties = pdf.getImageProperties(data);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

  pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(fileName);
};

export function capitalizeFirstLetter(str: string) {
  if (!str) return str; // Handle empty strings
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const calculateDuration = (startedAt: string, completedAt: string) => {
  const start = new Date(startedAt);
  const end = new Date(completedAt);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      totalMinutes: 0,
      formattedTime: "00:00",
    };
  }

  const diffMs = end.getTime() - start.getTime(); // Difference in milliseconds

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);

  // Total seconds and minutes for convenience
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(diffMs / 60000);

  // Format the time as "hh:mm:ss" or "mm:ss" depending on whether there are hours
  let formattedTime;
  if (hours > 0) {
    formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  } else {
    formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return {
    hours,
    minutes,
    seconds,
    totalSeconds,
    totalMinutes,
    formattedTime,
  };
};

export const uploadSpeakingAudios = async (
  leadId: string,
  answers: SkillAnswers,
) => {
  const tasks = [];

  const speaking = cloneDeep(answers);

  for (const part in answers) {
    const partItem = answers[part];

    for (const topic in partItem) {
      const topicItem = partItem[topic];

      for (const question in topicItem) {
        const questionItem = topicItem[question];
        const blob = questionItem.answer;
        const id = questionItem.id;

        tasks.push(
          (async () => {
            const file = new File(
              [blob],
              `entranceTest_${id}_${leadId}_${new Date().getTime()}.wav`,
              {
                type: blob.type,
              },
            );

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/media", {
              method: "POST",
              body: formData,
            });

            if (!response.ok) throw new Error(`Failed to upload ${id}`);

            const { doc } = await response.json();

            speaking[part][topic][question].answer = doc;

            return { id, status: "uploaded" };
          })(),
        );
      }
    }
  }

  await Promise.allSettled(tasks);

  return speaking;
};

export const getBandScoreListeningAndReading = (count: number) => {
  switch (true) {
    case count >= 39:
      return 9.0;
    case count >= 37:
      return 8.5;
    case count >= 35:
      return 8.0;
    case count >= 33:
      return 7.5;
    case count >= 30:
      return 7.0;
    case count >= 27:
      return 6.5;
    case count >= 23:
      return 6.0;
    case count >= 20:
      return 5.5;
    case count >= 16:
      return 5.0;
    case count >= 13:
      return 4.5;
    case count >= 10:
      return 4.0;
    case count >= 7:
      return 3.5;
    case count >= 5:
      return 3.0;
    case count >= 3:
      return 2.5;
    default:
      return 0;
  }
};

export const customRound = (num: number) => {
  const integerPart = Math.floor(num);
  const decimalPart = num - integerPart;

  if (decimalPart >= 0.875) {
    return integerPart + 1;
  } else if (decimalPart >= 0.25) {
    return integerPart + 0.5;
  } else {
    return integerPart;
  }
};

/**
 * Rounds a score according to IELTS rules:
 * - Fractional part < 0.25 rounds down to .0
 * - 0.25 <= fractional part < 0.75 rounds to .5
 * - fractional part >= 0.75 rounds up to the next .0
 */
export function roundIELTS(score: number): number {
  const floor = Math.floor(score);
  const fraction = score - floor;

  if (fraction < 0.25) {
    return floor;
  } else if (fraction >= 0.25 && fraction < 0.75) {
    return floor + 0.5;
  } else {
    return floor + 1;
  }
}

interface AnswerItem {
  id: string;
  answer: string;
}

type NestedObject = Record<string, any>;

/**
 * Flattens a nested object into an array of AnswerItem objects.
 *
 * @param {NestedObject} obj - The object to flatten.
 * @returns {AnswerItem[]} An array of AnswerItem objects.
 */
export const flattenObject = (obj: NestedObject): AnswerItem[] => {
  const result: AnswerItem[] = [];

  function recurse(current: NestedObject): void {
    for (const key in current) {
      if (current[key].id) {
        result.push({
          id: current[key].id as string,
          answer: current[key].answer as string,
        });
      } else {
        recurse(current[key]);
      }
    }
  }

  recurse(obj);
  return result;
};

export function flattenAndReindex(obj) {
  const result = {};
  let index = 0;

  for (const topKey in obj) {
    const secondLevel = obj[topKey];
    for (const secondKey in secondLevel) {
      const thirdLevel = secondLevel[secondKey];
      for (const thirdKey in thirdLevel) {
        result[index] = thirdLevel[thirdKey];
        index++;
      }
    }
  }

  return result;
}

export async function getBlobDuration(blob) {
  const tempVideoEl = document.createElement("video");

  const durationP = new Promise((resolve, reject) => {
    tempVideoEl.addEventListener("loadedmetadata", () => {
      // Chrome bug: https://bugs.chromium.org/p/chromium/issues/detail?id=642012
      if (tempVideoEl.duration === Infinity) {
        tempVideoEl.currentTime = Number.MAX_SAFE_INTEGER;
        tempVideoEl.ontimeupdate = () => {
          tempVideoEl.ontimeupdate = null;
          resolve(tempVideoEl.duration);
          tempVideoEl.currentTime = 0;
        };
      }
      // Normal behavior
      else resolve(tempVideoEl.duration);
    });
    tempVideoEl.onerror = (event) => reject(event.target.error);
  });

  tempVideoEl.src =
    typeof blob === "string" || blob instanceof String
      ? blob
      : window.URL.createObjectURL(blob);

  return durationP;
}

export function playSound(url: string, onEnd?: () => void) {
  const audio = new Audio(`/sound/${url}.mp3`);

  if (onEnd) {
    audio.addEventListener("ended", onEnd);
  }
  audio.play().catch((err) => {
    console.error("Failed to play sound:", err);
  });
}

export function formatSecondsToHMS(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // padStart để đảm bảo luôn có 2 chữ số
  return [hours, minutes, secs]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
}

export function isMobileUserAgent(userAgent: string): boolean {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    userAgent,
  );
}

/**
 * Gets the index of the last past session plus one.
 * If there are no past sessions, returns null.
 * @param {Session[]} arr - An array of sessions.
 * @returns {number } - The index of the last past session plus one, or null if there are no past sessions.
 */
export function getLastPastIndexPlusOne(arr: Session[]): number {
  if (!arr || arr.length === 0) return 1;

  const now = new Date();

  // Giờ hiện tại theo UTC+7
  const nowVN = new Date(now.getTime() + 7 * 60 * 60 * 1000);

  // Lọc ra các buổi có date < thời điểm hiện tại (theo VN)
  const pastSessions: Session[] = arr
    .map((item, index) => ({ ...item, index }))
    .filter((item) => new Date(item.date).getTime() < nowVN.getTime());

  if (pastSessions.length === 0) return null;

  // Sắp xếp giảm dần để lấy buổi gần nhất
  pastSessions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return pastSessions![0]!.index + 1;
}

export const convertNestedObjectToArray = (obj) => {
  return Object.keys(obj)
    .sort((a, b) => Number(a) - Number(b))
    .map((level1Key) => {
      const level1Value = obj[level1Key];

      return Object.keys(level1Value)
        .sort((a, b) => Number(a) - Number(b))
        .map((level2Key) => {
          const level2Value = level1Value[level2Key];

          return Object.keys(level2Value)
            .sort((a, b) => Number(a) - Number(b))
            .map((level3Key) => {
              return level2Value[level3Key];
            });
        });
    });
};

export const formatTime = (seconds: number) => {
  const date = new Date(seconds * 1000); // convert seconds → milliseconds
  return format(date, "mm:ss");
};

export const highlightWords = (
  el: HTMLElement,
  words: string[],
  className: string,
) => {
  if (!el) return;

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const regex = new RegExp(`\\b(${words.join("|")})\\b`, "gi");

  let node: Text | null;

  while ((node = walker.nextNode() as Text | null)) {
    const text = node.nodeValue;
    if (!text) continue;

    const matches = [...text.matchAll(regex)];
    if (matches.length === 0) continue;

    const frag = document.createDocumentFragment();
    let last = 0;

    matches.forEach((m) => {
      const start = m.index!;
      const end = start + m[0].length;

      frag.appendChild(document.createTextNode(text.slice(last, start)));

      const span = document.createElement("span");
      span.className = className;
      span.textContent = m[0];
      frag.appendChild(span);

      last = end;
    });

    frag.appendChild(document.createTextNode(text.slice(last)));

    node.replaceWith(frag);
  }
};

export const removeHighlightByClass = (el: HTMLElement, className: string) => {
  if (!el) return;

  const marks = el.querySelectorAll("." + className);
  marks.forEach((mark) => {
    const textNode = document.createTextNode(mark.textContent || "");
    mark.replaceWith(textNode);
    textNode.parentNode?.normalize();
  });
};

export interface Session {
  date: string;
  [key: string]: any;
}

import get from "lodash-es/get";
import set from "lodash-es/set";

export function setAndMerge(obj, path, value) {
  const original = get(obj, path);

  // nếu original không phải object → ép thành object để khỏi ghi đè
  const safeOriginal =
    original && typeof original === "object" && !Array.isArray(original)
      ? original
      : {};

  return set({ ...obj }, path, { ...safeOriginal, ...value });
}

export const flattenData = (data) =>
  data.map((item) => {
    const keys = Object.keys(item);
    const childKey = keys.find(
      (k) => typeof item[k] === "object" && !Array.isArray(item[k]),
    );

    const extraProps = keys
      .filter((k) => k !== childKey)
      .reduce((acc, k) => ({ ...acc, [k]: item[k] }), {});

    return {
      ...item[childKey],
      ...extraProps,
    };
  });

/**
 * Checks if an answer sheet object is empty.
 * An answer sheet is considered empty if it's null, has no keys, or all its skill keys contain empty or null data.
 * @param {any} sheet - The answer sheet object to check.
 * @returns {boolean} - True if the answer sheet is empty, false otherwise.
 */
export const isAnswerSheetEmpty = (sheet: any) => {
  if (!sheet) return true;
  const keys = Object.keys(sheet);
  if (keys.length === 0) return true;

  // Deep check: if all skill sections are empty or null
  return keys.every((key) => {
    const skillData = sheet[key];
    return (
      !skillData ||
      (typeof skillData === "object" && Object.keys(skillData).length === 0)
    );
  });
};
