// components/NoteModal.tsx
"use client";

import { PopoverTrigger } from "@radix-ui/react-popover";
import { useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent } from "../ui/popover";
import { Textarea } from "../ui/textarea";
import { useNote } from "./NoteContext";

export const NotePopover = () => {
  const { addNote } = useNote();
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    if (note.trim()) {
      addNote(note);
      setNote("");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Add Note</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2">
        <div className="flex flex-col items-center ">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Type your note..."
            className="border-[2px] p-2 mb-4 h-[100px] focus-visible:ring-0 focus:border-[#9FCEFF] focus:border-[2px] focus-visible:border-dashed focus:outline-none rounded-[0px]"
          />
          <div className="flex items-center gap-2">
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
