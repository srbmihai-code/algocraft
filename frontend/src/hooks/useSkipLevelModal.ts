import { useEffect, useState } from "react";
import { getApiBase } from "../utils/apiBase";
import setCookie from "../utils/setCookie";
import getCookie from "../utils/getCookie";

export function useSkipLevelModal(prevLevel: string | null) {
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [skipLevelConfirmed, setSkipLevelConfirmed] = useState(
    getCookie("skipLevelConfirmation") === "true"
  );

  useEffect(() => {
    if (!prevLevel) return;
    if (skipLevelConfirmed) return;

    (async () => {
      try {
        const res = await fetch(`${getApiBase()}/completed-levels`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          const completedLevels = data.levels.map((l: any) => l.level_name);
          const prevCompleted = completedLevels.includes(prevLevel);

          setShowSkipModal(!prevCompleted);
        }
      } catch { }
    })();
  }, [prevLevel, skipLevelConfirmed]);

  const confirmSkip = () => {
    setCookie("skipLevelConfirmation", "true", 365);
    setSkipLevelConfirmed(true);
    setShowSkipModal(false);
  };

  return { showSkipModal, confirmSkip, skipLevelConfirmed, setSkipLevelConfirmed };
}
