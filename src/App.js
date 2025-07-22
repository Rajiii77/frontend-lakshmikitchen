

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.jpg';
import { CartProvider, useCart } from './CartContext';

const primaryColor = '#b85c38'; // Deep brown-orange
const accentColor = '#f7c873'; // Gold
const darkColor = '#3e2723'; // Dark brown
const lightBg = '#fff8f0'; // Light warm background
function Home() {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="card shadow-lg border-0" style={{ maxWidth: 480, width: '100%', borderRadius: 24 }}>
        <div className="card-body p-5 text-center">
          <img src={logo} alt="Lakshmi’s Kitchen" className="mb-3" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} />
          <div className="mb-3" style={{ fontSize: 22, color: primaryColor, fontWeight: 600, letterSpacing: 1, fontFamily: 'serif' }}>
            திருவிடைக்கழி முருகன் துணை!
          </div>
          <h1 className="mb-3 fw-bold" style={{ color: '#1a4d2e', fontFamily: 'Segoe UI', letterSpacing: 1 }}>
            Welcome to Lakshmi’s Kitchen
          </h1>
          <p className="mb-4 text-secondary fs-5" style={{ fontWeight: 500 }}>
            Homemade Food Delivered – Fresh, Fast, and Delicious!
          </p>
          <div className="d-grid gap-3">
            <Link to="/menu" className="btn btn-success btn-lg rounded-pill shadow-sm fw-semibold">View Menu</Link>
            <Link to="/menu" className="btn btn-warning btn-lg rounded-pill shadow-sm fw-semibold text-dark border-0">Order Now</Link>
          </div>
        </div>
      </div>
      <div className="mt-5 text-center text-muted small">
        <span>Safe Payments &nbsp;|&nbsp; Fast Delivery &nbsp;|&nbsp; 24/7 Support</span>
      </div>
    </div>
  );
}

function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();
  const navigate = window.location;

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-5 text-center">Loading menu...</div>;
  if (error) return <div className="container mt-5 text-center text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 style={{ color: primaryColor }}>Menu</h2>
      <div className="row g-4 mt-3">
        {products.map(product => (
          <div className="col-md-4" key={product.id}>
            <div className={`card h-100 shadow-sm ${!product.available ? 'bg-light' : ''}`} style={{ opacity: product.available ? 1 : 0.5 }}>
              <img src={product.image} alt={product.name} className="card-img-top" style={{ height: 180, objectFit: 'cover' }} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text mb-2">₹{product.price}</p>
                {!product.available && (
                  <span className="badge bg-secondary mb-2">Unavailable</span>
                )}
                {product.available && (
                  <div className="mt-auto d-flex gap-2">
                    <button className="btn btn-success flex-fill" onClick={() => addItem(product)}>Add to Cart</button>
                    <button className="btn btn-warning flex-fill" onClick={() => { addItem(product); window.location.href = '/checkout'; }}>Buy Now</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function Cart() {
  const { cart, removeItem, updateQuantity, increaseQuantity, decreaseQuantity } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mt-4">
      <h2 style={{ color: primaryColor }}>Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td><img src={item.image} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover' }} /></td>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => decreaseQuantity(item.id)} disabled={item.quantity <= 1}>-</button>
                      <input type="number" min="1" value={item.quantity} onChange={e => updateQuantity(item.id, parseInt(e.target.value) || 1)} style={{ width: 60 }} />
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => increaseQuantity(item.id)}>+</button>
                    </div>
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => removeItem(item.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <h4>Total: ₹{total}</h4>
            <Link to="/checkout" className="btn btn-success btn-lg">Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
}
function Checkout() {
  const { cart, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', address: '', payment: 'razorpay', upiScreenshot: null });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const orderData = {
        ...form,
        cart,
        total
      };
      const formData = new FormData();
      Object.entries(orderData).forEach(([key, value]) => {
        if (key === 'cart') {
          formData.append('cart', JSON.stringify(value));
        } else if (key === 'upiScreenshot' && value) {
          formData.append('upiScreenshot', value);
        } else {
          formData.append(key, value);
        }
      });
      await axios.post('http://localhost:5000/api/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      clearCart();
    } catch (err) {
      setError('Order failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) return <div className="container mt-4"><h2>Order Placed!</h2><p>Thank you for your order.</p></div>;

  return (
    <div className="container mt-4">
      <h2 style={{ color: primaryColor }}>Checkout</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Phone</label>
          <input className="form-control" name="phone" value={form.phone} onChange={handleChange} required pattern="[0-9]{10}" maxLength={10} />
        </div>
        <div className="col-12">
          <label className="form-label">Address</label>
          <textarea className="form-control" name="address" value={form.address} onChange={handleChange} required rows={2} />
        </div>
        <div className="col-12">
          <label className="form-label">Payment Option</label>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="payment" value="razorpay" checked={form.payment === 'razorpay'} onChange={handleChange} id="razorpay" />
            <label className="form-check-label" htmlFor="razorpay">Razorpay</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="payment" value="upi" checked={form.payment === 'upi'} onChange={handleChange} id="upi" />
            <label className="form-check-label" htmlFor="upi">Upload UPI Screenshot</label>
          </div>
        </div>
        {form.payment === 'upi' && (
          <div className="col-12">
            <label className="form-label">UPI Payment Screenshot</label>
            <input className="form-control" type="file" name="upiScreenshot" accept="image/*" onChange={handleChange} required />
          </div>
        )}
        <div className="col-12">
          <h5>Cart Summary</h5>
          <ul className="list-group mb-3">
            {cart.map(item => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between align-items-center fw-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </li>
          </ul>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="col-12">
          <button className="btn btn-primary btn-lg" type="submit" disabled={submitting || cart.length === 0}>
            {submitting ? 'Placing Order...' : 'Submit Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
function Admin() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: null,
    description: '',
    quantity: 0,
    available: true
  });
  const [ordersToday, setOrdersToday] = useState([]);
  const [summary, setSummary] = useState([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products
  const fetchProducts = () => {
    setLoading(true);
    axios.get('http://localhost:5000/admin/products')
      .then(res => setProducts(res.data))
      .catch(() => setError('Failed to fetch products'))
      .finally(() => setLoading(false));
  };
  useEffect(fetchProducts, []);

  // Add new product
  const handleAddProduct = e => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('image', newProduct.image);
    formData.append('description', newProduct.description);
    formData.append('quantity', newProduct.quantity);
    formData.append('available', newProduct.available);
    axios.post('http://localhost:5000/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(() => {
        setNewProduct({ name: '', price: '', image: null, description: '', quantity: 0, available: true });
        fetchProducts();
      })
      .catch(() => setError('Failed to add product'))
      .finally(() => setLoading(false));
  };

  // Edit product
  const handleEditProduct = (id, field, value) => {
    setProducts(products => products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  const handleSaveProduct = product => {
    setLoading(true);
    axios.put(`http://localhost:5000/admin/products/${product.id}`, product)
      .then(fetchProducts)
      .catch(() => setError('Failed to update product'))
      .finally(() => setLoading(false));
  };
  const handleToggleAvailability = product => {
    handleEditProduct(product.id, 'available', !product.available);
    handleSaveProduct({ ...product, available: !product.available });
  };

  // Fetch today's orders
  const fetchOrdersToday = () => {
    setLoading(true);
    axios.get('http://localhost:5000/admin/orders/today')
      .then(res => setOrdersToday(res.data))
      .catch(() => setError('Failed to fetch today\'s orders'))
      .finally(() => setLoading(false));
  };

  // Fetch summary by date range
  const fetchSummary = e => {
    e.preventDefault();
    setLoading(true);
    axios.get(`http://localhost:5000/admin/orders/summary?from=${dateRange.from}&to=${dateRange.to}`)
      .then(res => setSummary(res.data))
      .catch(() => setError('Failed to fetch summary'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mt-4">
      <h2 style={{ color: primaryColor }}>Admin Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-4">
        {/* Add new product */}
        <div className="col-md-6">
          <div className="card p-3">
            <h5>Add New Food Item</h5>
            <form onSubmit={handleAddProduct} className="row g-2" encType="multipart/form-data">
              <div className="col-12">
                <input className="form-control" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="col-6">
                <input className="form-control" type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} required />
              </div>
              <div className="col-6">
                <input className="form-control" type="file" accept="image/*" onChange={e => setNewProduct(p => ({ ...p, image: e.target.files[0] }))} required />
              </div>
              <div className="col-12">
                <textarea className="form-control" placeholder="Description" value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="col-6">
                <input className="form-control" type="number" placeholder="Quantity" value={newProduct.quantity} onChange={e => setNewProduct(p => ({ ...p, quantity: e.target.value }))} min={0} />
              </div>
              <div className="col-6 form-check d-flex align-items-center">
                <input className="form-check-input" type="checkbox" checked={newProduct.available} onChange={e => setNewProduct(p => ({ ...p, available: e.target.checked }))} id="available" />
                <label className="form-check-label ms-2" htmlFor="available">Available</label>
              </div>
              <div className="col-12">
                <button className="btn btn-success" type="submit" disabled={loading}>Add Item</button>
              </div>
            </form>
          </div>
        </div>
        {/* Product list */}
        <div className="col-md-6">
          <div className="card p-3">
            <h5>Existing Products</h5>
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Name</th><th>Price</th><th>Image</th><th>Available</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td><input className="form-control form-control-sm" value={product.name} onChange={e => handleEditProduct(product.id, 'name', e.target.value)} /></td>
                    <td><input className="form-control form-control-sm" type="number" value={product.price} onChange={e => handleEditProduct(product.id, 'price', e.target.value)} /></td>
                    <td><input className="form-control form-control-sm" value={product.image} onChange={e => handleEditProduct(product.id, 'image', e.target.value)} /></td>
                    <td>
                      <input type="checkbox" checked={product.available} onChange={() => handleToggleAvailability(product)} />
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => handleSaveProduct(product)} disabled={loading}>Save</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Today's Orders */}
      <div className="card p-3 mt-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5>Today's Orders</h5>
          <button className="btn btn-outline-primary btn-sm" onClick={fetchOrdersToday} disabled={loading}>Refresh</button>
        </div>
        <table className="table table-sm mt-2">
          <thead>
            <tr><th>Product</th><th>Quantity</th></tr>
          </thead>
          <tbody>
            {ordersToday.map(order => (
              <tr key={order.product}>
                <td>{order.product}</td>
                <td>{order.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Order Summary by Date Range */}
      <div className="card p-3 mt-4">
        <h5>Order Summary by Date Range</h5>
        <form className="row g-2" onSubmit={fetchSummary}>
          <div className="col-auto">
            <input className="form-control" type="date" value={dateRange.from} onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))} required />
          </div>
          <div className="col-auto">
            <input className="form-control" type="date" value={dateRange.to} onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))} required />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" type="submit" disabled={loading}>Get Summary</button>
          </div>
        </form>
        <table className="table table-sm mt-2">
          <thead>
            <tr><th>Product</th><th>Quantity</th></tr>
          </thead>
          <tbody>
            {summary.map(item => (
              <tr key={item.product}>
                <td>{item.product}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
          <div className="container-fluid">
            <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
              <img src={logo} alt="Lakshmi’s Kitchen Logo" style={{ height: 40, width: 40, objectFit: 'cover', borderRadius: '50%' }} />
              Lakshmi’s Kitchen
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/menu">Menu</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">Cart</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Admin</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;