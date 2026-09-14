import React, { useState, useEffect } from 'react';

const emptyForm = { name: '', description: '', price: '', quantity: '' };

function ProductForm({ onSubmit, editingProduct, onCancelEdit, errors }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price ?? '',
        quantity: editingProduct.quantity ?? '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>

      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Keyboard"
        />
        {errors?.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="e.g. Mechanical, RGB backlit"
        />
        {errors?.description && <span className="field-error">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          step="0.01"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="e.g. 999.00"
        />
        {errors?.price && <span className="field-error">{errors.price}</span>}
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="e.g. 10"
        />
        {errors?.quantity && <span className="field-error">{errors.quantity}</span>}
      </div>

      <div className="form-actions">
        <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
        {editingProduct && (
          <button type="button" className="secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
