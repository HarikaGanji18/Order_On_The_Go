import { Link } from "react-router-dom";
import "./orders.css";

const ORDERS_KEY = "sbfood_orders";

function readOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; }
  catch { return []; }
}

export default function Orders() {
  const orders = readOrders();

  return (
    <div className="orders-page">
      <header className="orders-header">
        <div>
          <h2>🧾 My Orders</h2>
          <p className="muted">Your order history (COD)</p>
        </div>
        <div className="actions">
          <Link className="btn" to="/menu">← Back to Menu</Link>
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="empty">
          <h3>No orders yet</h3>
          <p>Place an order from Menu and it will appear here.</p>
          <Link className="primary" to="/menu">Go to Menu</Link>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((o) => (
            <div key={o.id} className="order-card">
              <div className="top">
                <div>
                  <div className="oid"><b>Order:</b> {o.id}</div>
                  <div className="muted">{new Date(o.createdAt).toLocaleString()}</div>
                </div>

                <div className="right">
                  <div className="pill">{o.status}</div>
                  <div className="muted">Payment: {o.payment}</div>
                  <div className="total">₹{o.total}</div>
                </div>
              </div>

              <div className="items">
                {o.items.map((it) => (
                  <div className="item" key={it.id}>
                    <img src={it.img} alt={it.name} />
                    <div className="info">
                      <div className="name">{it.name}</div>
                      <div className="muted">{it.category} • ₹{it.price} × {it.qty}</div>
                    </div>
                    <div className="line">₹{it.price * it.qty}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
