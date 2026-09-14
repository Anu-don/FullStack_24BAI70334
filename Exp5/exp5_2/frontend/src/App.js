import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import CorrelationBadge from './components/CorrelationBadge';
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
  const [correlationId, setCorrelationId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { products, correlationId } = await getAllProducts();
      setProducts(products);
      setCorrelationId(correlationId);
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
      let res;
      if (editingProduct) {
        res = await updateProduct(editingProduct.id, formData);
        setEditingProduct(null);
      } else {
        res = await createProduct(formData);
      }
      setMessage({ type: 'success', text: res.message });
      setCorrelationId(res.correlationId);
      loadProducts();
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData?.data) {
        setErrors(responseData.data);
      }
      setMessage({ type: 'error', text: responseData?.message || 'Something went wrong.' });
      setCorrelationId(responseData?.correlationId || err.response?.headers?.['x-correlation-id']);
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
      setCorrelationId(res.correlationId);
      loadProducts();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Delete failed.' });
    }
  };

  return (
    <div className="page">
      <Header />

      <main className="app-container">
        {message && <div className={`banner ${message.type}`}>{message.text}</div>}

        <CorrelationBadge correlationId={correlationId} />

        <ProductForm
          onSubmit={handleSubmit}
          editingProduct={editingProduct}
          onCancelEdit={handleCancelEdit}
          errors={errors}
        />

        <section className="list-section">
          <h2>All Products</h2>
          {loading ? (
            <p className="loading-text">Loading products...</p>
          ) : (
            <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
