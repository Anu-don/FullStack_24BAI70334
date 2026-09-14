import React from 'react';

function ProductList({ products, onEdit, onDelete }) {
  if (!products || products.length === 0) {
    return <p className="empty-state">No products yet. Add one using the form above.</p>;
  }

  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>{product.description}</td>
            <td>₹{Number(product.price).toFixed(2)}</td>
            <td>{product.quantity}</td>
            <td className="actions">
              <button onClick={() => onEdit(product)}>Edit</button>
              <button className="danger" onClick={() => onDelete(product.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductList;
