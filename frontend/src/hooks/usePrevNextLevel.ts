import { useEffect, useState } from "react";
import levelsData from "../utils/levels.json";

export function usePrevNextLevel(chapterName?: string, levelURL?: string) {
  const [prevLevel, setPrevLevel] = useState<string | null>(null);
  const [nextLevel, setNextLevel] = useState<string | null>(null);

  useEffect(() => {
    if (!chapterName || !levelURL) return;

    const chapter = levelsData.find((c) => c.chapterURL === chapterName);
    const index = chapter?.levels.findIndex((l) => l.levelURL === levelURL) ?? -1;

    setPrevLevel(index > 0 ? chapter!.levels[index - 1].levelURL : null);
    setNextLevel(
      index < (chapter?.levels.length ?? 0) - 1
        ? chapter!.levels[index + 1].levelURL
        : null
    );
  }, [chapterName, levelURL]);

  return { prevLevel, nextLevel };
}
