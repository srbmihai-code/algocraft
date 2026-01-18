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
      if (saved) {
        if (saved.html) newFiles.html = filterOutViteFiles(saved.html);
        if (saved.css) newFiles.css = filterOutViteFiles(saved.css);
        if (saved.js) newFiles.js = filterOutViteFiles(saved.js);
      }

      if (!newFiles.html) {
        const html = await tryFetch(`${base}/index.html`);
        if (html) newFiles.html = html;
      }

      if (!newFiles.css) {
        const css = await tryFetch(`${base}/style.css`);
        if (css) newFiles.css = css;
      }

      if (!newFiles.js) {
        const js = await tryFetch(`${base}/index.js`);
        if (js) newFiles.js = js;
      }

      const instructions = await tryFetch(`${base}/instructions.md`);
      if (instructions) newFiles.instructions = instructions;

      const test = await tryFetch(`${base}/test.js`);
      setTestFuncCode(test ?? null);

      const inputTest = await tryFetch(`${base}/userInputTest.js`);
      setInputTestFuncCode(inputTest ?? null);

      setFiles(newFiles);
    };

    loadFiles();
  }, [chapterName, levelURL, setTestFuncCode, setInputTestFuncCode]);

  return files;
}
