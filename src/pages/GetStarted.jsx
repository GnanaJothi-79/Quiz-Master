import { useNavigate } from "react-router-dom";

export default function GetStarted() {
  const nav = useNavigate();
  return (
    <div className="center">
      <h1>Quiz Master</h1>
      <button onClick={() => nav("/login")}>Get Started</button>
    </div>
  );
}
