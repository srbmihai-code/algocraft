import { useEffect, useState } from "react";
import filterOutViteFiles from "../utils/filterOutViteFiles";
import getCookie from "../utils/getCookie";
import type { LevelFiles } from "../utils/types";

interface UseLevelFilesProps {
  chapterName?: string;
  levelURL?: string;
  setTestFuncCode: (code: string | null) => void;
  setInputTestFuncCode: (code: string | null) => void;
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
    const cookieKey = `level_${safeChapter}_${safeLevel}`;

    const loadFiles = async () => {
      const newFiles: LevelFiles = {};

      const tryFetch = async (path: string) => {
        try {
          const res = await fetch(path);
          if (res.ok) return filterOutViteFiles(await res.text());
        } catch { }
        return undefined;
      };

      // Load from cookie first
      const cookieData = getCookie(cookieKey);
      if (cookieData) {
        try {
          const parsed = JSON.parse(cookieData);
          if (parsed.html) newFiles.html = filterOutViteFiles(parsed.html);
          if (parsed.css) newFiles.css = filterOutViteFiles(parsed.css);
          if (parsed.js) newFiles.js = filterOutViteFiles(parsed.js);
        } catch {}
      }

      // Load from server if missing
      const htmlText = await tryFetch(`${base}/index.html`);
      if (!newFiles.html && htmlText) newFiles.html = htmlText;

      const cssText = await tryFetch(`${base}/style.css`);
      if (!newFiles.css && cssText) newFiles.css = cssText;

      const jsText = await tryFetch(`${base}/index.js`);
      if (!newFiles.js && jsText) newFiles.js = jsText;

      const mdText = await tryFetch(`${base}/instructions.md`);
      if (mdText) newFiles.instructions = mdText;

      const testText = await tryFetch(`${base}/test.js`);
      if (testText) setTestFuncCode(testText);

      const inputTestText = await tryFetch(`${base}/userInputTest.js`);
      if (inputTestText) setInputTestFuncCode(inputTestText);

      setFiles(newFiles);
    };

    loadFiles();
  }, [chapterName, levelURL, setTestFuncCode, setInputTestFuncCode]);

  return files;
}
