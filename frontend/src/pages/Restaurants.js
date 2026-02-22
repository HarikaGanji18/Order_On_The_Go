import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        axios.get("/restaurants").then((res) => {
            setRestaurants(res.data);
        });
    }, []);

    return (
        <div>
            <h2>Restaurants</h2>

            {restaurants.map((r) => (
                <div key={r._id}>
                    <Link to={`/menu/${r._id}`}>
                        <h3>{r.name}</h3>
                        <p>{r.address}</p>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Restaurants;
