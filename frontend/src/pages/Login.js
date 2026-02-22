import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", { email, password });

      const token = res.data?.token;
      const role = res.data?.role; // MUST be: user | owner | admin
      const name = res.data?.name || email.split("@")[0];
      const mail = res.data?.email || email;

      if (!token) return alert("Token missing from backend response");

      localStorage.setItem("token", token);
      localStorage.setItem("role", role || "user");
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", mail);

      console.log("✅ LOGIN RESPONSE ROLE =", role);

      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "owner") navigate("/owner", { replace: true });
      else navigate("/menu", { replace: true });

    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-head">
          <div className="logo">🍔</div>
          <div>
            <h2>Welcome back</h2>
            <p>Login to continue</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={login}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <span>New user?</span>
          <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
