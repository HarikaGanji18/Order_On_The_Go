import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./owner.css";

export default function OwnerOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/orders/owner"); 
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status });
      fetchOrders(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    }
  };

  return (
    <div className="owner-wrap">
      <header className="owner-top">
        <div>
          <h2>📦 Orders (COD)</h2>
          <p className="muted">Manage incoming orders</p>
        </div>
        <button className="btn light" onClick={() => navigate("/owner")}>
          ← Back
        </button>
      </header>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="muted">No orders yet.</p>
      ) : (
        <div className="order-list">
          {orders.map((o) => (
            <div className="order-card" key={o._id}>
              <div className="order-head">
                <div>
                  <b>Order:</b> {o._id}
                </div>
                <span className={`status ${o.status.toLowerCase()}`}>
                  {o.status}
                </span>
              </div>

              <div className="order-body">
                <div><b>Customer:</b> {o.user?.name}</div>
                <div><b>Payment:</b> COD</div>
                <div><b>Total:</b> ₹{o.total}</div>
              </div>

              <div className="order-items">
                {o.items.map((it, i) => (
                  <div key={i} className="item-row">
                    {it.name} × {it.qty} — ₹{it.price * it.qty}
                  </div>
                ))}
              </div>

              <div className="order-actions">
                {o.status === "Pending" && (
                  <>
                    <button
                      className="btn primary"
                      onClick={() => updateStatus(o._id, "Accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => updateStatus(o._id, "Rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}

                {o.status === "Accepted" && (
                  <button
                    className="btn success"
                    onClick={() => updateStatus(o._id, "Delivered")}
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
