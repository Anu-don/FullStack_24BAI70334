import React, { useState, useEffect } from 'react';
import './App.css';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from './api/productService';

function App() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [errors, setErrors] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Could not reach the backend. Is it running on port 8080?' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (formData) => {
    setErrors(null);
    setMessage(null);
    try {
      if (editingProduct) {
        const res = await updateProduct(editingProduct.id, formData);
        setMessage({ type: 'success', text: res.message });
        setEditingProduct(null);
      } else {
        const res = await createProduct(formData);
        setMessage({ type: 'success', text: res.message });
      }
      loadProducts();
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData?.data) {
        // Field-level validation errors from the backend
        setErrors(responseData.data);
      }
      setMessage({ type: 'error', text: responseData?.message || 'Something went wrong.' });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setErrors(null);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setErrors(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const res = await deleteProduct(id);
      setMessage({ type: 'success', text: res.message });
      loadProducts();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed.' });
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Product Manager</h1>
        <p className="subtitle">Spring Boot REST API + React (CRUD, Validation, CORS)</p>
      </header>

      {message && (
        <div className={`banner ${message.type}`}>
          {message.text}
        </div>
      )}

      <ProductForm
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
        onCancelEdit={handleCancelEdit}
        errors={errors}
      />

      <hr />

      <h2>All Products</h2>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default App;
