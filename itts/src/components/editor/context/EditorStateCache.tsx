"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

export interface EditorCacheData {
  editorState: string;
  comments: any[];
}

interface EditorStateCacheContextType {
  getCache: (key: string) => EditorCacheData | undefined;
  setCache: (key: string, data: EditorCacheData) => void;
}

const EditorStateCacheContext =
  createContext<EditorStateCacheContextType | null>(null);

export function EditorStateCacheProvider({
  children,
}: {
  children: ReactNode;
}) {
  const cacheRef = useRef<Map<string, EditorCacheData>>(new Map());

  const getCache = useCallback((key: string) => {
    return cacheRef.current.get(key);
  }, []);

  const setCache = useCallback((key: string, data: EditorCacheData) => {
    cacheRef.current.set(key, data);
  }, []);

  const value = useMemo(() => ({ getCache, setCache }), [getCache, setCache]);

  return (
    <EditorStateCacheContext.Provider value={value}>
      {children}
    </EditorStateCacheContext.Provider>
  );
}

export function useEditorStateCache(): EditorStateCacheContextType | null {
  return useContext(EditorStateCacheContext);
}
