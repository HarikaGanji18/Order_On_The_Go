import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./owner.css";

export default function OwnerAddFood() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    category: "Biryani",
    price: "",
    imageUrl: "",
    description: "",
  });

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/products", {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        imageUrl: form.imageUrl,
        description: form.description,
      });
      alert("✅ Food item added!");
      navigate("/owner");
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || err.message || "Failed to add food");
    }
  };

  return (
    <div className="owner-wrap">
      <div className="owner-top">
        <h2>➕ Add Food Item</h2>
        <p className="muted">Add item with image, category and price</p>
      </div>

      <form className="owner-form" onSubmit={submit}>
        <input placeholder="Food Name" value={form.name} onChange={onChange("name")} required />

        <select value={form.category} onChange={onChange("category")}>
          <option>Biryani</option>
          <option>Fast Food</option>
          <option>South Indian</option>
          <option>Dessert</option>
          <option>Drinks</option>
        </select>

        <input type="number" placeholder="Price (₹)" value={form.price} onChange={onChange("price")} required />

        <input placeholder="Image URL" value={form.imageUrl} onChange={onChange("imageUrl")} required />

        <textarea placeholder="Description (optional)" value={form.description} onChange={onChange("description")} rows={4} />

        <div className="owner-actions">
          <button type="button" className="btn-outline" onClick={() => navigate("/owner")}>
            Back
          </button>
          <button className="btn-primary" type="submit">
            Save
          </button>
        </div>
      </form>

      {form.imageUrl && (
        <div className="preview">
          <p className="muted">Preview:</p>
          <img className="preview-img" src={form.imageUrl} alt="preview" />
        </div>
      )}
    </div>
  );
}
