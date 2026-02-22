import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./menu.css";

const CART_KEY = "sbfood_cart";

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}
function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

const DUMMY_FOODS = [
  { id: "f1", name: "Chicken Biryani", category: "Biryani", price: 199, img: "https://images.unsplash.com/photo-1604908176997-125f25cc500f?w=800&q=80" },
  { id: "f2", name: "Veg Biryani", category: "Biryani", price: 149, img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80" },
  { id: "f3", name: "Burger", category: "Fast Food", price: 129, img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80" },
  { id: "f4", name: "Pizza", category: "Fast Food", price: 249, img: "https://images.unsplash.com/photo-1548365328-8b849e6f5dbf?w=800&q=80" },
  { id: "f5", name: "Idli (4 pcs)", category: "South Indian", price: 60, img: "https://images.unsplash.com/photo-1691590747540-bbe5f2c064fd?w=800&q=80" },
  { id: "f6", name: "Dosa", category: "South Indian", price: 99, img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80" },
  { id: "f7", name: "Gulab Jamun", category: "Dessert", price: 80, img: "https://images.unsplash.com/photo-1615832494873-bfd20c61c9db?w=800&q=80" },
  { id: "f8", name: "Ice Cream", category: "Dessert", price: 90, img: "https://images.unsplash.com/photo-1505253216365-0d8f0b49b7a2?w=800&q=80" },
];

export default function Menu() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "User";
  const role = localStorage.getItem("role") || "user";

  const [foods] = useState(DUMMY_FOODS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(foods.map((f) => f.category)));
    return ["All", ...cats];
  }, [foods]);

  const filteredFoods = useMemo(() => {
    return foods.filter((f) => {
      const matchCat = activeCategory === "All" || f.category === activeCategory;
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [foods, activeCategory, search]);

  const addToCart = (food) => {
    // extra safety: if someone opens menu without token
    if (!token) return navigate("/login");

    const cart = readCart();
    const exists = cart.find((x) => x.id === food.id);

    let updated;
    if (exists) updated = cart.map((x) => (x.id === food.id ? { ...x, qty: x.qty + 1 } : x));
    else updated = [...cart, { ...food, qty: 1 }];

    writeCart(updated);
    alert(`${food.name} added to cart ✅`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="menu-page">
      <header className="menu-header">
        <div className="brand">
          <h1>SBFOOD</h1>
          <p className="sub">Category wise foods • COD available</p>
        </div>

        <div className="header-actions">
          <div className="profile">
            <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
            <div className="pinfo">
              <div className="pname">{userName}</div>
              <div className="prole">{role}</div>
            </div>
          </div>

          <input
            className="search"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Link className="cart-btn" to="/orders">🧾 Orders</Link>

          <Link className="cart-btn" to="/cart">
            🛒 Cart <span className="badge">{readCart().reduce((s, i) => s + i.qty, 0)}</span>
          </Link>

          <button className="logout" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="category-bar">
        {categories.map((c) => (
          <button
            key={c}
            className={c === activeCategory ? "chip active" : "chip"}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid">
        {filteredFoods.map((food) => (
          <div className="card" key={food.id}>
            <img className="food-img" src={food.img} alt={food.name} />
            <div className="card-body">
              <div className="row">
                <h3 className="title">{food.name}</h3>
                <span className="price">₹{food.price}</span>
              </div>
              <p className="cat">{food.category}</p>
              <button className="primary" onClick={() => addToCart(food)}>
                + Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFoods.length === 0 && (
        <div className="empty">
          <h3>No items found</h3>
          <p>Try different category or search.</p>
        </div>
      )}
    </div>
  );
}
