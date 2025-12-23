import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AttendQuiz() {
  const nav = useNavigate();
  const [quizCode, setQuizCode] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!user) {
      alert("Please login first!");
      nav("/login");
      return;
    }
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("https://quiz-master-1-6y01.onrender.com/quizzes");
        const data = await res.json();
        setQuizzes(data);
      } catch (err) {
        console.error(err);
        alert("JSON Server not running");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [nav, user]);

  const checkAttempt = async (quizId) => {
    try {
      const res = await fetch(
         `https://quiz-master-1-6y01.onrender.com/attempts?quizId=${quizId}&userId=${user.id}`
      );
      const data = await res.json();
      return data.length > 0;
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  const joinQuiz = async () => {
    if (!quizCode.trim()) {
      alert("Please enter quiz code");
      return;
    }
    const quiz = quizzes.find(
      q => q.quizCode === quizCode.trim().toUpperCase()
    );
    if (!quiz) {
      alert("Invalid Quiz Code!");
      return;
    }
    if (await checkAttempt(quiz.id)) {
      alert("You already attempted this quiz!");
      return;
    }
    nav(`/quiz/${quiz.id}`);
  };
  if (loading) {
    return (
      <div className="center card">
        <h3>Loading quizzes...</h3>
      </div>
    );
  }

  return (
    <div className="center card">
      <h2>Attend Quiz</h2>
      <input
        placeholder="Enter Quiz Code"
        value={quizCode}
        onChange={(e) => setQuizCode(e.target.value)}
      />
      <button className="btn" onClick={joinQuiz}> Join Quiz</button>
      <p>Ask the quiz host for the quiz code</p>
    </div>
  );
}