"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useEditorStateCache } from "../editor/context/EditorStateCache";

interface TextHighlighterProps {
  children: React.ReactNode;
  className?: string;
  cacheKey?: string;
}

interface TooltipPosition {
  x: number;
  y: number;
}

export default function TextHighlighter({
  children,
  className = "",
  cacheKey,
}: TextHighlighterProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const editorStateCache = useEditorStateCache();
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({
    x: 0,
    y: 0,
  });
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  // Restore from cache on mount
  const [cachedHTML, setCachedHTML] = useState<string | null>(null);

  useEffect(() => {
    if (cacheKey && editorStateCache) {
      const cached = editorStateCache.getCache(cacheKey);
      if (typeof cached === "string") {
        setCachedHTML(cached);
      } else if (
        cached &&
        typeof cached === "object" &&
        "editorState" in cached
      ) {
        // Handle EditorCacheData structure if accidentally stored there
        setCachedHTML(cached.editorState);
      }
    }
  }, [cacheKey, editorStateCache]);

  const saveToCache = useCallback(() => {
    if (cacheKey && editorStateCache && containerRef.current) {
      const html = containerRef.current.innerHTML;
      editorStateCache.setCache(cacheKey, html as any);
    }
  }, [cacheKey, editorStateCache]);

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setShowTooltip(false);
      return;
    }

    // Kiểm tra selection có nằm trong container không
    const range = selection.getRangeAt(0);
    if (!containerRef.current?.contains(range.commonAncestorContainer)) {
      setShowTooltip(false);
      return;
    }

    const rect = range.getBoundingClientRect();

    // Tính vị trí tooltip
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8,
    });

    setSavedRange(range.cloneRange());
    setShowTooltip(true);
  }, []);

  const handleHighlight = useCallback(() => {
    if (!savedRange) return;

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(savedRange);

    if (selection?.isCollapsed) {
      setShowTooltip(false);
      return;
    }

    const range = savedRange;
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;

    // Tìm parent highlight của start container
    let startHighlightParent: HTMLElement | null = null;
    let node: Node | null =
      startContainer.nodeType === Node.TEXT_NODE
        ? startContainer.parentNode
        : startContainer;
    while (node && node !== document.body) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).classList?.contains("highlighted")
      ) {
        startHighlightParent = node as HTMLElement;
        break;
      }
      node = node.parentNode;
    }

    // Tìm parent highlight của end container
    let endHighlightParent: HTMLElement | null = null;
    node =
      endContainer.nodeType === Node.TEXT_NODE
        ? endContainer.parentNode
        : endContainer;
    while (node && node !== document.body) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).classList?.contains("highlighted")
      ) {
        endHighlightParent = node as HTMLElement;
        break;
      }
      node = node.parentNode;
    }

    // Nếu cả start và end đều trong cùng 1 highlighted span -> unhighlight
    if (
      startHighlightParent &&
      endHighlightParent &&
      startHighlightParent === endHighlightParent
    ) {
      const highlightedSpan = startHighlightParent;
      const textNode = document.createTextNode(
        highlightedSpan.textContent || "",
      );
      highlightedSpan.parentNode?.replaceChild(textNode, highlightedSpan);
    } else {
      // Highlight: Wrap selection trong span
      try {
        const contents = range.extractContents();
        const span = document.createElement("span");
        span.className = "highlighted bg-[rgb(255,239,183)]";
        span.appendChild(contents);
        range.insertNode(span);
      } catch (error) {
        console.error("Error highlighting text:", error);
      }
    }

    saveToCache();
    selection?.removeAllRanges();
    setShowTooltip(false);
    setSavedRange(null);
  }, [saveToCache, savedRange]);

  // Đóng tooltip khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".highlight-tooltip")) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {cachedHTML ? (
        <span
          ref={containerRef}
          className={className}
          onMouseUp={handleMouseUp}
          dangerouslySetInnerHTML={{ __html: cachedHTML }}
        />
      ) : (
        <span
          ref={containerRef}
          className={className}
          onMouseUp={handleMouseUp}
        >
          {children}
        </span>
      )}
      {showTooltip &&
        createPortal(
          <div
            className="highlight-tooltip fixed z-[9999] flex items-center gap-2 rounded bg-[#6D737A] px-3 py-1.5 text-sm text-white shadow-lg"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: "translateX(-50%)",
            }}
          >
            <button
              onClick={handleHighlight}
              className="hover:text-yellow-200 transition-colors"
            >
              Highlight
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
