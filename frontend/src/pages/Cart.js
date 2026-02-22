import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./cart.css";

const CART_KEY = "sbfood_cart";
const ORDERS_KEY = "sbfood_orders";

function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}
function readOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; }
  catch { return []; }
}
function writeOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState(readCart());

  const total = useMemo(() => items.reduce((sum, it) => sum + it.price * it.qty, 0), [items]);

  const changeQty = (id, delta) => {
    const updated = items
      .map((it) => (it.id === id ? { ...it, qty: it.qty + delta } : it))
      .filter((it) => it.qty > 0);

    setItems(updated);
    writeCart(updated);
  };

  const clearCart = () => {
    setItems([]);
    writeCart([]);
  };

  const placeOrderCOD = () => {
    if (items.length === 0) return alert("Cart is empty!");

    const order = {
      id: "OD" + Date.now(),
      createdAt: new Date().toISOString(),
      payment: "COD",
      status: "Placed",
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        qty: it.qty,
        img: it.img,
        category: it.category,
      })),
      total: items.reduce((sum, it) => sum + it.price * it.qty, 0),
    };

    const existing = readOrders();
    writeOrders([order, ...existing]);

    alert("✅ Order placed successfully (Cash on Delivery)");
    clearCart();
    navigate("/orders");
  };

  return (
    <div className="cart-page">
      <header className="cart-header">
        <div>
          <h2>Your Cart</h2>
          <p className="sub">Payment: Cash on Delivery</p>
        </div>
        <div className="actions">
          <Link className="linkbtn" to="/menu">← Back to Menu</Link>
          <button className="outline" onClick={clearCart}>Clear</button>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="empty">
          <h3>Cart is empty</h3>
          <p>Add food items from Menu.</p>
          <Link className="primaryLink" to="/menu">Go to Menu</Link>
        </div>
      ) : (
        <>
          <div className="list">
            {items.map((it) => (
              <div className="item" key={it.id}>
                <img className="img" src={it.img} alt={it.name} />
                <div className="info">
                  <h4 className="name">{it.name}</h4>
                  <p className="meta">{it.category}</p>
                  <p className="meta">₹{it.price} each</p>
                </div>

                <div className="qty">
                  <button onClick={() => changeQty(it.id, -1)}>-</button>
                  <span>{it.qty}</span>
                  <button onClick={() => changeQty(it.id, 1)}>+</button>
                </div>

                <div className="lineTotal">₹{it.price * it.qty}</div>
              </div>
            ))}
          </div>

          <div className="summary">
            <div className="sumRow">
              <span>Total</span>
              <b>₹{total}</b>
            </div>
            <p className="note">Cash on Delivery — pay when food delivered.</p>
            <button className="primary" onClick={placeOrderCOD}>
              Place Order (COD)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
