import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SetQuiz() {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const quizCode = Math.random().toString(36).substr(2, 6).toUpperCase();

  const [timerType, setTimerType] = useState("none"); // none | per | total
  const [totalTime, setTotalTime] = useState(1800); // 30 mins
  const [perQuestionTime, setPerQuestionTime] = useState(10);
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correct: 0,
      time: 10
    }
  ]);
  const [index, setIndex] = useState(0);
  const [preview, setPreview] = useState(false);
  const current = questions[index];

  const updateQuestion = (field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (i, value) => {
    const updated = [...questions];
    updated[index].options[i] = value;
    setQuestions(updated);
  };

  const nextQuestion = () => {
    if (
      !current.question.trim() ||
      current.options.some(o => !o.trim()) ||
      current.correct === "" ||
      current.correct < 0 ||
      current.correct > 3 ||
      (timerType === "per" && (!current.time || current.time <= 0))
    ) {
      alert("Please complete the current question before moving next");
      return;
    }

    if (index === questions.length - 1) {
      setQuestions([
        ...questions,
        {
          question: "",
          options: ["", "", "", ""],
          correct: 0,
          time: perQuestionTime
        }
      ]);
    }
    setIndex(index + 1);
  };

  const prevQuestion = () => {
    if (index > 0) setIndex(index - 1);
  };

  const saveQuiz = async () => {
    if (questions.some(q => !q.question || q.options.some(o => !o))) {
      alert("Please fill all questions and options");
      return;
    }

    const quizData = {
      quizCode,
      title: `Quiz by ${user.name}`,
      createdBy: user.id,
      timerType,
      totalTime: timerType === "total" ? totalTime : null,
      perQuestionTime: timerType === "per" ? perQuestionTime : null,
      questions
    };

    try {
      await fetch("https://quiz-master-1-6y01.onrender.com/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData)
      });

      const updatedUser = { ...user, createdQuizzes: [...(user.createdQuizzes || []), quizCode] }; 
      await fetch(`https://quiz-master-1-6y01.onrender.com/users/${user.id}`,
         { method: "PUT", headers: { "Content-Type": "application/json" }, 
         body: JSON.stringify(updatedUser) }); 
       localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      alert(`Quiz Created Successfully!\nQuiz Code: ${quizCode}`);
      nav("/home");
    } catch (err) {
      console.error(err);
      alert("Error saving quiz");
    }
  };

  return (
    <div className="center card">
      <h2>Create Quiz</h2>
      <h3>Timer Settings</h3>

      <select value={timerType} onChange={e => setTimerType(e.target.value)}>
        <option value="none">No Timer</option>
        <option value="per">Per Question Timer</option>
        <option value="total">Whole Quiz Timer</option>
      </select>

      {timerType === "per" && (
        <input
          type="number"
          placeholder="Seconds per question"
          value={perQuestionTime}
          onChange={e => setPerQuestionTime(Number(e.target.value))}
        />
      )}

      {timerType === "total" && (
        <input
          type="number"
          placeholder="Total time (seconds)"
          value={totalTime}
          onChange={e => setTotalTime(Number(e.target.value))}
        />
      )}
      <hr />
      <h3>Question {index + 1}</h3>

      <input
        placeholder="Question"
        value={current.question}
        onChange={e => updateQuestion("question", e.target.value)}
      />

      {current.options.map((o, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          value={o}
          onChange={e => updateOption(i, e.target.value)}
        />
      ))}

      <input
        type="number"
        min="0"
        max="3"
        placeholder="Correct option (0-3)"
        value={current.correct}
        onChange={e => updateQuestion("correct", Number(e.target.value))}
      />

      {timerType === "per" && (
        <input
          type="number"
          placeholder="Time for this question (sec)"
          value={current.time}
          onChange={e => updateQuestion("time", Number(e.target.value))}
        />
      )}

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button onClick={prevQuestion} disabled={index === 0}>
          ⏮ Previous
        </button>
        <button onClick={nextQuestion}>⏭ Next</button>
      </div>

      <button style={{ marginTop: "10px" }} onClick={() => setPreview(true)}>
        👀 Preview Quiz
      </button>

      {preview && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Quiz Preview</h2>
            
            {questions.map((q, i) => (
              <div key={i} className="preview-question">
                <p><strong>{i + 1}. {q.question}</strong></p>
                <ul>
                  {q.options.map((o, idx) => (
                    <li key={idx}>{o}</li>
                  ))}
                </ul>

                {timerType === "per" && (
                  <p>⏱ {q.time} seconds</p>
                )}
              </div>
            ))}

            {timerType === "total" && (
              <p><strong>Total Time:</strong> {totalTime} seconds</p>
            )}

            <div className="modal-actions">
              <button onClick={() => setPreview(false)}>✏️ Edit</button>
              <button className="btn" onClick={saveQuiz}>
                🚀 Publish Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
