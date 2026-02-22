import { Link, useNavigate } from "react-router-dom";
import "./home.css";

const featured = [
  {
    id: "h1",
    name: "Chicken Biryani",
    category: "Biryani",
    price: 199,
    img: "https://images.unsplash.com/photo-1604908176997-125f25cc500f?w=1200&q=80",
  },
  {
    id: "h2",
    name: "Cheese Burger",
    category: "Fast Food",
    price: 129,
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80",
  },
  {
    id: "h3",
    name: "Masala Dosa",
    category: "South Indian",
    price: 99,
    img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&q=80",
  },
  {
    id: "h4",
    name: "Gulab Jamun",
    category: "Dessert",
    price: 80,
    img: "https://images.unsplash.com/photo-1615832494873-bfd20c61c9db?w=1200&q=80",
  },
];

export default function Home() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "user";
  const userName = localStorage.getItem("userName") || "Guest";

  const goProtected = (path) => {
    if (!token) navigate("/login");
    else navigate(path);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="home">
      {/* Navbar */}
      <nav className="nav">
        <Link to="/" className="brand">
          <span className="brandMark">🍔</span>
          <span className="brandText">SBFOOD</span>
        </Link>

        <div className="navLinks">
          <button className="navBtn" onClick={() => goProtected("/menu")}>Menu</button>
          <button className="navBtn" onClick={() => navigate("/restaurants")}>Restaurants</button>
          <button className="navBtn" onClick={() => goProtected("/orders")}>Orders</button>
          <button className="navBtn" onClick={() => goProtected("/cart")}>Cart</button>
        </div>

        <div className="navRight">
          <div className="miniProfile" title={userName}>
            <div className="miniAvatar">{userName.charAt(0).toUpperCase()}</div>
            <div className="miniText">
              <div className="miniName">{userName}</div>
              <div className="miniRole">{token ? role : "guest"}</div>
            </div>
          </div>

          {!token ? (
            <div className="navBtns">
              <Link className="btnOutline" to="/login">Login</Link>
              <Link className="btnPrimary" to="/register">Register</Link>
            </div>
          ) : (
            <button className="btnOutline" onClick={logout}>Logout</button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="heroContent">
          <div className="badge">Fast • Fresh • Cash on Delivery</div>
          <h1 className="heroTitle">
            Delicious food delivered <span className="accent">to your door</span>
          </h1>
          <p className="heroSub">
            Explore category-wise food items, add to cart, and order with Cash on Delivery.
            Simple, fast, and reliable.
          </p>

          <div className="heroActions">
            <button className="btnPrimary" onClick={() => goProtected("/menu")}>
              Browse Menu
            </button>
            <button className="btnGhost" onClick={() => navigate("/restaurants")}>
              View Restaurants
            </button>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="statNum">25+</div>
              <div className="statLabel">Popular Items</div>
            </div>
            <div className="stat">
              <div className="statNum">15–30 min</div>
              <div className="statLabel">Avg Delivery</div>
            </div>
            <div className="stat">
              <div className="statNum">COD</div>
              <div className="statLabel">Easy Payment</div>
            </div>
          </div>
        </div>

        <div className="heroImageWrap">
          <img
            className="heroImage"
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=80"
            alt="SBFOOD hero"
          />
          <div className="heroImageGlow" />
        </div>
      </header>

      {/* Featured */}
      <section className="section">
        <div className="sectionHead">
          <h2>Featured Items</h2>
          <button className="linkBtn" onClick={() => goProtected("/menu")}>See all →</button>
        </div>

        <div className="grid">
          {featured.map((f) => (
            <div key={f.id} className="card" onClick={() => goProtected("/menu")} role="button">
              <img className="cardImg" src={f.img} alt={f.name} />
              <div className="cardBody">
                <div className="row">
                  <div className="cardTitle">{f.name}</div>
                  <div className="price">₹{f.price}</div>
                </div>
                <div className="cat">{f.category}</div>
                <button className="btnPrimary full" onClick={(e) => { e.stopPropagation(); goProtected("/menu"); }}>
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section soft">
        <div className="sectionHead">
          <h2>Browse by Category</h2>
          <span className="muted">Choose what you love</span>
        </div>

        <div className="chips">
          {["Biryani", "Fast Food", "South Indian", "Dessert", "Drinks"].map((c) => (
            <button key={c} className="chip" onClick={() => goProtected("/menu")}>
              {c}
            </button>
          ))}
        </div>

        <div className="cta">
          <div>
            <h3>Ready to order?</h3>
            <p className="muted">Add items to cart and place COD order in seconds.</p>
          </div>
          <button className="btnPrimary" onClick={() => goProtected("/menu")}>Go to Menu</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footGrid">
          <div>
            <div className="footBrand">
              <span className="brandMark">🍔</span>
              <b>SBFOOD</b>
            </div>
            <p className="muted">
              A modern food ordering experience with category-wise items, cart, and COD.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <div className="footLinks">
              <button className="footBtn" onClick={() => goProtected("/menu")}>Menu</button>
              <button className="footBtn" onClick={() => goProtected("/orders")}>Orders</button>
              <button className="footBtn" onClick={() => goProtected("/cart")}>Cart</button>
              <button className="footBtn" onClick={() => navigate("/restaurants")}>Restaurants</button>
            </div>
          </div>

          <div>
            <h4>Support</h4>
            <div className="footLinks">
              <a href="#!" onClick={(e) => e.preventDefault()}>Help Center</a>
              <a href="#!" onClick={(e) => e.preventDefault()}>Terms</a>
              <a href="#!" onClick={(e) => e.preventDefault()}>Privacy</a>
            </div>
          </div>
        </div>

        <div className="copy">
          © {new Date().getFullYear()} SBFOOD • All rights reserved.
        </div>
      </footer>
    </div>
  );
}
