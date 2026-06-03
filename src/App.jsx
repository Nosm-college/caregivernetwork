import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import JobDetailPage from "./pages/JobDetailPage";
import PostJobPage from "./pages/PostJobPage";
import CategoriesPage from "./pages/CategoriesPage";
import LoginPage from "./pages/LoginPage"; // 👈 add this
import RegisterPage from "./pages/RegisterPage"; // 👈 add this
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import JobseekerProfilePage from './pages/JobseekerProfilePage';
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/job/:id" element={<JobDetailPage />} />
              <Route path="/post-job" element={<PostJobPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/login" element={<LoginPage />} />{" "}
              <Route path="/profile" element={<JobseekerProfilePage />} />
              {/* 👈 add this */}
              <Route path="/register" element={<RegisterPage />} />{" "}
              {/* 👈 add this */}
            </Routes>
          </main>
          <footer className="footer">
            <div className="footer-inner">
              <p>
                © 2025 CareJobsUK — The UK's leading healthcare & care jobs
                board
              </p>
              <p className="footer-sub">
                Helping connect care professionals with the roles they deserve
              </p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
