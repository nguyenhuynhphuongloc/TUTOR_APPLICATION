"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type Note = {
  id: string;
  content: string;
  createdAt: Date;
};

type NoteContextType = {
  notes: Note[];
  addNote: (content: string) => void;
  openModal: () => void;
  closeModal: () => void;
  isModalOpen: boolean;
  deleteNote: (id: string) => void;
  resetNote: () => void;
};

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addNote = (content: string) => {
    const newNote = {
      id: Date.now(),
      content,
      createdAt: new Date(),
    };
    setNotes((prev) => [newNote, ...prev]);
    openModal();
  };
  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const resetNote = () => setNotes([]);

  return (
    <NoteContext.Provider
      value={{
        notes,
        addNote,
        openModal,
        closeModal,
        isModalOpen,
        deleteNote,
        resetNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNote = () => {
  const context = useContext(NoteContext);
  if (!context) throw new Error("useNote must be used within a NoteProvider");
  return context;
};
