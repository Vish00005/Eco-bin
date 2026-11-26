import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import FindBin from "./pages/FindBin";
import Login from "./pages/Login";
import Recycle from "./pages/Recycle";
import Otp from "./pages/Otp";
import Dashboard from "./pages/Dashboard";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/find-bin" element={<FindBin />} />
        <Route path="/findBin" element={<FindBin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user/login" element={<Login />} />
        <Route
          path="/recycle"
          element={
            <ProtectedRoute>
              <Recycle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/otp"
          element={
            <ProtectedRoute>
              <Otp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rewards"
          element={
            <ProtectedRoute>
              <Rewards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
