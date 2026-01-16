import levelsData from "../utils/levels.json";

interface Names {
  chapterName?: string;
  levelName?: string;
}

export default function getNamesFromURL(
  chapterURL?: string,
  levelURL?: string
): Names {
  if (!chapterURL) return {};

  const chapter = levelsData.find((c) => c.chapterURL === chapterURL);
  if (!chapter) return {};

  const level = levelURL
    ? chapter.levels.find((l) => l.levelURL === levelURL)
    : undefined;

  return {
    chapterName: chapter.chapterName,
    levelName: level?.levelName,
  };
}
