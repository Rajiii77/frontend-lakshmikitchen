

import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.jpg';
import { CartProvider, useCart } from './CartContext';
import ProfileDrawer from './ProfileModal';
import AdminProfileDrawer from './AdminProfileDrawer';

// Set up a global Axios interceptor to always set the Authorization header from localStorage
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => Promise.reject(error)
);

const primaryColor = '#b85c38'; // Deep brown-orange
const accentColor = '#f7c873'; // Gold
const darkColor = '#3e2723'; // Dark brown
const lightBg = '#fff8f0'; // Light warm background
function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(120deg, #fff8f0 60%, #f7c873 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative background circles */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '-120px',
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, #b85c38 60%, transparent 100%)',
        opacity: 0.15,
        borderRadius: '50%',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        right: '-100px',
        width: 250,
        height: 250,
        background: 'radial-gradient(circle, #3e2723 60%, transparent 100%)',
        opacity: 0.12,
        borderRadius: '50%',
        zIndex: 0,
      }} />
      <div className="container-fluid d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh', zIndex: 1 }}>
        <div className="row w-100 align-items-center" style={{ minHeight: '70vh' }}>
          <div className="col-lg-6 d-flex flex-column align-items-start justify-content-center px-5">
            {/* Removed logo image here */}
            <div style={{ fontSize: 22, color: primaryColor, fontWeight: 600, letterSpacing: 1, fontFamily: 'serif', marginBottom: 8 }}>
              திருவிடைக்கழி முருகன் துணை!
            </div>
            <h1 className="fw-bold" style={{ color: '#1a4d2e', fontFamily: 'Segoe UI', letterSpacing: 1, fontSize: 48, marginBottom: 16 }}>
              Welcome to Lakshmi’s Kitchen
            </h1>
            <p className="text-secondary fs-4" style={{ fontWeight: 500, marginBottom: 32 }}>
              Homemade Food Delivered – Fresh, Fast, and Delicious!
            </p>
            <div className="d-flex gap-3 mb-4">
              <Link to="/menu" className="btn btn-success btn-lg rounded-pill shadow-sm fw-semibold px-4">View Menu</Link>
              <Link to="/menu" className="btn btn-warning btn-lg rounded-pill shadow-sm fw-semibold text-dark border-0 px-4">Order Now</Link>
            </div>
            <div className="text-muted small mt-2">
              <span>Safe Payments &nbsp;|&nbsp; Fast Delivery &nbsp;|&nbsp; 24/7 Support</span>
            </div>
          </div>
          <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center">
            {/* Decorative food image or illustration */}
            <img src={logo} alt="Food" style={{ width: 380, height: 380, objectFit: 'cover', borderRadius: '50%', boxShadow: '0 8px 32px rgba(184,92,56,0.12)' }} />
          </div>
        </div>
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
    axios.get('/api/products')
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
    <div className="container-fluid py-4" style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #fff8f0 60%, #f7c873 100%)' }}>
      <h2 className="fw-bold mb-4" style={{ color: primaryColor, letterSpacing: 1 }}>Menu</h2>
      <div className="row g-2">
        {products.map(product => (
          <div className="col-12 col-sm-6 col-lg-3" key={product.id}>
            <div className={`card h-100 border-0 ${!product.available ? 'bg-light' : ''}`} style={{ width: 300, minHeight: 340, maxWidth: 300, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: product.available ? 1 : 0.5, borderRadius: 24, background: 'rgba(255, 248, 240, 0.95)', boxShadow: '0 4px 16px rgba(184,92,56,0.08)' }}>
              <div style={{ width: 260, height: 260, margin: '16px auto 0 auto', overflow: 'hidden', borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={product.image?.startsWith('http') ? product.image : `http://localhost:5000/uploads/${product.image}`}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16, transition: 'transform 0.2s', boxShadow: '0 2px 8px rgba(184,92,56,0.08)' }}
                />
              </div>
              <div className="card-body d-flex flex-column w-100" style={{ flex: 1, padding: 16 }}>
                <h5 className="card-title fw-bold" style={{ color: '#1a4d2e' }}>{product.name}</h5>
                <p className="card-text mb-2 fs-5 fw-semibold" style={{ color: primaryColor }}>₹{product.price}</p>
                {!product.available && (
                  <span className="badge bg-secondary mb-2">Unavailable</span>
                )}
                {product.available && (
                  <div className="mt-auto d-flex gap-2">
                    <button className="btn btn-success flex-fill rounded-pill px-3 fw-semibold shadow-sm" onClick={() => addItem(product)}>Add to Cart</button>
                    <button className="btn btn-warning flex-fill rounded-pill px-3 fw-semibold shadow-sm text-dark border-0" onClick={() => { addItem(product); window.location.href = '/checkout'; }}>Buy Now</button>
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
    <div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(120deg, #fff8f0 60%, #f7c873 100%)', padding: '40px 0' }}>
      <h2 className="fw-bold mb-4 text-center" style={{ color: primaryColor, letterSpacing: 1 }}>Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="table-responsive" style={{ borderRadius: 24, background: 'rgba(255, 248, 240, 0.95)', padding: 24, boxShadow: '0 4px 16px rgba(184,92,56,0.08)', maxWidth: '100%', margin: '0 auto' }}>
          <table className="table align-middle mb-0" style={{ borderRadius: 16, overflow: 'hidden', background: '#fff8f0', width: '100%' }}>
            <thead style={{ background: '#f7c873' }}>
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
                <tr key={item.id} style={{ background: '#fff' }}>
                  <td><img src={item.image?.startsWith('http') ? item.image : `http://localhost:5000/uploads/${item.image}`} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px rgba(184,92,56,0.08)' }} /></td>
                  <td className="fw-semibold">{item.name}</td>
                  <td className="fw-semibold">₹{item.price}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <button className="btn btn-outline-secondary btn-sm rounded-pill px-2" onClick={() => decreaseQuantity(item.id)} disabled={item.quantity <= 1}>-</button>
                      <input type="number" min="1" value={item.quantity} onChange={e => updateQuantity(item.id, parseInt(e.target.value) || 1)} style={{ width: 60, borderRadius: 8, textAlign: 'center' }} />
                      <button className="btn btn-outline-secondary btn-sm rounded-pill px-2" onClick={() => increaseQuantity(item.id)}>+</button>
                    </div>
                  </td>
                  <td className="fw-semibold">₹{item.price * item.quantity}</td>
                  <td><button className="btn btn-danger btn-sm rounded-pill px-3 fw-semibold shadow-sm" onClick={() => removeItem(item.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap" style={{ gap: 16 }}>
            <h4 className="fw-bold mb-0" style={{ color: primaryColor }}>Total: ₹{total}</h4>
            <Link to="/checkout" className="btn btn-success btn-lg rounded-pill px-5 fw-semibold shadow-sm">Checkout</Link>
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
      await axios.post('/api/orders', formData, {
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
    axios.get('/admin/products')
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
    axios.post('/admin/products', formData, {
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

  // Delete product
  const handleDeleteProduct = id => {
    setLoading(true);
    axios.delete(`/admin/products/${id}`)
      .then(fetchProducts)
      .catch(() => setError('Failed to delete product'))
      .finally(() => setLoading(false));
  };

  // Fetch today's orders
  const fetchOrdersToday = () => {
    setLoading(true);
    axios.get('/admin/orders/today')
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
          <div className="card p-3 shadow-lg border-0" style={{ borderRadius: 24, background: 'linear-gradient(120deg, #fff8f0 60%, #f7c873 100%)', boxShadow: '0 8px 32px rgba(184,92,56,0.12)' }}>
            <h5 className="fw-bold mb-3" style={{ color: primaryColor, letterSpacing: 1 }}>Existing Products</h5>
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0" style={{ borderRadius: 16, overflow: 'hidden', background: '#fff8f0' }}>
                <thead style={{ background: '#f7c873' }}>
                  <tr style={{ border: 'none' }}>
                    <th style={{ border: 'none' }}>Name</th>
                    <th style={{ border: 'none' }}>Price</th>
                    <th style={{ border: 'none' }}>Image</th>
                    <th style={{ border: 'none' }}>Available</th>
                    <th style={{ border: 'none' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, idx) => (
                    <tr key={product.id} style={{ background: idx % 2 === 0 ? '#fff8f0' : '#f7e6c7', border: 'none' }}>
                      <td><input className="form-control form-control-sm rounded-pill" value={product.name} onChange={e => handleEditProduct(product.id, 'name', e.target.value)} /></td>
                      <td><input className="form-control form-control-sm rounded-pill" type="number" value={product.price} onChange={e => handleEditProduct(product.id, 'price', e.target.value)} /></td>
                      <td><input className="form-control form-control-sm rounded-pill" value={product.image} onChange={e => handleEditProduct(product.id, 'image', e.target.value)} /></td>
                      <td>
                        <input type="checkbox" checked={product.available} onChange={() => handleToggleAvailability(product)} />
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-primary btn-sm rounded-pill px-3 fw-semibold shadow-sm" onClick={() => handleSaveProduct(product)} disabled={loading}>Save</button>
                          <button className="btn btn-danger btn-sm rounded-pill px-3 fw-semibold shadow-sm" onClick={() => handleDeleteProduct(product.id)} disabled={loading}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

// Auth context for login state
const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    try {
      if (!saved || saved === 'undefined') return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
  }, []);
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export { AuthProvider };

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    location: '',
    home_address: '',
    role: 'user'
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = window.location;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/register', form);
      setSuccess(true);
      setTimeout(() => { window.location.href = '/login'; }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  if (success) return <div className="container mt-5 text-center"><h2>Registration successful!</h2><p>Redirecting to login...</p></div>;
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: '100%' }}>
        <h2 className="mb-4 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input className="form-control" name="name" type="text" value={form.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control" name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input className="form-control" name="phone_number" type="text" value={form.phone_number} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input className="form-control" name="location" type="text" value={form.location} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Home Address</label>
            <input className="form-control" name="home_address" type="text" value={form.home_address} onChange={handleChange} />
          </div>
          {/* Role is hidden, default to 'user' */}
          {error && <div className="alert alert-danger">{error}</div>}
          <button className="btn btn-primary w-100" type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        </form>
        <div className="mt-3 text-center">
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}

function Login() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/login', form);
      if (res.data.userType === 'admin') {
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('admin', JSON.stringify(res.data.admin));
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
        window.location.href = '/admin';
      } else {
        login(res.data.user);
        localStorage.setItem('userType', 'user');
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
  }, []);
  // Only show 'Already logged in' for non-admin users
  if (user && localStorage.getItem('userType') !== 'admin') {
    return <div className="container mt-5 text-center"><h2>Already logged in</h2></div>;
  }
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: '100%' }}>
        <h2 className="mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control" name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button className="btn btn-success w-100" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <div className="mt-3 text-center">
          <Link to="/register">Don't have an account? Register</Link>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ element, adminOnly }) {
  const { user } = useAuth();
  const userType = localStorage.getItem('userType');
  if (adminOnly) {
    if (userType !== 'admin') {
      window.location.href = '/login';
      return null;
    }
    return element;
  }
  // Allow both user and admin to access user routes
  if (!user && userType !== 'admin') {
    window.location.href = '/login';
    return null;
  }
  return element;
}

function App() {
  const { user, logout, login } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showAdminProfile, setShowAdminProfile] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
  }, []);
  const handleProfileSave = (updatedUser) => {
    login(updatedUser); // update context and localStorage
    setShowProfile(false);
  };
  const handleAdminLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('admin');
    window.location.href = '/login';
  };
  const admin = localStorage.getItem('userType') === 'admin' ? JSON.parse(localStorage.getItem('admin') || '{}') : null;
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
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0" style={{gap: 8}}>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center justify-content-center h-100" style={{height: '64px'}} to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center justify-content-center h-100" style={{height: '64px'}} to="/menu">Menu</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center justify-content-center h-100" style={{height: '64px'}} to="/cart">Cart</Link>
                </li>
                {localStorage.getItem('userType') === 'admin' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link d-flex align-items-center justify-content-center h-100" style={{height: '64px'}} to="/admin">Admin</Link>
                    </li>
                    <li className="nav-item d-flex align-items-center justify-content-center" style={{height: '64px'}}>
                      <button className="btn btn-link nav-link p-0" style={{marginLeft: 24, marginRight: 0, fontSize: 36, display: 'flex', alignItems: 'center', height: '64px'}} onClick={() => setShowAdminProfile(true)} title="Admin Profile">
                        <span className="bi bi-person-circle" style={{display: 'block', margin: 'auto'}}></span>
                      </button>
                    </li>
                  </>
                )}
                {user && localStorage.getItem('userType') !== 'admin' ? (
                  <li className="nav-item d-flex align-items-center justify-content-center" style={{height: '64px'}}>
                    <button className="btn btn-link nav-link p-0" style={{marginLeft: 24, marginRight: 0, fontSize: 36, display: 'flex', alignItems: 'center', height: '64px'}} onClick={() => setShowProfile(true)} title="Profile">
                      <span className="bi bi-person-circle" style={{display: 'block', margin: 'auto'}}></span>
                    </button>
                  </li>
                ) : (!user && localStorage.getItem('userType') !== 'admin') && (
                  <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center justify-content-center h-100" style={{height: '64px'}} to="/login">Login</Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
        {user && <ProfileDrawer show={showProfile} onClose={() => setShowProfile(false)} user={user} onSave={handleProfileSave} logout={logout} />}
        {admin && <AdminProfileDrawer show={showAdminProfile} onClose={() => setShowAdminProfile(false)} admin={admin} onLogout={handleAdminLogout} />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/menu" element={<ProtectedRoute element={<Menu />} />} />
          <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
          <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
          <Route path="/admin" element={<ProtectedRoute element={<Admin />} adminOnly={true} />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;