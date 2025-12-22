import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("currentUser");
  return user ? children : <Navigate to="/login" />;
}
