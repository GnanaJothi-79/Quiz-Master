import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Leaderboard() {
  const { quizId } = useParams();
  const nav = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const attemptRes = await fetch(
          `https://quiz-master-1-6y01.onrender.com/attempts?quizId=${quizId}`
        );
        const attempts = await attemptRes.json();

        const userRes = await fetch("https://quiz-master-1-6y01.onrender.com/users");
        const users = await userRes.json();

        const merged = attempts.map(a => {
          const user = users.find(u => u.id === a.userId);
          return {
            userId: a.userId,
            name: user?.name || "Unknown",
            score: a.score
          };
        });

        merged.sort((a, b) => b.score - a.score);
        setLeaderboard(merged);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, [quizId]);

  const getMedal = (rank) => {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return rank + 1;
  };
  if (loading) {
    return <div className="center card">Loading leaderboard...</div>;
  }

  return (
    <div className="center card">
      <h2>🏆 Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <p>No attempts yet</p>
      ) : (
        <table className="leaderboard">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((u, i) => {
              const isCurrentUser = u.userId === currentUser.id;
              return (
                <tr
                  key={i}
                  className={isCurrentUser ? "current-user" : ""}  >
                  <td>{getMedal(i)}</td>
                  <td>
                    {u.name}
                    {isCurrentUser && " (You)"}
                  </td>
                  <td>{u.score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <button className="btn" onClick={() => nav("/home")}>
        Back to Home
      </button>
    </div>
  );
}
