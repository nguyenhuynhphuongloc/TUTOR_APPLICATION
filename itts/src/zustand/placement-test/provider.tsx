"use client";

import { createContext, type ReactNode, useContext, useRef } from "react";
import { useStore as useZustand } from "zustand";

import { type Actions, createStore, type State } from "./store";

type StoreType = State & Actions;

export type StoreApi = ReturnType<typeof createStore>;

export const StoreContext = createContext<StoreApi | undefined>(undefined);

export interface StoreProviderProps {
  children: ReactNode;
  initialState?: Partial<State>;
}

export const StoreProvider = ({
  children,
  initialState = {},
}: StoreProviderProps) => {
  const storeRef = useRef<StoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createStore(initialState);
  }
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = <T,>(selector: (store: StoreType) => T): T => {
  const placementTestStoreContext = useContext(StoreContext);
  if (!placementTestStoreContext) {
    throw new Error(
      `useStore must be used within a StoreProvider. Please ensure that your component is wrapped in <StoreProvider>`,
    );
  }
  return useZustand(placementTestStoreContext, selector);
};
