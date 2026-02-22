import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./admin.css";

const STATUS = ["Pending", "Accepted", "Rejected", "Delivered"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const adminName = localStorage.getItem("userName") || "Admin";

  const [tab, setTab] = useState("orders"); // "orders" | "users"
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [qUsers, setQUsers] = useState("");
  const [qOrders, setQOrders] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [uRes, oRes] = await Promise.all([
        api.get("/api/admin/users"),
        api.get("/api/admin/orders"),
      ]);
      setUsers(uRes.data || []);
      setOrders(oRes.data || []);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, []);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const owners = users.filter((u) => u.role === "owner").length;
    const admins = users.filter((u) => u.role === "admin").length;
    const totalOrders = orders.length;
    const pending = orders.filter((o) => (o.status || "Pending") === "Pending").length;
    return { totalUsers, owners, admins, totalOrders, pending };
  }, [users, orders]);

  const filteredUsers = useMemo(() => {
    const q = qUsers.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      return (
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q)
      );
    });
  }, [users, qUsers]);

  const filteredOrders = useMemo(() => {
    const q = qOrders.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) => {
      return (
        String(o._id || "").toLowerCase().includes(q) ||
        (o.user?.name || "").toLowerCase().includes(q) ||
        (o.user?.email || "").toLowerCase().includes(q) ||
        (o.status || "").toLowerCase().includes(q)
      );
    });
  }, [orders, qOrders]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, { status });
      // Update locally for instant UI
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="admin-wrap">
      <header className="admin-top">
        <div>
          <h2>🛡 Admin Dashboard</h2>
          <p className="muted">Welcome, <b>{adminName}</b></p>
        </div>

        <div className="top-actions">
          <button className="btn light" onClick={fetchAll}>🔄 Refresh</button>
          <button className="btn danger" onClick={logout}>Logout</button>
        </div>
      </header>

      {/* Stats */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Users</div>
          <div className="stat-num">{loading ? "..." : stats.totalUsers}</div>
          <div className="stat-sub">{stats.owners} owners • {stats.admins} admins</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Orders</div>
          <div className="stat-num">{loading ? "..." : stats.totalOrders}</div>
          <div className="stat-sub">{stats.pending} pending</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Quick</div>
          <div className="stat-sub">Use tabs to manage</div>
          <div className="pillRow">
            <button className={tab === "orders" ? "pill active" : "pill"} onClick={() => setTab("orders")}>
              Orders
            </button>
            <button className={tab === "users" ? "pill active" : "pill"} onClick={() => setTab("users")}>
              Users
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="panel">
        <div className="panel-head">
          <h3>{tab === "orders" ? "All Orders" : "All Users"}</h3>

          {tab === "orders" ? (
            <input
              className="search"
              placeholder="Search orders (id / customer / status)..."
              value={qOrders}
              onChange={(e) => setQOrders(e.target.value)}
            />
          ) : (
            <input
              className="search"
              placeholder="Search users (name / email / role)..."
              value={qUsers}
              onChange={(e) => setQUsers(e.target.value)}
            />
          )}
        </div>

        {loading ? (
          <p className="muted">Loading...</p>
        ) : tab === "users" ? (
          filteredUsers.length === 0 ? (
            <p className="muted">No users found.</p>
          ) : (
            <div className="table">
              <div className="trow thead usersHead">
                <div>Name</div>
                <div>Email</div>
                <div>Role</div>
                <div>Created</div>
              </div>

              {filteredUsers.map((u) => (
                <div className="trow usersRow" key={u._id}>
                  <div className="strong">{u.name}</div>
                  <div className="mono">{u.email}</div>
                  <div>
                    <span className={`badge ${String(u.role || "user").toLowerCase()}`}>{u.role}</span>
                  </div>
                  <div className="mono">
                    {u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          filteredOrders.length === 0 ? (
            <p className="muted">No orders found.</p>
          ) : (
            <div className="table">
              <div className="trow thead ordersHead">
                <div>Order ID</div>
                <div>Customer</div>
                <div>Total</div>
                <div>Status</div>
                <div>Update</div>
              </div>

              {filteredOrders.map((o) => (
                <div className="trow ordersRow" key={o._id}>
                  <div className="mono">{o._id}</div>
                  <div>
                    <div className="strong">{o.user?.name || "Customer"}</div>
                    <div className="mutedSmall">{o.user?.email || ""}</div>
                  </div>
                  <div>₹{o.total || 0}</div>
                  <div>
                    <span className={`badge ${String(o.status || "Pending").toLowerCase()}`}>
                      {o.status || "Pending"}
                    </span>
                  </div>
                  <div className="statusUpdate">
                    <select
                      value={o.status || "Pending"}
                      onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                    >
                      {STATUS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Optional: show items */}
                  {Array.isArray(o.items) && o.items.length > 0 && (
                    <div className="orderItemsFull">
                      {o.items.map((it, idx) => (
                        <div key={idx} className="itemRow">
                          {it.name} × {it.qty} — ₹{(it.price || 0) * (it.qty || 0)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </section>

      <footer className="admin-foot">
        © {new Date().getFullYear()} SBFOOD Admin
      </footer>
    </div>
  );
}
