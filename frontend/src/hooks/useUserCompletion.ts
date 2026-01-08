import { useEffect, useState } from "react";
import { getApiBase } from "../utils/apiBase";

interface UseUserCompletionProps {
  levelURL?: string;
}

export function useUserCompletion({ levelURL }: UseUserCompletionProps) {
  const [username, setUsername] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!levelURL) return;

    const fetchUserAndCompletion = async () => {
      try {
        const meRes = await fetch(`${getApiBase()}/me`, { credentials: "include" });
        const meData = await meRes.json();
        if (meData.success) {
          setUsername(meData.username);

          const completedRes = await fetch(`${getApiBase()}/completed-levels`, { credentials: "include" });
          const completedData = await completedRes.json();

          if (completedData.success) {
            setIsCompleted(completedData.levels.some((l: any) => l.level_name === levelURL));
          }
        }
      } catch (err) {
        console.error("Failed to fetch user/completion", err);
      }
    };

    fetchUserAndCompletion();
  }, [levelURL]);

  return { username, isCompleted, setIsCompleted };
}
