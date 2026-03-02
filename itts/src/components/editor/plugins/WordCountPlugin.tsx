import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { type JSX, useEffect, useState } from "react";
import { useSharedContext } from "../context/SharedContext";

type WordStats = {
  words: number;
  characters: number;
  charactersNoSpaces: number;
};

function getWordStats(text: string): WordStats {
  // Remove extra whitespace and split by spaces
  const wordsArray = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  return {
    words: wordsArray.length,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
  };
}

function DefaultRenderer({ stats }: { stats: WordStats }) {
  return (
    <p style={{ marginTop: 20, fontWeight: "bold" }}>
      <span>Words: {stats.words}</span>{" "}
      <span>Characters: {stats.characters}</span>{" "}
      <span>Characters (no spaces): {stats.charactersNoSpaces}</span>
    </p>
  );
}

export function WordCountPlugin({
  renderer = DefaultRenderer,
}: {
  renderer?: ({ stats }: { stats: WordStats }) => JSX.Element;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const mode = useSharedContext((state) => state.mode);

  const [stats, setStats] = useState<WordStats>({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
  });

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const text = root.getTextContent();
        const newStats = getWordStats(text);
        setStats(newStats);
      });
    });
  }, [editor]);

  if (mode !== "in_admin") {
    return <></>;
  }

  return renderer({ stats });
}
