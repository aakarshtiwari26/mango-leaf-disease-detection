import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AboutDiseaseDetection from "./pages/AboutDiseaseDetection";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PredictionHistory from "./pages/PredictionHistory";
import Profile from "./pages/Profile";
import UploadLeaf from "./pages/UploadLeaf";
import DiseaseDetails from "./pages/DiseaseDetails";
import NotFound from "./pages/NotFound";
import PredictionResult from "./pages/PredictionResult";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutDiseaseDetection />} />
        <Route
          path="login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        <Route path="diseases/:slug" element={<DiseaseDetails />} />
        <Route path="result" element={<PredictionResult />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="history"
          element={
            <ProtectedRoute>
              <PredictionHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="upload"
          element={
            <ProtectedRoute>
              <UploadLeaf />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
