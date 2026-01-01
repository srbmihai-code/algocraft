import { getApiBase } from "../utils/apiBase";

export default async function checkSession() {
  const res = await fetch(`${getApiBase()}/session`, {
    credentials: "include",
  });
  return res.json();
}