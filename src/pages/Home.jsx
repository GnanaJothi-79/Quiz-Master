import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageWrapper from "../components/PageWrapper";

export default function Home() {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [myQuizzes, setMyQuizzes] = useState([]);
  const [myAttempts, setMyAttempts] = useState([]);

  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }
    fetch(`https://quiz-master-1-6y01.onrender.com/quizzes?createdBy=${user.id}`)
      .then(res => res.json())
      .then(setMyQuizzes);
    fetch(`https://quiz-master-1-6y01.onrender.com/attempts?userId=${user.id}`)
      .then(res => res.json())
      .then(setMyAttempts);
  }, [user, nav]);

  return (
    <PageWrapper>
      <Navbar
        user={user}
        myQuizzes={myQuizzes}
        myAttempts={myAttempts}
      />
      <div className="center card home-content">
        <button onClick={() => nav("/set-quiz")}>Set Quiz</button>
        <button onClick={() => nav("/attend")}>Attend Quiz</button>
      </div>
    </PageWrapper>
  );
}