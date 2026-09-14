import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [products, setProducts] = useState([]);
  const [time, setTime] = useState(null);
  const [mode, setMode] = useState("optimized");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const start = performance.now();
    try {
      const res = await axios.get(`http://localhost:8080/products/${mode}`);
      const end = performance.now();
      setTime((end - start).toFixed(1));
      setProducts(res.data);
    } catch (err) {
      setError("Failed to connect to backend. Make sure Spring Boot is running on port 8080.");
      setProducts([]);
      setTime(null);
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="desktop">
      <div className="window">

        <div className="titlebar">
          <div className="dots">
            <span className="red"></span>
            <span className="yellow"></span>
            <span className="green"></span>
          </div>
          <h3>Backend Optimization Dashboard</h3>
        </div>

        <div className="content">

          <div className="stats">
            <div className="card">
              <p>API Response</p>
              <h1>{loading ? "..." : time !== null ? `${time} ms` : "—"}</h1>
            </div>
            <div className="card">
              <p>Current Mode</p>
              <h2>{mode === "optimized" ? "JOIN FETCH" : "CACHED"}</h2>
            </div>
            <div className="card">
              <p>Products Loaded</p>
              <h1 style={{ color: "#a78bfa" }}>{products.length}</h1>
            </div>
            <div className="card">
              <p>Status</p>
              <h2 style={{ color: error ? "#f87171" : "#22c55e", fontSize: "18px", marginTop: "6px" }}>
                {loading ? "Loading…" : error ? "Error" : "OK"}
              </h2>
            </div>
          </div>

          {error && (
            <div className="error-banner">
              ⚠ {error}
            </div>
          )}

          <div className="toolbar">
            <button
              className={mode === "optimized" ? "active" : ""}
              onClick={() => setMode("optimized")}
              disabled={loading}
            >
              JOIN FETCH
            </button>
            <button
              className={mode === "cached" ? "active" : ""}
              onClick={() => setMode("cached")}
              disabled={loading}
            >
              CACHE
            </button>
            <button className="btn-refresh" onClick={loadProducts} disabled={loading}>
              ↺ Refresh
            </button>
          </div>

          {!error && products.length === 0 && !loading && (
            <p className="empty">No products found. Run database.sql to seed data.</p>
          )}

          {products.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.category?.name ?? "—"}</td>
                    <td>₹ {p.price.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  );
}
