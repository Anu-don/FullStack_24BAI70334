import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState("asc");

  useEffect(() => {
    loadProducts();
  }, [page, sortBy, direction]);

  const loadProducts = async () => {
    const res = await axios.get(
      `http://localhost:8080/products?page=${page}&size=5&sortBy=${sortBy}&direction=${direction}`
    );
    setProducts(res.data.content);
  };

  return (
    <div className="container">
      <h1>📦 Product Dashboard</h1>

      <div className="toolbar">
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="id">Sort by ID</option>
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </select>

        <select onChange={(e) => setDirection(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price (₹)</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          ◀ Previous
        </button>

        <span>Page {page + 1}</span>

        <button onClick={() => setPage(page + 1)}>
          Next ▶
        </button>
      </div>
    </div>
  );
}