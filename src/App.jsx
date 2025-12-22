import { BrowserRouter, Routes, Route } from "react-router-dom";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import SetQuiz from "./pages/SetQuiz";
import AttendQuiz from "./pages/AttendQuiz";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import Review from "./pages/Review";
import Leaderboard from "./pages/Leaderboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/set-quiz"
          element={
            <ProtectedRoute>
              <SetQuiz />
            </ProtectedRoute>
          }
        />
        <Route  path="/attend"
          element={
            <ProtectedRoute>
              <AttendQuiz />
            </ProtectedRoute>
          }
        />
        <Route   path="/quiz/:id"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route  path="/result"
          element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          }
        />
        <Route   path="/review"
          element={
            <ProtectedRoute>
              <Review />
            </ProtectedRoute>
          }
        />
        <Route path="/leaderboard/:quizId" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;