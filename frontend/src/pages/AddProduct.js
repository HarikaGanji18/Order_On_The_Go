import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        restaurant: "",
    });

    const [restaurants, setRestaurants] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const res = await axios.get("/restaurants");
                setRestaurants(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchRestaurants();
    }, []);

    const submit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("/products", form);
            alert("Product Added Successfully");
            navigate("/admin");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Add Product</h2>

            <form onSubmit={submit}>
                <input
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                />

                <input
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />

                <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                    }
                />

                <input
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                    }
                />

                <select
                    value={form.restaurant}
                    onChange={(e) =>
                        setForm({ ...form, restaurant: e.target.value })
                    }
                >
                    <option value="">Select Restaurant</option>

                    {restaurants.map((r) => (
                        <option key={r._id} value={r._id}>
                            {r.name}
                        </option>
                    ))}
                </select>

                <button>Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
