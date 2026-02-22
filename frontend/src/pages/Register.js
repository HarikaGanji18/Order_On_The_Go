import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // user | owner
    restaurantName: "", // optional
  });

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // No admin signup
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role, // user | owner
        ...(form.role === "owner" ? { restaurantName: form.restaurantName } : {}),
      };

      const res = await api.post("/api/auth/register", payload);

      const token = res.data?.token;
      const role = res.data?.role || form.role;

      if (token) localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userName", res.data?.name || form.name);
      localStorage.setItem("userEmail", res.data?.email || form.email);

      alert(res.data?.message || "Registered Successfully ✅");

      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "owner") navigate("/owner", { replace: true });
      else navigate("/menu", { replace: true });

    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || err.message || "Registration failed");
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
            <h2>Create account</h2>
            <p>Register as user or owner</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={register}>
          <label>Name</label>
          <input value={form.name} onChange={onChange("name")} required />

          <label>Email</label>
          <input type="email" value={form.email} onChange={onChange("email")} required />

          <label>Password</label>
          <input type="password" value={form.password} onChange={onChange("password")} required />

          <label>Account Type</label>
          <select value={form.role} onChange={onChange("role")}>
            <option value="user">User (Customer)</option>
            <option value="owner">Restaurant Owner</option>
          </select>

          {form.role === "owner" && (
            <>
              <label>Restaurant Name</label>
              <input
                value={form.restaurantName}
                onChange={onChange("restaurantName")}
                placeholder="Restaurant name"
                required
              />
            </>
          )}

          <button className="auth-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have account?</span>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
