import AudioPlayer from "@/components/audio-player";
import Editor from "@/components/editor";
import previewEditorTheme from "@/components/editor/themes/PreviewEditorTheme";
import type { EditorValue } from "@/components/placement-tests/types";
import StarDivider from "@/components/StarDivider/StarDivider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Fragment, type RefObject } from "react";

/**
 * Renders a passage component with audio player and passage text.
 *
 * @param {{ audioURL: string, passage: string, passageRef: React.MutableRefObject<HTMLDivElement> }}
 * @returns {React.ReactElement}
 */
export default function Passage({
  audioURL,
  passage,
  passageRef,
  selectedSection,
  playerRef,
}: {
  audioURL: string;
  passage: string | EditorValue;
  passageRef: RefObject<HTMLParagraphElement | null>;
  selectedSection: number;
  playerRef: RefObject<HTMLAudioElement | null>;
}): React.ReactElement {
  return (
    <ScrollArea className="px-6 w-[50%]">
      {audioURL && (
        <Fragment>
          <AudioPlayer audioURL={audioURL} type="result" ref={playerRef} />
          <StarDivider className="mt-[19px] mb-[27px] px-0" />
        </Fragment>
      )}

      <p className="font-bold text-[32px] ">
        {audioURL ? "TRANSCRIPT" : `READING PASSAGE ${selectedSection + 1}`}
      </p>
      {audioURL ? (
        <div className="text-justify whitespace-pre-wrap" ref={passageRef}>
          {passage as string}
        </div>
      ) : (
        <div ref={passageRef}>
          <Editor
            value={passage as EditorValue}
            theme={previewEditorTheme}
            mode="practice"
          />
        </div>
      )}
    </ScrollArea>
  );
}
