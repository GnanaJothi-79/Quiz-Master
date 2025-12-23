import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    try { 
      const res = await fetch(`https://quiz-master-1-6y01.onrender.com/users?email=${email}&password=${password}`);
      const data = await res.json();
      if (data.length > 0) {
        localStorage.setItem("currentUser", JSON.stringify(data[0]));
        nav("/home");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Make sure json-server is running.");
    }
  };

  return (
    <div className="center card">
      <h2>Login</h2>
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn" onClick={login}>Login</button>
      <p style={{ cursor: "pointer", marginTop: "10px" }} onClick={() => nav("/signup")}>
        New user? Signup
      </p>
    </div>
  );
}
