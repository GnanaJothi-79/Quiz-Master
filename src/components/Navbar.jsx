import { useState } from "react";

export default function Navbar({ user, myQuizzes = [], myAttempts = [] }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [popup, setPopup] = useState(null);

  return (
    <>
      <nav className="navbar">
        <h3 className="logo">Quiz App</h3>
        <div className={`nav-links ${openMenu ? "show" : ""}`}>
          <button onClick={() => { setPopup("profile"); setOpenMenu(false); }}>
            Profile
          </button>
          <button onClick={() => { setPopup("quiz"); setOpenMenu(false); }}>
            My Quiz
          </button>
          <button onClick={() => { setPopup("attempt"); setOpenMenu(false); }}>
            My Attempt
          </button>
        </div>
        <div className="hamburger" onClick={() => setOpenMenu(!openMenu)}>
          ☰
        </div>
      </nav>
      {/* POPUP MODAL */}
      {popup && (
        <div className="popup-overlay" onClick={() => setPopup(null)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setPopup(null)}>
              ✕
            </span>
            {/* PROFILE */}
            {popup === "profile" && (
              <>
                <h2>Profile</h2>
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=384959&color=fff`}
                  className="popup-avatar"
                  alt="profile"
                />
                <p><b>Name:</b> {user.name}</p>
                <p><b>Email:</b> {user.email}</p>
              </>
            )}
            {/* MY QUIZZES */}
            {popup === "quiz" && (
              <>
                <h2>My Quizzes</h2>
                {myQuizzes.length === 0 ? (
                  <p>No quizzes created</p>
                ) : (
                  myQuizzes.map((q) => (
                    <div key={q.id} className="popup-card">
                      <p><b>Quiz Code:</b> {q.id}</p>
                      <p>Questions: {q.questions.length}</p>
                    </div>
                  ))
                )}
              </>
            )}
            {/* MY ATTEMPTS */}
            {popup === "attempt" && (
              <>
                <h2>My Attempts</h2>
                {myAttempts.length === 0 ? (
                  <p>No attempts yet</p>
                ) : (
                  myAttempts.map((a, i) => (
                    <div key={i} className="popup-card">
                      <p><b>Quiz ID:</b> {a.quizId}</p>
                      <p><b>Score:</b> {a.score}</p>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
