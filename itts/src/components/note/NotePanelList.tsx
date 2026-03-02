"use client";

import { format } from "date-fns";
import { Trash2Icon, XCircleIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useNote } from "./NoteContext";

export const NotePanelList = () => {
  const { isModalOpen, closeModal, notes, deleteNote } = useNote();

  return (
    isModalOpen && (
      <div className="z-50 h-[calc(100%-190px)] shadow-[0_0_60px_0_rgba(0,0,0,0.1)] pt-6 px-4 w-[354px] h-[536px] bg-white rounded-tl-[20px] rounded-bl-[20px] rounded-tr-none rounded-br-none absolute right-0 top-[80px]">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-[20px] ">Notepad</p>
          <XCircleIcon
            className="text-[#6D737A] cursor-pointer"
            onClick={closeModal}
          />
        </div>

        <Input className="mt-6 mb-4" placeholder="Search for your note..." />

        <div className="overflow-y-auto h-[calc(100%-120px)]">
          {notes.map((note) => (
            <div key={note.id} className="flex flex-col  mb-4">
              <div className="flex items-center gap-2 justify-between mb-2">
                <p className="font-semibold text-[16px] text-[#E72929]">
                  {format(new Date(note.id), "dd/MM h:mm a")}
                </p>
                <Trash2Icon
                  className="text-[#E72929] cursor-pointer"
                  onClick={() => deleteNote(note.id)}
                />
              </div>
              <div className="text-[#6D737A] font-semibold">{note.content}</div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};
