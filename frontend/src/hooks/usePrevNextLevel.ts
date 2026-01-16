import { useEffect, useState } from "react";
import levelsData from "../utils/levels.json";

export function usePrevNextLevel(chapterURL?: string, levelURL?: string) {
  const [prevLevel, setPrevLevel] = useState<{ chapterURL: string; levelURL: string } | null>(null);
  const [nextLevel, setNextLevel] = useState<{ chapterURL: string; levelURL: string } | null>(null);

  useEffect(() => {
    if (!chapterURL || !levelURL) return;

    const chapterIndex = levelsData.findIndex((c) => c.chapterURL === chapterURL);
    if (chapterIndex === -1) return;

    const chapter = levelsData[chapterIndex];
    const levelIndex = chapter.levels.findIndex((l) => l.levelURL === levelURL);
    if (levelIndex === -1) return;

    if (levelIndex > 0) {
      setPrevLevel({ chapterURL: chapter.chapterURL, levelURL: chapter.levels[levelIndex - 1].levelURL });
    } else if (chapterIndex > 0) {
      const prevChapter = levelsData[chapterIndex - 1];
      setPrevLevel({ chapterURL: prevChapter.chapterURL, levelURL: prevChapter.levels[prevChapter.levels.length - 1].levelURL });
    } else {
      setPrevLevel(null);
    }

    if (levelIndex < chapter.levels.length - 1) {
      setNextLevel({ chapterURL: chapter.chapterURL, levelURL: chapter.levels[levelIndex + 1].levelURL });
    } else if (chapterIndex < levelsData.length - 1) {
      const nextChapter = levelsData[chapterIndex + 1];
      setNextLevel({ chapterURL: nextChapter.chapterURL, levelURL: nextChapter.levels[0].levelURL });
    } else {
      setNextLevel(null);
    }
  }, [chapterURL, levelURL]);

  return { prevLevel, nextLevel };
}
