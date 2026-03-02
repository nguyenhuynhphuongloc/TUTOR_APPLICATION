import { roundIELTS } from "@/lib/utils";
import { Word } from "@/payload-types";

export const COLUMN_COUNT = 5;

/**
 * Transforms an array of data into a 2D array with specified dimensions.
 *
 * @template T - The type of elements in the data array.
 * @param {T[]} data - The array of data to be transformed.
 * @param {number} columnCount - The number of columns in the resulting 2D array.
 * @param {number} rowCount - The number of rows in the resulting 2D array.
 * @returns {T[][]} - A 2D array with the specified number of columns and rows.
 */
export const transformData = (data: any[]) => {
  const rowCount = Math.ceil(data.length / COLUMN_COUNT);
  // Create an array of 'columnCount' empty arrays
  const grid: any[][] = Array.from({ length: COLUMN_COUNT }, () => []);

  data.forEach((item, index) => {
    const colIndex = Math.floor(index / rowCount);
    if (grid[colIndex]) {
      grid[colIndex].push(item);
    }
  });

  return grid;
};

export function flattenResults(data: Record<string, any>) {
  const results: any[] = [];

  for (const partKey in data) {
    const part = data[partKey];
    if (typeof part !== "object" || part === null) continue;

    for (const itemKey in part) {
      const item = part[itemKey];
      if (typeof item === "object" && item !== null) {
        results.push(item);
      }
    }
  }

  return results;
}

export function getAverageScore(data, part) {
  if (!Array.isArray(data) || !data[part]) return 0;

  const item = data[part];
  // Lấy tất cả key có hậu tố "Score" nhưng không bao gồm "overallScore"
  const scoreKeys = Object.keys(item).filter(
    (key) => key.endsWith("Score") && key !== "overallScore",
  );

  // Tính tổng điểm (chuyển sang số để tránh lỗi khi là string)
  const total = scoreKeys.reduce((sum, key) => sum + Number(item[key] || 0), 0);

  // Tính trung bình
  const average = scoreKeys.length ? total / scoreKeys.length : 0;

  return roundIELTS(average);
}

export const handleSearch = (
  ref: React.MutableRefObject<HTMLDivElement | null>,
  query: string,
): void => {
  const el = ref.current;
  if (!el) return;

  // Remove old highlights if any
  const prevMarks = el.querySelectorAll(".highlight");
  prevMarks.forEach((mark) => {
    const parent = mark.parentNode!;
    parent.replaceChild(document.createTextNode(mark.textContent || ""), mark);
    parent.normalize();
  });

  if (!query.trim()) return;

  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = escaped.replace(/\s+/g, "\\s+");
  const regex = new RegExp(pattern, "gi");

  // --- Strategy 1: Simple single-node match (fast path) ---
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  let firstHighlight: HTMLElement | null = null;

  while ((node = walker.nextNode())) {
    const text = node.nodeValue;
    if (!text) continue;
    const match = text.match(regex);
    if (match) {
      const span = document.createElement("span");
      span.className = "highlight";
      span.style.backgroundColor = "#FFEFB7";
      span.style.color = "black";
      const parts = text.split(regex);

      const frag = document.createDocumentFragment();
      parts.forEach((part, i) => {
        frag.appendChild(document.createTextNode(part));
        if (i < parts.length - 1) {
          const highlight = span.cloneNode() as HTMLSpanElement;
          highlight.textContent = match[i] || match[0];
          frag.appendChild(highlight);
          if (!firstHighlight) firstHighlight = highlight;
        }
      });

      node.parentNode?.replaceChild(frag, node);
    }
  }

  // --- Strategy 2: Cross-node match (for Lexical Editor split text) ---
  if (!firstHighlight) {
    // Collect all text nodes
    const textNodes: Text[] = [];
    const walker2 = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let n: Node | null;
    while ((n = walker2.nextNode())) {
      if (n.nodeValue) textNodes.push(n as Text);
    }

    // Build concatenated string with node boundaries
    let fullText = "";
    const nodeMap: { node: Text; start: number; end: number }[] = [];
    textNodes.forEach((tn) => {
      const start = fullText.length;
      fullText += tn.nodeValue || "";
      nodeMap.push({ node: tn, start, end: fullText.length });
    });

    const crossMatch = fullText.match(regex);
    if (crossMatch) {
      const matchIndex = fullText.search(regex);
      if (matchIndex !== -1) {
        const matchEnd = matchIndex + crossMatch[0].length;

        // Find all text nodes that overlap with the match
        for (const entry of nodeMap) {
          if (entry.end <= matchIndex || entry.start >= matchEnd) continue;

          const nodeText = entry.node.nodeValue || "";
          const overlapStart = Math.max(0, matchIndex - entry.start);
          const overlapEnd = Math.min(nodeText.length, matchEnd - entry.start);

          const before = nodeText.substring(0, overlapStart);
          const matched = nodeText.substring(overlapStart, overlapEnd);
          const after = nodeText.substring(overlapEnd);

          const frag = document.createDocumentFragment();
          if (before) frag.appendChild(document.createTextNode(before));

          const highlight = document.createElement("span");
          highlight.className = "highlight";
          highlight.style.backgroundColor = "#FFEFB7";
          highlight.style.color = "black";
          highlight.textContent = matched;
          frag.appendChild(highlight);
          if (!firstHighlight) firstHighlight = highlight;

          if (after) frag.appendChild(document.createTextNode(after));

          entry.node.parentNode?.replaceChild(frag, entry.node);
        }
      }
    }
  }

  if (firstHighlight) {
    firstHighlight.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
};

/**
 * Highlight text inside a Lexical Editor using CSS Custom Highlight API.
 * This does NOT modify the DOM, so Lexical won't revert the highlight.
 */
export const handleSearchInEditor = (
  ref: React.MutableRefObject<HTMLDivElement | null>,
  query: string,
): void => {
  // Inject the highlight style once
  if (!document.getElementById("search-highlight-style")) {
    const style = document.createElement("style");
    style.id = "search-highlight-style";
    style.textContent = `::highlight(search-highlight) { background-color: #FFEFB7; color: black; }`;
    document.head.appendChild(style);
  }

  // Clear previous highlights
  // @ts-ignore - CSS.highlights may not be in TS types yet
  if (CSS.highlights) {
    // @ts-ignore
    CSS.highlights.delete("search-highlight");
  }

  const el = ref.current;
  if (!el || !query.trim()) return;

  // Collect all text nodes
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n: Node | null;
  while ((n = walker.nextNode())) {
    if (n.nodeValue) textNodes.push(n as Text);
  }

  // Build concatenated string with node boundaries
  let fullText = "";
  const nodeMap: { node: Text; start: number; end: number }[] = [];
  textNodes.forEach((tn) => {
    const start = fullText.length;
    fullText += tn.nodeValue || "";
    nodeMap.push({ node: tn, start, end: fullText.length });
  });

  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = escaped.replace(/\s+/g, "\\s+");
  const regex = new RegExp(pattern, "gi");

  const ranges: Range[] = [];
  let firstStartEl: HTMLElement | null = null;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(fullText)) !== null) {
    const matchStart = match.index;
    const matchEnd = matchStart + match[0].length;

    let startNode: Text | null = null;
    let startOffset = 0;
    let endNode: Text | null = null;
    let endOffset = 0;

    for (const entry of nodeMap) {
      if (!startNode && entry.end > matchStart) {
        startNode = entry.node;
        startOffset = matchStart - entry.start;
      }
      if (entry.end >= matchEnd) {
        endNode = entry.node;
        endOffset = matchEnd - entry.start;
        break;
      }
    }

    if (startNode && endNode) {
      const range = document.createRange();
      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset);
      ranges.push(range);
      if (!firstStartEl) firstStartEl = startNode.parentElement;
    }
  }

  // @ts-ignore - CSS.highlights may not be in TS types yet
  if (CSS.highlights && ranges.length > 0) {
    // @ts-ignore
    const highlight = new Highlight(...ranges);
    // @ts-ignore
    CSS.highlights.set("search-highlight", highlight);
  } else if (ranges.length > 0) {
    // Fallback: use Selection API for older browsers
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      if (ranges[0]) selection.addRange(ranges[0]);
    }
  }

  // Scroll to first match
  if (firstStartEl) {
    firstStartEl.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
};

export function countTotalWords(text: string): number {
  const cleanedText = text.replace(/[^a-zA-Z0-9\s]/g, " ").trim();

  const words: string[] = cleanedText.split(/\s+/).filter(Boolean);

  return words.length;
}

type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

/**
 * Returns all words that have a higher CEFR level than the current one.
 *
 * @param currentLevel - the user's current CEFR level (A1–C2)
 * @param words - an array of words with their CEFR levels
 * @returns an array of words with a higher level than currentLevel
 */
export function getHigherLevelWords(
  currentLevel: CEFRLevel,
  words: Word[],
): Word[] | null {
  const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const currentIndex = levels.indexOf(currentLevel);

  if (currentIndex === -1) {
    return null;
  }

  return words.filter((word) => levels.indexOf(word.level) > currentIndex);
}
