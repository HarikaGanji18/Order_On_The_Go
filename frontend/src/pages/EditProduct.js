import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
    const { id } = useParams();
    const [form, setForm] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get("/products");
                const product = res.data.find((p) => p._id === id);
                setForm(product);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProduct();
    }, [id]);

    const submit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`/products/${id}`, form);
            alert("Product Updated");
            navigate("/admin");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Edit Product</h2>

            <form onSubmit={submit}>
                <input
                    value={form?.name || ""}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                />

                <input
                    type="number"
                    value={form?.price || ""}
                    onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                    }
                />

                <button>Update</button>
            </form>
        </div>
    );
};

export default EditProduct;
