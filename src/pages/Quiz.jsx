import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Timer from "../components/Timer";

export default function Quiz() {
  const { id } = useParams();
  const nav = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);

  useEffect(() => {
    const loadQuiz = async () => {
      const res = await fetch(`https://quiz-master-1-6y01.onrender.com/quizzes/${id}`);
      const data = await res.json();
      setQuiz(data);
      if (data.timerType === "total") {
        setTotalTimeLeft(data.totalTime);
      }
    };
    loadQuiz();
  }, [id]);

  useEffect(() => {
    if (!quiz || quiz.timerType !== "total") return;
    if (totalTimeLeft <= 0) {
      finishQuiz();
      return;
    }
    const t = setInterval(() => {
      setTotalTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [totalTimeLeft, quiz]);

  const next = (selected) => {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    if (index + 1 < quiz.questions.length) {
      setIndex(index + 1);
    } else {
      localStorage.setItem(
        "answers",
        JSON.stringify({
          quiz,
          answers: newAnswers
        })
      );
      nav("/result");
    }
  };
  const finishQuiz = () => {
    localStorage.setItem(
      "answers",
      JSON.stringify({
        quiz,
        answers
      })
    );
    nav("/result");
  };
  if (!quiz) {
    return <div className="center card">Loading quiz...</div>;
  }
  const current = quiz.questions[index];

  return (
    <div className="center card">
      {quiz.timerType === "total" && (
        <div className="timer">
          ⏱ {Math.floor(totalTimeLeft / 60)}:
          {(totalTimeLeft % 60).toString().padStart(2, "0")}
        </div>
      )}

      {quiz.timerType === "per" && (
        <Timer
          key={index}
          seconds={current.time || quiz.perQuestionTime}
          onEnd={() => next(-1)}
        />
      )}

      <h3>Question {index + 1} / {quiz.questions.length} </h3>
      <h2>{current.question}</h2>

      {current.options.map((o, i) => (
        <button
          key={i}
          className="quiz-option"
          onClick={() => next(i)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
