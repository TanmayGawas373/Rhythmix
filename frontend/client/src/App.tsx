import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminRoute from "./routes/AdminRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import CheckEmail from "./pages/CheckEmail";
import VerifyEmail from "./pages/VerifyEmail";



function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
            <Login />
        }
      />
      <Route
  path="/register"
  element={
      <Register />
  }
/>

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />

      <Route
      path="/check-email"
      element={
        <CheckEmail/>
      }
      />

      <Route
      path="/verify/:token"
      element={
        <VerifyEmail/>
      }
      />

      <Route path="/" 
      element={
        <Landing/>
      } />
    </Routes>

  );
}

function App() {
  return (
    
        <AppRoutes />
      
  );
}

export default App;