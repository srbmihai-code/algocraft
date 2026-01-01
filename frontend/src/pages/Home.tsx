import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import checkSession from "../utils/checkSession";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    checkSession().then((res) => {
      if (res.authenticated) {
        navigate("/levels");
      }
    });
  }, [navigate]);

  return <div>Home</div>;
}
