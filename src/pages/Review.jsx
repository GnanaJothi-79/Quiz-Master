import { useNavigate } from "react-router-dom";
export default function Review() {
  const data = JSON.parse(localStorage.getItem("answers"));
  const nav = useNavigate();
  return (
    <div className="review-card">
      <h2 className=" card">Review</h2>
      {data.quiz.questions.map((q,i)=>(
        <div key={i}>
          <p>{q.question}</p>
          <p>Your Answer: {q.options[data.answers[i]]}</p>
          <p>Correct: {q.options[q.correct]}</p>
        </div>
      ))}
      <button className="btn" onClick={() => nav("/home")}>
        Back to Home
      </button>
    </div>
  );
}
