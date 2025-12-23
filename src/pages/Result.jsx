import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Result() {
  const nav = useNavigate();
  const hasSaved = useRef(false); 
  const data = JSON.parse(localStorage.getItem("answers"));
  const user = JSON.parse(localStorage.getItem("currentUser"));

  let score = 0;
  data.quiz.questions.forEach((q, i) => {
    if (q.correct === data.answers[i]) score++;
  });

  useEffect(() => {
    if (hasSaved.current) return; 
    hasSaved.current = true;
    const markAttempt = async () => {
      try {
        const res = await fetch(
          `https://quiz-master-1-6y01.onrender.com/attempts?quizId=${data.quiz.id}&userId=${user.id}`
        );
        const existing = await res.json();
        if (existing.length === 0) {
          await fetch("https://quiz-master-1-6y01.onrender.com/attempts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              quizId: data.quiz.id,
              quizCode: data.quiz.quizCode,
              userId: user.id,
              score,
            }),
          });
        }
      } catch (err) {
        console.error("Error saving attempt:", err);
      }
    };
    markAttempt();
  }, []);

  return (
    <div className="center card">
      <motion.h2
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        🎉 Your Score: {score}
      </motion.h2>

      <button className="btn" onClick={() => nav("/review")}>Review Answers</button>
      <button  className="btn"  onClick={() => nav(`/leaderboard/${data.quiz.id}`)}>
        View Leaderboard
      </button>
      <button className="btn" onClick={() => nav("/home", { replace: true })}>Back to Home</button>
    </div>
  );
}
