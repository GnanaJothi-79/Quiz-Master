import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const nav = useNavigate();
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  const handleSignup = async () => {
    if (!user.name || !user.email || !user.password) {
      alert("Please fill all fields");
      return;
    }

    if (!passwordRegex.test(user.password)) {
      alert(
        "Password must be at least 8 characters and include:\n• 1 letter\n• 1 number\n• 1 special character"
      );
      return;
    }
    try {
      const res = await fetch("https://quiz-master-1-6y01.onrender.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      localStorage.setItem("currentUser", JSON.stringify(data));
      alert("Signup successful!");
      nav("/home");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Server error. Make sure json-server is running.");
    }
  };

  return (
    <div className="center card">
      <h2>Signup</h2>
      <input
        placeholder="Name"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />

      <input
        placeholder="Email"
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />

      <input
        placeholder="Password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <small style={{ color: "#cbd5f5" }}>
        Password must contain at least 8 characters, one letter, one number and one special character
      </small>
      <button className="btn" onClick={handleSignup}>
        Signup
      </button>
    </div>
  );
}
