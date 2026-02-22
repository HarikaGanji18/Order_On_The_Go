import { Link, useNavigate } from "react-router-dom";
import "./owner.css";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("userName") || "Owner";
  const role = localStorage.getItem("role") || "owner";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="owner-wrap">
      <header className="owner-top">
        <div>
          <h2>🍽 Owner Dashboard</h2>
          <p className="muted">Welcome, <b>{name}</b> ({role})</p>
        </div>
        <div className="top-actions">
          <Link className="btn light" to="/menu">View User Menu</Link>
          <button className="btn danger" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="owner-grid">
        <div className="card">
          <h3>➕ Add Food Item</h3>
          <p className="muted">Create new food products with image, price & category.</p>
          <Link className="btn primary" to="/owner/add">Go</Link>
        </div>

        <div className="card">
          <h3>📦 Orders</h3>
          <p className="muted">Manage incoming Cash-on-Delivery orders.</p>
          <Link className="btn primary" to="/owner/orders">View Orders</Link>
        </div>

        <div className="card">
          <h3>🧾 Profile</h3>
          <p className="muted">Your account details and role.</p>
          <div className="profileBox">
            <div><b>Name:</b> {name}</div>
            <div><b>Role:</b> {role}</div>
          </div>
        </div>

        <div className="card">
          <h3>⚙ Tips</h3>
          <p className="muted">Add items in categories for better user experience.</p>
          <ul className="tips">
            <li>Use clear food images</li>
            <li>Keep price realistic</li>
            <li>Check orders daily</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
