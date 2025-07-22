import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch products');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Menu</h2>
      {products.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <ul>
          {products.map(product => (
            <li key={product.id}>
              <strong>{product.name}</strong> - ${product.price}
              {product.image && (
                <div>
                  <img src={product.image.startsWith('http') ? product.image : `/uploads/${product.image}`} alt={product.name} width={100} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Menu; 