import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Restaurants from "./pages/Restaurants";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerAddFood from "./pages/OwnerAddFood";
import OwnerOrders from "./pages/OwnerOrders";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const RoleRoute = ({ allow, children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  return allow.includes(role) ? children : <Navigate to="/menu" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected user pages */}
        <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

        {/* Owner only */}
        <Route path="/owner" element={<RoleRoute allow={["owner"]}><OwnerDashboard /></RoleRoute>} />
        <Route
          path="/owner/add"
          element={
            <RoleRoute allow={["owner"]}>
              <OwnerAddFood />
            </RoleRoute>
          }
        />
        <Route path="/owner/orders" element={<RoleRoute allow={["owner"]}><OwnerOrders /></RoleRoute>} />

        {/* Admin only */}
        <Route
          path="/admin"
          element={
            <RoleRoute allow={["admin"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
