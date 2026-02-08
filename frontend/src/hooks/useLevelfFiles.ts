import { useEffect, useState } from "react";
import filterOutViteFiles from "../utils/filterOutViteFiles";
import type { LevelFiles } from "../utils/types";

interface UseLevelFilesProps {
  chapterName?: string;
  levelURL?: string;
  setTestFuncCode: (code: string | null) => void;
  setInputTestFuncCode: (code: string | null) => void;
}

function getStorageKey(chapter: string, level: string) {
  return `level_${chapter}_${level}`;
}

function loadFromStorage(key: string) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function useLevelFiles({
  chapterName,
  levelURL,
  setTestFuncCode,
  setInputTestFuncCode,
}: UseLevelFilesProps) {
  const [files, setFiles] = useState<LevelFiles>({});

  useEffect(() => {
    if (!chapterName || !levelURL) return;
    let cancelled = false;

    setTestFuncCode(null);
    setInputTestFuncCode(null);

    const safeChapter = chapterName.replace(/[^a-zA-Z0-9_-]/g, "");
    const safeLevel = levelURL.replace(/[^a-zA-Z0-9_-]/g, "");
    const base = `/${safeChapter}/${safeLevel}`;
    const storageKey = getStorageKey(safeChapter, safeLevel);

    const tryFetch = async (path: string) => {
      try {
        const res = await fetch(path);
        if (res.ok) return filterOutViteFiles(await res.text());
      } catch {}
      return undefined;
    };

    const loadFiles = async () => {
      const newFiles: LevelFiles = {};
      const saved = loadFromStorage(storageKey);

      
      const fetchPromises: Record<string, Promise<string | undefined>> = {};

      if (saved?.html) {
        newFiles.html = filterOutViteFiles(saved.html);
      } else {
        fetchPromises.html = tryFetch(`${base}/index.html`);
      }

      if (saved?.css) {
        newFiles.css = filterOutViteFiles(saved.css);
      } else {
        fetchPromises.css = tryFetch(`${base}/style.css`);
      }

      if (saved?.js) {
        newFiles.js = filterOutViteFiles(saved.js);
      } else {
        fetchPromises.js = tryFetch(`${base}/index.js`);
      }

      
      fetchPromises.instructions = tryFetch(`${base}/instructions.md`);
      fetchPromises.test = tryFetch(`${base}/test.js`);
      fetchPromises.inputTest = tryFetch(`${base}/userInputTest.js`);

      
      const results = await Promise.all(
        Object.entries(fetchPromises).map(async ([key, promise]) => [key, await promise])
      );

      
      for (const [key, value] of results) {
        if (value) {
          if (key === 'html') newFiles.html = value;
          else if (key === 'css') newFiles.css = value;
          else if (key === 'js') newFiles.js = value;
          else if (key === 'instructions') newFiles.instructions = value;
          else if (key === 'test') setTestFuncCode(value);
          else if (key === 'inputTest') setInputTestFuncCode(value);
        }
      }

      if (!cancelled) {
        setFiles(newFiles);
      }
    };

    loadFiles();
    return () => {
      cancelled = true;
    };
  }, [chapterName, levelURL, setTestFuncCode, setInputTestFuncCode]);

  return files;
}
