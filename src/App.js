import React, { useEffect, useState, createContext, useContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.jpg';
import { CartProvider, useCart } from './CartContext';
import ProfileDrawer from './ProfileModal';
import AdminProfileDrawer from './AdminProfileDrawer';
import { FaUserCircle, FaBell, FaCog, FaUtensils, FaList, FaClipboardList, FaChartBar, FaTags } from 'react-icons/fa';

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
  const [deal, setDeal] = useState('');
  useEffect(() => {
    fetch('/api/todays-deal')
      .then(res => res.json())
      .then(data => setDeal(data.message || ''));
  }, []);
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
              Welcome to Lakshmi's Kitchen
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
      {/* Today's Deal Full Landscape Section */}
      <section style={{
        width: '100vw',
        background: '#f5e1d4',
        padding: '48px 0',
        marginTop: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 24px rgba(60,60,60,0.07)',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        minHeight: 160,
        zIndex: 2,
        border: '1px solid #e0e0e0',
      }}>
        <div className="d-flex flex-column align-items-center justify-content-center w-100">
          <span className="mb-3" style={{ fontSize: 28, fontWeight: 700, color: '#222', letterSpacing: 0.5, fontFamily: 'Segoe UI, sans-serif' }}>
            Today's Deal
          </span>
          <div
            className="rounded-4 shadow-sm p-4 w-100"
            style={{
              maxWidth: 600,
              minHeight: 56,
              fontSize: 20,
              color: '#444',
              fontWeight: 500,
              textAlign: 'center',
              border: '1.5px solid #e0e0e0',
              background: '#fafbfc',
              fontFamily: 'Segoe UI, sans-serif',
              marginTop: '24px',
              marginBottom: '24px',
              marginLeft: window.innerWidth <= 600 ? '16px' : 'auto',
              marginRight: window.innerWidth <= 600 ? '16px' : 'auto',
            }}
          >
            {deal ? deal : 'No deal for today. Please check back later!'}
          </div>
        </div>
      </section>
    </div>
  );
}

function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem, replaceCart, cart, increaseQuantity, decreaseQuantity } = useCart();
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
          <div className="col-6 col-sm-6 col-lg-3 mb-3" key={product.id}>
            <div className={`card h-100 w-100 border menu-card-mobile shadow-sm ${!product.available ? 'bg-light' : ''}`} style={{ borderRadius: 18, background: 'rgba(255, 248, 240, 0.98)', opacity: product.available ? 1 : 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 180 }}>
              <div className="w-100 d-flex justify-content-center align-items-center pt-3" style={{ minHeight: 110 }}>
                <img
                  src={product.image?.startsWith('http') ? product.image : `/uploads/${product.image}`}
                  alt={product.name}
                  className="border"
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 10, boxShadow: '0 2px 8px rgba(184,92,56,0.08)' }}
                />
              </div>
              <div className="card-body text-center p-2 d-flex flex-column w-100" style={{ flex: 1 }}>
                <h6 className="card-title fw-bold mb-1" style={{ color: '#1a4d2e', fontSize: 16 }}>{product.name}</h6>
                <div className="card-text mb-2 fw-semibold" style={{ color: primaryColor, fontSize: 15 }}>₹{product.price}</div>
                {!product.available && (
                  <span className="badge bg-secondary mb-2">Unavailable</span>
                )}
                {product.available && (
                  <div className="mt-auto d-flex gap-2 justify-content-center align-items-center">
                    {(() => {
                      const cartItem = cart.find(item => item.id === product.id);
                      if (cartItem) {
                        return (
                          <>
                            <button className="btn btn-outline-secondary btn-sm rounded-circle px-2" style={{minWidth: 32}} onClick={() => decreaseQuantity(product.id)} disabled={cartItem.quantity <= 1}>-</button>
                            <span style={{minWidth: 24, textAlign: 'center', fontWeight: 600}}>{cartItem.quantity}</span>
                            <button className="btn btn-outline-secondary btn-sm rounded-circle px-2" style={{minWidth: 32}} onClick={() => increaseQuantity(product.id)}>+</button>
                          </>
                        );
                      } else {
                        return (
                          <button className="btn btn-success btn-sm rounded-pill px-3 fw-semibold shadow-sm" onClick={() => addItem(product)} style={{ fontSize: 14 }}>Add to Cart</button>
                        );
                      }
                    })()}
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
        <div className="container p-0" style={{ borderRadius: 18, background: 'rgba(255, 248, 240, 0.95)', boxShadow: '0 4px 16px rgba(184,92,56,0.08)', maxWidth: 480, margin: '0 auto' }}>
          <div className="list-group list-group-flush">
            {cart.map(item => (
              <div key={item.id} className="list-group-item d-flex align-items-center cart-item-mobile" style={{padding: '10px 8px', border: 'none', borderBottom: '1px solid #eee', background: '#fff8f0'}}>
                <img src={item.image?.startsWith('http') ? item.image : `/uploads/${item.image}`} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 10, marginRight: 10, flexShrink: 0 }} />
                <div className="flex-grow-1 d-flex flex-column" style={{minWidth: 0}}>
                  <span className="fw-semibold text-truncate" style={{fontSize: 15, maxWidth: 120}}>{item.name}</span>
                  <span className="text-muted" style={{fontSize: 13}}>₹{item.price} x {item.quantity}</span>
                </div>
                <div className="d-flex align-items-center ms-2" style={{gap: 4}}>
                  <button className="btn btn-outline-secondary btn-xs px-2 py-0" style={{fontSize: 14, minWidth: 24, height: 24, lineHeight: 1}} onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span style={{minWidth: 18, textAlign: 'center', fontWeight: 600, fontSize: 14}}>{item.quantity}</span>
                  <button className="btn btn-outline-secondary btn-xs px-2 py-0" style={{fontSize: 14, minWidth: 24, height: 24, lineHeight: 1}} onClick={() => increaseQuantity(item.id)}>+</button>
                </div>
                <span className="fw-bold ms-3" style={{fontSize: 15, minWidth: 40, textAlign: 'right'}}>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center p-3" style={{gap: 16}}>
            <h4 className="fw-bold mb-0" style={{ color: primaryColor, fontSize: 18 }}>Total: ₹{total}</h4>
            <Link to="/checkout" className="btn btn-success btn-lg rounded-pill px-5 fw-semibold shadow-sm">Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
}
function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({ payment: 'cod' });
  const [userUpiId, setUserUpiId] = useState('');
  const [adminUpiId, setAdminUpiId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  // Fetch admin UPI ID when component mounts
  useEffect(() => {
    const fetchAdminUpiId = async () => {
      try {
        const response = await axios.get('/api/admin/upi-settings');
        setAdminUpiId(response.data.upiId);
      } catch (err) {
      }
    };
    fetchAdminUpiId();
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    // Check if user is logged in
    if (!user) {
      setError('Please login to place an order');
      setSubmitting(false);
      return;
    }
    
    try {
          const orderData = {
      name: user.name || 'Unknown',
      phone: user.phone_number || user.phone || '',
      address: user.home_address || user.address || '',
      payment: form.payment,
      cart: cart,
      total: total,
      user_id: user.id,
      upi_id: userUpiId // Add user's UPI ID
    };
      
      
      const response = await axios.post('/api/orders', orderData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = response.data;
      
      if (form.payment === 'cod') {
        // COD order - show success with order number
        setOrderDetails({
          orderNumber: result.orderNumber,
          paymentStatus: result.paymentStatus,
          message: result.message
        });
        setSuccess(true);
        clearCart();
      } else if (form.payment === 'gpay' || form.payment === 'phonepe') {
        // UPI payment - open respective app
        handleUpiPayment(form.payment, result.orderNumber, total, userUpiId);
      }
      
    } catch (err) {
      setError(err.response?.data?.error || 'Order failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const initializeRazorpay = (orderData) => {
    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Lakshmi's Kitchen",
      description: `Order #${orderData.orderNumber}`,
      order_id: orderData.razorpayOrderId,
      handler: function (response) {
        // Payment successful
        verifyPayment(response, orderData.orderId);
      },
      prefill: {
        name: user.name,
        contact: user.phone_number || user.phone,
        email: user.email
      },
      theme: {
        color: "#b85c38"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleUpiPayment = async (paymentMethod, orderNumber, amount, userUpiId) => {
    try {
      if (!userUpiId) {
        setError('Please enter your UPI ID');
        return;
      }
      
      // Get admin's UPI ID from settings
      const upiResponse = await axios.get('/api/admin/upi-settings');
      const adminUpiId = upiResponse.data.upiId;
      
      if (!adminUpiId) {
        setError('Admin UPI ID not configured. Please contact support.');
        return;
      }
      
      // Create UPI payment URL - payment from user to admin
      let paymentUrl = '';
      const note = `Order ${orderNumber} - Lakshmi's Kitchen`;
      
      // if (paymentMethod === 'gpay') {
      //   // Google Pay UPI URL - payment from user to admin
      //   paymentUrl = `upi://pay?pa=${adminUpiId}&pn=Lakshmi's Kitchen&tn=${encodeURIComponent(note)}&am=${amount}&cu=INR&mode=02`;
      // } else if (paymentMethod === 'phonepe') {
      //   // PhonePe UPI URL - payment from user to admin
      //   paymentUrl = `upi://pay?pa=${adminUpiId}&pn=Lakshmi's Kitchen&tn=${encodeURIComponent(note)}&am=${amount}&cu=INR&mode=02`;
      // }
      
      // console.log('Opening payment URL:', paymentUrl);
      // console.log('Payment: User UPI ID:', userUpiId, '→ Admin UPI ID:', adminUpiId);
      
      // Open the payment app
      window.location.href = paymentUrl;
      
      // Show success message after a delay
      setTimeout(() => {
        setOrderDetails({
          orderNumber: orderNumber,
          paymentStatus: 'pending',
          message: `Order placed successfully! Please pay ₹${amount} to ${adminUpiId}. Order Number: ${orderNumber}`
        });
        setSuccess(true);
        clearCart();
      }, 2000);
      
    } catch (err) {
      setError('Failed to initiate UPI payment. Please try again.');
    }
  };

  const verifyPayment = async (paymentResponse, orderId) => {
    try {
      const verificationData = {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature
      };

      await axios.post('/api/verify-payment', verificationData);
      
      setOrderDetails({
        orderNumber: orderId.toString().padStart(4, '0'),
        paymentStatus: 'paid',
        message: 'Payment successful! Your order has been confirmed.'
      });
      setSuccess(true);
      clearCart();
      
    } catch (err) {
      setError('Payment verification failed. Please contact support.');
    }
  };

  if (success && orderDetails) {
    return (
      <div className="container mt-4 text-center">
        <div className="card p-4 shadow" style={{ maxWidth: 500, margin: '0 auto' }}>
          <div className="text-success mb-3">
            <i className="fas fa-check-circle" style={{ fontSize: '3rem' }}></i>
          </div>
          <h2 className="text-success mb-3">Order Placed Successfully!</h2>
          <div className="alert alert-info">
            <strong>Order Number:</strong> {orderDetails.orderNumber}
          </div>
          <div className="alert alert-warning">
            <strong>Payment Status:</strong> {orderDetails.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
          </div>
          <p className="text-muted">{orderDetails.message}</p>
          <Link to="/menu" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-mobile-container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(120deg, #fff8f0 60%, #f7c873 100%)' }}>
      <div
        className={window.innerWidth <= 576 ? '' : 'checkout-card card p-4 shadow'}
        style={
          window.innerWidth <= 576
            ? {
                width: '100vw',
                maxWidth: '100vw',
                boxShadow: 'none',
                borderRadius: 0,
                background: 'white',
                padding: '16px 8px',
                margin: 0
              }
            : { maxWidth: 420, width: '100%', margin: '32px 0 80px 0' }
        }
      >
        <h2 className="mb-4 text-center" style={{ color: primaryColor }}>Checkout</h2>
        
        {/* Show user details */}
        {user && (
          <div className="mb-4 p-3 bg-light rounded">
            <h6 className="mb-2">Delivery Details:</h6>
            <div className="small">
              <div><strong>Name:</strong> {user.name || 'Not set'}</div>
              <div><strong>Phone:</strong> {user.phone_number || user.phone || 'Not set'}</div>
              <div><strong>Address:</strong> {user.home_address || user.address || 'Not set'}</div>
            </div>
            {(!user.phone_number && !user.phone) && (
              <div className="alert alert-warning mt-2 small">
                Please update your profile with phone number before placing an order.
              </div>
            )}
            {(!user.home_address && !user.address) && (
              <div className="alert alert-warning mt-2 small">
                Please update your profile with address before placing an order.
              </div>
            )}
          </div>
        )}
        
        {!user && (
          <div className="alert alert-warning mb-3">
            Please <a href="/login" className="alert-link">login</a> to place an order.
          </div>
        )}
        
        {user && (
          <form onSubmit={handleSubmit} className="checkout-step2-form">
            <div className="mb-3">
              <label className="form-label">Payment Option</label>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={handleChange} id="cod" />
                <label className="form-check-label" htmlFor="cod">
                  <strong>Cash on Delivery (COD)</strong>
                  <br />
                  <small className="text-muted">Pay when you receive your order</small>
                </label>
              </div>
              {/* <div className="form-check">
                <input className="form-check-input" type="radio" name="payment" value="gpay" checked={form.payment === 'gpay'} onChange={handleChange} id="gpay" />
                <label className="form-check-label" htmlFor="gpay">
                  <strong>Google Pay (GPay)</strong>
                  <br />
                  <small className="text-muted">Pay instantly with Google Pay</small>
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="payment" value="phonepe" checked={form.payment === 'phonepe'} onChange={handleChange} id="phonepe" />
                <label className="form-check-label" htmlFor="phonepe">
                  <strong>PhonePe</strong>
                  <br />
                  <small className="text-muted">Pay instantly with PhonePe</small>
                </label>
              </div> */}
            </div>
            
            {/* UPI ID input for GPay and PhonePe */}
            {(form.payment === 'gpay' || form.payment === 'phonepe') && (
              <div className="mb-3">
                {adminUpiId && (
                  <div className="alert alert-info mb-3">
                    <strong>Payment to:</strong> {adminUpiId}
                    <br />
                    <small>You will pay ₹{total} to this UPI ID</small>
                  </div>
                )}
                <label className="form-label">Your UPI ID (for payment)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter your UPI ID (e.g., yourname@okicici)" 
                  value={userUpiId} 
                  onChange={(e) => setUserUpiId(e.target.value)}
                  required
                />
                <small className="text-muted">
                  Enter your UPI ID from which payment will be made to {adminUpiId || 'admin'}
                </small>
              </div>
            )}
            <div className="mb-3">
              <h5 className="mb-2">Order Summary</h5>
              <ul className="list-group mb-3">
                {cart.map(item => (
                  <li className="list-group-item d-flex justify-content-between align-items-center p-2" key={item.id}>
                    <span style={{fontSize: 14}}>{item.name} x {item.quantity}</span>
                    <span style={{fontWeight: 600, fontSize: 14}}>₹{item.price * item.quantity}</span>
                  </li>
                ))}
                <li className="list-group-item d-flex justify-content-between align-items-center fw-bold p-2">
                  <span>Total</span>
                  <span>₹{total}</span>
                </li>
              </ul>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button 
              className="btn btn-primary w-100 checkout-bottom-btn" 
              type="submit" 
              disabled={
                submitting || 
                cart.length === 0 || 
                (!user.phone_number && !user.phone) || 
                (!user.home_address && !user.address) ||
                ((form.payment === 'gpay' || form.payment === 'phonepe') && !userUpiId.trim())
              }
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
function Admin() {
  const [selectedSection, setSelectedSection] = useState('todaysDeal');
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
  const [ordersByDateRange, setOrdersByDateRange] = useState([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dealMessage, setDealMessage] = useState('');
  const [dealStatus, setDealStatus] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [paymentUpdateStatus, setPaymentUpdateStatus] = useState('');
  const [upiId, setUpiId] = useState('');
  const [upiStatus, setUpiStatus] = useState('');
  const [currentUpiId, setCurrentUpiId] = useState('');
  const [orderSummary, setOrderSummary] = useState(null);
  const mainRef = useRef(null);
  
  // Fetch order summary for current session
  const fetchOrderSummary = () => {
    setLoading(true);
    axios.get('/api/admin/order-summary')
      .then(res => {
        setOrderSummary(res.data);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching order summary:', err);
        setError('Failed to fetch order summary');
      })
      .finally(() => setLoading(false));
  };

  // Fetch products
  const fetchProducts = () => {
    setLoading(true);
    axios.get('/admin/products')
      .then(res => setProducts(res.data))
      .catch(() => setError('Failed to fetch products'))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch current UPI ID
  const fetchCurrentUpiId = async () => {
    try {
      const response = await axios.get('/api/admin/upi-settings');
      setCurrentUpiId(response.data.upiId);
    } catch (err) {
      console.log('Could not fetch current UPI ID:', err);
    }
  };
  useEffect(() => {
    fetchCurrentUpiId();
  }, []);

  // Set up authorization header when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Admin component - Token from localStorage:', token ? 'Present' : 'Missing');
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      console.log('Admin component - Authorization header set:', axios.defaults.headers.common['Authorization']);
    }
  }, []);

  // Fetch orders when Today's Orders section is selected
  useEffect(() => {
    if (selectedSection === 'todaysOrders') {
      fetchOrdersToday();
    } else if (selectedSection === 'orderSummary') {
      fetchOrderSummary();
    }
  }, [selectedSection]);

  // Test token decoding
  const testTokenDecoding = () => {
    console.log('Testing token decoding...');
    axios.get('/api/admin/decode-token')
      .then(res => {
        console.log('Token decode success:', res.data);
      })
      .catch(err => {
        console.log('Token decode error:', err.response?.data);
      });
  };

  // Test admin data
  const testAdminData = () => {
    console.log('Testing admin data...');
    axios.get('/api/admin/test')
      .then(res => {
        console.log('Admin data success:', res.data);
      })
      .catch(err => {
        console.log('Admin data error:', err.response?.data);
      });
  };

  useEffect(() => {
    if (mainRef.current && selectedSection) {
      mainRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedSection]);

  // Sidebar items
  const sidebarItems = [
    { key: 'todaysDeal', label: "Today's Deal", icon: <FaTags /> },
    { key: 'addMenu', label: 'Add Menu', icon: <FaUtensils /> },
    { key: 'existingProducts', label: 'Existing Products', icon: <FaList /> },
    { key: 'currentOrders', label: 'Current Orders', icon: <FaClipboardList /> },
    { key: 'todaysOrders', label: "Today's Orders", icon: <FaClipboardList /> },
    { key: 'orderSummary', label: 'Order Summary', icon: <FaChartBar /> },
    { key: 'paymentManagement', label: 'Payment Management', icon: <FaCog /> },
    // { key: 'upiSettings', label: 'UPI Settings', icon: <FaCog /> },
  ];

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
    // Only send fields expected by backend
    const updateData = {
      name: product.name,
      price: product.price,
      image: product.image,
      available: product.available
    };
    axios.put(
      `/admin/products/${product.id}`,
      updateData,
      { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
    )
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

  // Refresh all order tables
  const refreshAllOrderTables = () => {
    console.log('Refreshing order tables...');
    console.log('Current section:', selectedSection);
    
    // Always refresh today's orders if we're on that section
    if (selectedSection === 'todaysOrders') {
      console.log('Refreshing today\'s orders...');
      fetchOrdersToday();
    }
    
    // Refresh orders by date range if we're on that section and have date range set
    if (selectedSection === 'orderSummary' && dateRange.from && dateRange.to) {
      console.log('Refreshing orders by date range...');
      console.log('Date range:', dateRange);
      setLoading(true);
      axios.get(`/api/admin/orders/range?from=${dateRange.from}&to=${dateRange.to}`)
        .then(res => {
          console.log('Orders by date range refreshed:', res.data);
          setOrdersByDateRange(res.data);
          setError(null); // Clear any previous errors
        })
        .catch((err) => {
          console.error('Error refreshing orders by date range:', err);
          setError('Failed to refresh orders');
        })
        .finally(() => setLoading(false));
    }
  };

  // Update payment status
  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setPaymentUpdateStatus('Please enter an order number');
      return;
    }

    setLoading(true);
    setPaymentUpdateStatus('');

    try {
      console.log('Sending orderNumber:', orderNumber.trim());
      const requestData = { orderNumber: orderNumber.trim() };
      console.log('Request data:', requestData);
      
      const response = await axios.post('/api/admin/update-payment', 
        requestData,
        { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
      );
      
      setPaymentUpdateStatus(`✅ ${response.data.message}`);
      setOrderNumber('');
      
      console.log('Payment updated successfully, refreshing tables...');
      console.log('Current section:', selectedSection);
      console.log('Date range:', dateRange);
      
      // Refresh all order tables to show updated payment status
      setTimeout(() => {
        console.log('Executing refresh...');
        refreshAllOrderTables();
      }, 500);
      
    } catch (err) {
      setPaymentUpdateStatus(`❌ ${err.response?.data?.error || 'Failed to update payment status'}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch today's orders
  const fetchOrdersToday = () => {
    setLoading(true);
    console.log('fetchOrdersToday - Authorization header:', axios.defaults.headers.common['Authorization']);
    axios.get('/api/admin/orders')
      .then(res => setOrdersToday(res.data))
      .catch((err) => {
        console.log('fetchOrdersToday - Error:', err.response?.status, err.response?.data);
        setError('Failed to fetch orders');
      })
      .finally(() => setLoading(false));
  };

  // Fetch orders by date range
  const fetchOrdersByDateRange = e => {
    e.preventDefault();
    setLoading(true);
    axios.get(`/api/admin/orders/range?from=${dateRange.from}&to=${dateRange.to}`)
      .then(res => setOrdersByDateRange(res.data))
      .catch(() => setError('Failed to fetch orders'))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#f4f6fa' }}>
      <div className="container-fluid" style={{ padding: 0 }}>
        <div className="row" style={{ minHeight: '100vh' }}>
                  {/* Sidebar */}
        <aside className="col-12 col-md-3 col-lg-2 p-0 admin-side-navbar d-flex flex-column align-items-center align-items-md-stretch" style={{ background: '#f1bd5d', minHeight: '100vh', boxShadow: '2px 0 16px rgba(60,60,60,0.10)' }}>
            {/* User Profile */}
            <div className="d-flex flex-column align-items-center py-4 border-bottom" style={{ borderColor: '#2d3250' }}>
              <FaUserCircle style={{ fontSize: 48, color: '#f7c873' }} />
              <span className="fw-bold mt-2" style={{ color: '#fff' }}>Admin</span>
              <span className="text-muted" style={{ fontSize: 13 }}>admin@email.com</span>
            </div>
            {/* Sidebar Menu */}
            <ul className="nav flex-column w-100 mt-4" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {sidebarItems.map(item => (
                                 <li
                   key={item.key}
                   className={`nav-item d-flex align-items-center gap-3 px-4 py-3${selectedSection === item.key ? ' active' : ''}`}
                   style={{ color: selectedSection === item.key ? '#fff' : '#fff', background: selectedSection === item.key ? '#28a745' : 'transparent', cursor: 'pointer', fontWeight: selectedSection === item.key ? 600 : 400, fontSize: 17, borderLeft: selectedSection === item.key ? '4px solid #28a745' : '4px solid transparent', transition: 'all 0.2s' }}
                   onClick={() => setSelectedSection(item.key)}
                 >
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </aside>
          {/* Main Content */}
          <main ref={mainRef} className="col-12 col-md-9 col-lg-10 admin-dashboard-main" style={{ background: '#fff', minHeight: '100vh', boxShadow: '0 2px 16px rgba(60,60,60,0.07)', borderRadius: 18, margin: '24px 0', padding: '32px 16px 48px 16px' }}>
            <h2 className="mb-4" style={{ color: '#232946', fontWeight: 700, letterSpacing: 1 }}>Admin Dashboard</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <button className="btn btn-info btn-sm mb-3 me-2" onClick={testTokenDecoding}>Test Token Decoding</button>
            <button className="btn btn-warning btn-sm mb-3" onClick={testAdminData}>Test Admin Data</button>
            {/* Section: Today's Deal */}
            {selectedSection === 'todaysDeal' && (
              <div className="card p-3 mb-4">
                <h5 className="fw-bold mb-2" style={{ color: '#b85c38' }}>Set Today's Deal Message</h5>
                <form onSubmit={async e => {
                  e.preventDefault();
                  setDealStatus('');
                  try {
                    await axios.post(
                      '/admin/todays-deal',
                      { message: dealMessage },
                      { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
                    );
                    setDealStatus('Message updated!');
                    setDealMessage('');
                  } catch {
                    setDealStatus('Failed to update message.');
                  }
                }} className="d-flex gap-2 align-items-center">
                  <input className="form-control" type="text" placeholder="Enter today's deal message" value={dealMessage} onChange={e => setDealMessage(e.target.value)} style={{ maxWidth: 400 }} />
                  <button className="btn btn-warning fw-bold" type="submit">Update</button>
                </form>
                {dealStatus && <div className="mt-2 text-success">{dealStatus}</div>}
              </div>
            )}
            {/* Section: Add Menu */}
            {selectedSection === 'addMenu' && (
              <div className="card p-3 mb-4">
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
            )}
            {/* Section: Existing Products */}
            {selectedSection === 'existingProducts' && (
              <div className="card p-3 shadow-lg border-0 mb-4" style={{ borderRadius: 24, background: 'linear-gradient(120deg, #fff8f0 60%, #f7c873 100%)', boxShadow: '0 8px 32px rgba(184,92,56,0.12)' }}>
                <h5 className="fw-bold mb-3" style={{ color: '#b85c38', letterSpacing: 1 }}>Existing Products</h5>
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
            )}
            {/* Section: Current Orders */}
            {selectedSection === 'currentOrders' && (
              <CurrentOrdersSection />
            )}
            {/* Section: Today's Orders */}
            {selectedSection === 'todaysOrders' && (
              <div className="card p-3 mt-4 mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h5>Today's Orders</h5>
                  <button className="btn btn-outline-primary btn-sm" onClick={fetchOrdersToday} disabled={loading}>Refresh</button>
                </div>
                <table className="table table-sm mt-2">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Payment Method</th>
                      <th>Payment Status</th>
                      <th>Total</th>
                      <th>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersToday.map(order => (
                      <tr key={order.id}>
                        <td><strong>{order.order_number}</strong></td>
                        <td>{order.customer_name}</td>
                        <td>{order.customer_phone}</td>
                        <td>{order.customer_address}</td>
                        <td>
                          <span className={`badge ${order.payment_method === 'cod' ? 'bg-warning' : 'bg-info'}`}>
                            {order.payment_method === 'cod' ? 'COD' : 'Online'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${order.payment_status === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                            {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td>₹{order.total_price}</td>
                        <td>
                          <small>
                            {order.items && order.items.length > 0 ? 
                              order.items.map(item => `${item.quantity}x`).join(', ') : 
                              'N/A'
                            }
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Section: Order Summary */}
            {selectedSection === 'orderSummary' && (
              <div className="card p-3 mt-4 mb-4">
                {/* Current Session Order Summary */}
                <div className="mb-4">
                  <h5 className="fw-bold mb-3" style={{ color: '#b85c38' }}>Current Session Order Summary</h5>
                  <div className="card p-3" style={{ background: '#fff8f0' }}>
                    <div className="d-flex justify-content-between mb-3">
                      <button 
                        className="btn btn-primary" 
                        onClick={fetchOrderSummary} 
                        disabled={loading}
                      >
                        {loading ? 'Loading...' : 'Refresh Summary'}
                      </button>
                      {orderSummary && orderSummary.summary && orderSummary.summary.length > 0 && (
                        <div className="text-end">
                          <span className="badge bg-info me-2">Total Orders: {orderSummary.total_orders || 0}</span>
                          <span className="badge bg-success">Total Customers: {orderSummary.total_customers || 0}</span>
                        </div>
                      )}
                    </div>
                    
                    {orderSummary && orderSummary.summary && orderSummary.summary.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-striped table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>Product</th>
                              <th className="text-center">Total Quantity</th>
                              <th className="text-center">Order Count</th>
                              <th className="text-center">Customer Count</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderSummary.summary.map(item => (
                              <tr key={item.product_id}>
                                <td><strong>{item.product_name}</strong></td>
                                <td className="text-center">
                                  <span className="badge bg-primary rounded-pill">{item.total_quantity}</span>
                                </td>
                                <td className="text-center">{item.order_count}</td>
                                <td className="text-center">{item.customer_count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="alert alert-info mt-2">
                          <small>
                            <strong>Note:</strong> This summary shows the total quantity of each product ordered in the current session.
                            Use this to prepare food according to demand.
                          </small>
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-warning">
                        {orderSummary && orderSummary.message ? orderSummary.message : 'No orders in current session or session not started.'}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Orders by Date Range */}
                <h5 className="fw-bold mb-3" style={{ color: '#b85c38' }}>Orders by Date Range</h5>
                <form className="row g-2" onSubmit={fetchOrdersByDateRange}>
                  <div className="col-auto">
                    <input className="form-control" type="date" value={dateRange.from} onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))} required />
                  </div>
                  <div className="col-auto">
                    <input className="form-control" type="date" value={dateRange.to} onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))} required />
                  </div>
                  <div className="col-auto">
                    <button className="btn btn-primary" type="submit" disabled={loading}>Get Orders</button>
                  </div>
                  {ordersByDateRange.length > 0 && (
                    <div className="col-auto">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary" 
                        onClick={refreshAllOrderTables}
                        disabled={loading}
                      >
                        Refresh
                      </button>
                    </div>
                  )}
                </form>
                {ordersByDateRange.length > 0 && (
                  <div className="mt-3">
                    <h6>Orders from {dateRange.from} to {dateRange.to}</h6>
                    <table className="table table-sm mt-2">
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Customer</th>
                          <th>Phone</th>
                          <th>Address</th>
                          <th>Payment Method</th>
                          <th>Payment Status</th>
                          <th>Total</th>
                          <th>Items</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordersByDateRange.map(order => (
                          <tr key={order.id}>
                            <td><strong>{order.order_number}</strong></td>
                            <td>{order.customer_name}</td>
                            <td>{order.customer_phone}</td>
                            <td>{order.customer_address}</td>
                            <td>
                              <span className={`badge ${order.payment_method === 'cod' ? 'bg-warning' : 'bg-info'}`}>
                                {order.payment_method === 'cod' ? 'COD' : 'Online'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${order.payment_status === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                                {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                              </span>
                            </td>
                            <td>₹{order.total_price}</td>
                            <td>
                              <small>
                                {order.items && order.items.length > 0 ? 
                                  order.items.map(item => `${item.quantity}x ${item.name}`).join(', ') : 
                                  'N/A'
                                }
                              </small>
                            </td>
                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {ordersByDateRange.length === 0 && dateRange.from && dateRange.to && (
                  <div className="mt-3 text-center text-muted">
                    No orders found for the selected date range.
                  </div>
                )}
              </div>
            )}
            {/* Section: Payment Management */}
            {selectedSection === 'paymentManagement' && (
              <div className="card p-3 mt-4 mb-4">
                <h5 className="fw-bold mb-3" style={{ color: '#b85c38' }}>Payment Management</h5>
                <div className="row">
                  <div className="col-md-6">
                    <div className="card p-3 mb-3" style={{ background: '#fff8f0' }}>
                      <h6 className="mb-3">Mark Payment as Paid</h6>
                      <form onSubmit={handleUpdatePayment}>
                        <div className="mb-3">
                          <label className="form-label">Order Number</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Enter order number (e.g., 0001, 0002...)" 
                            value={orderNumber} 
                            onChange={(e) => setOrderNumber(e.target.value)}
                            maxLength="4"
                            pattern="[0-9]{4}"
                          />
                          <small className="text-muted">Enter the 4-digit order number to mark payment as paid</small>
                        </div>
                        <button 
                          type="submit" 
                          className="btn btn-success" 
                          disabled={loading || !orderNumber.trim()}
                        >
                          {loading ? 'Updating...' : 'Mark as Paid'}
                        </button>
                      </form>
                      {paymentUpdateStatus && (
                        <div className={`mt-3 alert ${paymentUpdateStatus.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
                          {paymentUpdateStatus}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card p-3" style={{ background: '#f7e6c7' }}>
                      <h6 className="mb-3">Payment Instructions</h6>
                      <ul className="list-unstyled">
                        <li className="mb-2">• <strong>COD Orders:</strong> Mark as paid when cash is collected</li>
                        <li className="mb-2">• <strong>Online Orders:</strong> Automatically marked as paid</li>
                        <li className="mb-2">• <strong>Order Numbers:</strong> 4-digit format (0001, 0002, etc.)</li>
                        <li className="mb-2">• <strong>Payment Status:</strong> Shows in orders list</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* UPI Settings section removed */}
          </main>
        </div>
      </div>
    </div>
  );
}

// Orders component for users to view their order history
function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    console.log('Order details:', order);
    console.log('Order items:', order.items);
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          {error}
          <button className="btn btn-outline-danger ms-2" onClick={fetchUserOrders}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">
                <i className="bi bi-list-ul me-2"></i>
                My Orders
              </h4>
            </div>
            <div className="card-body">
              {orders.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-1 text-muted"></i>
                  <h5 className="mt-3 text-muted">No orders yet</h5>
                  <p className="text-muted">Start ordering delicious food from our menu!</p>
                  <Link to="/menu" className="btn btn-success">Browse Menu</Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Order #</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment Method</th>
                        <th>Payment Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <strong className="text-success">#{order.order_number}</strong>
                          </td>
                          <td>{formatDate(order.created_at)}</td>
                          <td>
                            <small>
                              {order.items && order.items.length > 0 
                                ? `${order.items.length} item${order.items.length > 1 ? 's' : ''}`
                                : 'N/A'
                              }
                            </small>
                          </td>
                          <td>
                            <strong>₹{order.total_price}</strong>
                          </td>
                          <td>
                            <span className={`badge ${order.payment_method === 'cod' ? 'bg-warning' : 'bg-info'}`}>
                              {order.payment_method === 'cod' ? 'COD' : 'Online'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${order.payment_status === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                              {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleViewDetails(order)}
                            >
                              <i className="bi bi-eye me-1"></i>
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className="bi bi-receipt me-2"></i>
                  Order Details - #{selectedOrder.order_number}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowOrderDetails(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-success">Order Information</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td><strong>Order Number:</strong></td>
                          <td>#{selectedOrder.order_number}</td>
                        </tr>
                        <tr>
                          <td><strong>Order Date:</strong></td>
                          <td>{formatDate(selectedOrder.created_at)}</td>
                        </tr>
                        <tr>
                          <td><strong>Payment Method:</strong></td>
                          <td>
                            <span className={`badge ${selectedOrder.payment_method === 'cod' ? 'bg-warning' : 'bg-info'}`}>
                              {selectedOrder.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Payment Status:</strong></td>
                          <td>
                            <span className={`badge ${selectedOrder.payment_status === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                              {selectedOrder.payment_status === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Total Amount:</strong></td>
                          <td><strong className="text-success">₹{parseFloat(selectedOrder.total_price || 0).toFixed(2)}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-success">Delivery Information</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td><strong>Name:</strong></td>
                          <td>{selectedOrder.customer_name}</td>
                        </tr>
                        <tr>
                          <td><strong>Phone:</strong></td>
                          <td>{selectedOrder.customer_phone}</td>
                        </tr>
                        <tr>
                          <td><strong>Address:</strong></td>
                          <td>{selectedOrder.customer_address}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h6 className="text-success">Order Items</h6>
                  {selectedOrder.items && Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead className="table-light">
                          <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map((item, index) => {
                            const price = parseFloat(item.price_at_time || item.price || 0);
                            const quantity = parseInt(item.quantity || 0);
                            const total = price * quantity;
                            return (
                              <tr key={index}>
                                <td>{item.name || `Product ${item.product_id}`}</td>
                                <td>{quantity}</td>
                                <td>₹{price.toFixed(2)}</td>
                                <td>₹{total.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="table-success">
                            <td colSpan="3"><strong>Total:</strong></td>
                            <td><strong>₹{parseFloat(selectedOrder.total_price || 0).toFixed(2)}</strong></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      Order items details not available
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowOrderDetails(false)}
                >
                  Close
                </button>
                <Link to="/menu" className="btn btn-success">
                  <i className="bi bi-plus-circle me-1"></i>
                  Order Again
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showOrderDetails && (
        <div 
          className="modal-backdrop fade show" 
          onClick={() => setShowOrderDetails(false)}
        ></div>
      )}
    </div>
  );
}

// Current Orders Section Component
function CurrentOrdersSection() {
  const [sessionStatus, setSessionStatus] = useState(null);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch session status and current orders
  const fetchSessionStatus = async () => {
    try {
      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please login as admin.');
        return;
      }
      
      const response = await axios.get('/api/admin/order-management/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSessionStatus(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Authentication failed. Please login as admin.');
      } else {
        setError('Failed to fetch session status');
      }
      console.error('Error fetching session status:', err);
    }
  };

  const fetchCurrentOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please login as admin.');
        return;
      }
      
      const response = await axios.get('/api/admin/current-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCurrentOrders(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Authentication failed. Please login as admin.');
      } else {
        setError('Failed to fetch current orders');
      }
      console.error('Error fetching current orders:', err);
    }
  };

  // Auto-refresh every 30 seconds when session is active
  useEffect(() => {
    fetchSessionStatus();
    
    const interval = setInterval(() => {
      fetchSessionStatus();
      if (sessionStatus?.sessionActive) {
        fetchCurrentOrders();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [sessionStatus?.sessionActive]);

  // Fetch current orders when session becomes active
  useEffect(() => {
    if (sessionStatus?.sessionActive) {
      fetchCurrentOrders();
    } else {
      setCurrentOrders([]);
    }
  }, [sessionStatus?.sessionActive]);

  const handleStartSession = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please login as admin.');
        setLoading(false);
        return;
      }
      
      await axios.post('/api/admin/order-management/start', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchSessionStatus();
      setCurrentOrders([]); // Clear previous orders
      setError(null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Authentication failed. Please login as admin.');
      } else {
        setError('Failed to start order session');
      }
      console.error('Error starting session:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStopSession = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please login as admin.');
        setLoading(false);
        return;
      }
      
      await axios.post('/api/admin/order-management/stop', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchSessionStatus();
      setError(null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Authentication failed. Please login as admin.');
      } else {
        setError('Failed to stop order session');
      }
      console.error('Error stopping session:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="card p-3 mt-4 mb-4">
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Session Control Section */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h5 className="fw-bold mb-3" style={{ color: '#b85c38' }}>Current Orders Management</h5>
          
          {sessionStatus && (
            <div className="alert alert-info mb-3">
              <div className="row">
                <div className="col-md-6">
                  <strong>Status:</strong> 
                  <span className={`badge ms-2 ${sessionStatus.sessionActive ? 'bg-success' : 'bg-secondary'}`}>
                    {sessionStatus.sessionActive ? 'Active Session' : 'No Active Session'}
                  </span>
                </div>
                {sessionStatus.sessionActive && sessionStatus.sessionStartTime && (
                  <div className="col-md-6">
                    <strong>Started:</strong> {formatDateTime(sessionStatus.sessionStartTime)}
                  </div>
                )}
              </div>
              {sessionStatus.lastSessionInfo && !sessionStatus.sessionActive && (
                <div className="mt-2">
                  <small className="text-muted">
                    Last session: {formatDateTime(sessionStatus.lastSessionInfo.start_time)} to {formatDateTime(sessionStatus.lastSessionInfo.end_time)}
                  </small>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="col-md-4 text-end">
          <div className="d-flex gap-2 justify-content-end">
            {sessionStatus?.sessionActive ? (
              <button 
                className="btn btn-danger fw-semibold" 
                onClick={handleStopSession}
                disabled={loading}
              >
                {loading ? 'Stopping...' : 'Stop Session'}
              </button>
            ) : (
              <button 
                className="btn btn-success fw-semibold" 
                onClick={handleStartSession}
                disabled={loading}
              >
                {loading ? 'Starting...' : 'Start Session'}
              </button>
            )}
            <button 
              className="btn btn-outline-primary" 
              onClick={() => {
                fetchSessionStatus();
                if (sessionStatus?.sessionActive) {
                  fetchCurrentOrders();
                }
              }}
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Order Short Details */}
      {sessionStatus?.sessionActive && currentOrders.length > 0 && (
        <div className="mb-4">
          <h5 className="fw-bold mb-3" style={{ color: '#b85c38' }}>Order Short Details</h5>
          <div className="card p-3" style={{ background: '#fff8f0' }}>
            <div className="row">
              {/* Total Orders */}
              <div className="col-md-3 mb-3">
                <div className="card h-100 border-primary">
                  <div className="card-body text-center">
                    <h3 className="text-primary">{currentOrders.length}</h3>
                    <p className="card-text">Total Orders</p>
                  </div>
                </div>
              </div>
              
              {/* Total Items */}
              <div className="col-md-3 mb-3">
                <div className="card h-100 border-success">
                  <div className="card-body text-center">
                    <h3 className="text-success">
                      {currentOrders.reduce((total, order) => {
                        return total + order.items.reduce((sum, item) => sum + item.quantity, 0);
                      }, 0)}
                    </h3>
                    <p className="card-text">Total Items</p>
                  </div>
                </div>
              </div>
              
              {/* Total Revenue */}
              <div className="col-md-3 mb-3">
                <div className="card h-100 border-warning">
                  <div className="card-body text-center">
                    <h3 className="text-warning">₹{currentOrders.reduce((sum, order) => sum + parseFloat(order.total_price), 0).toFixed(2)}</h3>
                    <p className="card-text">Total Revenue</p>
                  </div>
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="col-md-3 mb-3">
                <div className="card h-100 border-info">
                  <div className="card-body text-center">
                    <div className="d-flex justify-content-around">
                      <div>
                        <h4 className="text-warning">{currentOrders.filter(order => order.payment_method === 'cod').length}</h4>
                        <small>COD</small>
                      </div>
                      <div>
                        <h4 className="text-info">{currentOrders.filter(order => order.payment_method === 'online').length}</h4>
                        <small>Online</small>
                      </div>
                    </div>
                    <p className="card-text mt-2">Payment Methods</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Food Order Quantities */}
            <div className="mt-4">
              <h6 className="fw-bold mb-3">Food Order Quantities</h6>
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Food Item</th>
                          <th className="text-center">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          // Calculate food item quantities
                          const foodQuantities = {};
                          
                          currentOrders.forEach(order => {
                            order.items.forEach(item => {
                              if (foodQuantities[item.name]) {
                                foodQuantities[item.name] += item.quantity;
                              } else {
                                foodQuantities[item.name] = item.quantity;
                              }
                            });
                          });
                          
                          // Sort by quantity (highest first)
                          return Object.entries(foodQuantities)
                            .sort((a, b) => b[1] - a[1])
                            .map(([foodName, quantity]) => (
                              <tr key={foodName}>
                                <td>
                                  <span className="fw-semibold">{foodName}</span>
                                </td>
                                <td className="text-center">
                                  <span className="badge bg-success">{quantity}</span>
                                </td>
                              </tr>
                            ));
                        })()} 
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Current Orders Display */}
      {sessionStatus?.sessionActive && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0">Current Orders ({currentOrders.length})</h6>
            <small className="text-muted">Real-time orders during this session</small>
          </div>
          
          {currentOrders.length === 0 ? (
            <div className="alert alert-warning">
              <i className="bi bi-info-circle me-2"></i>
              No orders received during this session yet. Orders will appear here in real-time.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Time</th>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th>Items</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map(order => (
                    <tr key={order.id}>
                      <td>
                        <small className="fw-semibold text-primary">
                          {formatTime(order.created_at)}
                        </small>
                      </td>
                      <td>
                        <strong className="text-success">#{order.order_number}</strong>
                      </td>
                      <td>{order.customer_name}</td>
                      <td>
                        <small>{order.customer_phone}</small>
                      </td>
                      <td>
                        <span className={`badge ${order.payment_method === 'cod' ? 'bg-warning' : 'bg-info'}`}>
                          {order.payment_method === 'cod' ? 'COD' : 'Online'}
                        </span>
                      </td>
                      <td>
                        <strong>₹{order.total_price}</strong>
                      </td>
                      <td>
                        <small>
                          {order.items && order.items.length > 0 ? 
                            order.items.map(item => `${item.quantity}x ${item.name}`).join(', ') : 
                            'N/A'
                          }
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {!sessionStatus?.sessionActive && (
        <div className="alert alert-secondary">
          <i className="bi bi-info-circle me-2"></i>
          Start a session to begin tracking current orders. Orders placed during the active session will be displayed here in real-time.
        </div>
      )}
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
  const [otp, setOtp] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = window.location;

  // Countdown timer for OTP expiration
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/register', form);
      setShowOtpForm(true);
      setTimeLeft(300); // 5 minutes countdown
      setSuccess(false);
      
      // Handle development mode - show OTP in alert
      if (response.data.developmentMode && response.data.otp) {
        alert(`Development Mode: Your OTP is ${response.data.otp}\n\nThis OTP is also logged in the server console.`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async e => {
    e.preventDefault();
    setOtpLoading(true);
    setError(null);
    try {
      await axios.post('/api/verify-otp', { email: form.email, otp });
      setSuccess(true);
      setTimeout(() => { window.location.href = '/login'; }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpLoading(true);
    setError(null);
    try {
      await axios.post('/api/register', form);
      setTimeLeft(300); // Reset countdown
      setOtp('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  if (success) return (
    <div className="container mt-5 text-center">
      <div className="card p-4 shadow mx-auto" style={{ maxWidth: 400 }}>
        <h2 className="text-success">Registration Successful!</h2>
        <p>You can now login with your email and password.</p>
        <p>Redirecting to login...</p>
      </div>
    </div>
  );
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(120deg, #fff8f0 60%, #f7c873 100%)',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 0,
        paddingBottom: 40,
      }}
    >
      <div className="card p-4 shadow mx-auto" style={{ maxWidth: 400, width: '100%', marginTop: 0, marginBottom: 0, paddingBottom: 0 }}>
        {!showOtpForm ? (
          <>
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
              {error && <div className="alert alert-danger">{error}</div>}
              <button className="btn btn-primary w-100" type="submit" disabled={loading} style={{ marginTop: 0, marginBottom: 0 }}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
            <div className="mt-3 text-center" style={{ marginBottom: 0, paddingBottom: 0 }}>
              <Link to="/login">Already have an account? Login</Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-4 text-center">Verify OTP</h2>
            <div className="alert alert-info">
              <p className="mb-2">We've sent a 6-digit OTP to <strong>{form.email}</strong></p>
              <p className="mb-0">Please check your email and enter the OTP below.</p>
            </div>
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-3">
                <label className="form-label">Enter OTP</label>
                <input 
                  className="form-control text-center" 
                  type="text" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required 
                />
              </div>
              {timeLeft > 0 && (
                <div className="text-center mb-3">
                  <small className="text-muted">
                    Time remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </small>
                </div>
              )}
              {error && <div className="alert alert-danger">{error}</div>}
              <button className="btn btn-success w-100 mb-2" type="submit" disabled={otpLoading || timeLeft === 0}>
                {otpLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary w-100 mb-2" 
                onClick={handleResendOtp}
                disabled={otpLoading || timeLeft > 0}
              >
                {otpLoading ? 'Sending...' : 'Resend OTP'}
              </button>
              <button 
                type="button" 
                className="btn btn-link w-100" 
                onClick={() => {
                  setShowOtpForm(false);
                  setOtp('');
                  setError(null);
                }}
              >
                Back to Registration
              </button>
            </form>
          </>
        )}
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
    <div
      style={
        window.innerWidth <= 576
          ? {
              minHeight: '100vh',
              width: '100vw',
              background: 'linear-gradient(120deg, #fff8f0 60%, #f7c873 100%)',
              padding: 0,
              margin: 0,
              overflowY: 'auto',
              paddingTop: '56px'
            }
          : {
              minHeight: '100vh',
              width: '100vw',
              background: 'linear-gradient(120deg, #fff8f0 60%, #f7c873 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }
      }
    >
      <div
        className={window.innerWidth <= 576 ? '' : 'card p-4 shadow'}
        style={
          window.innerWidth <= 576
            ? {
                width: '100vw',
                maxWidth: '100vw',
                boxShadow: 'none',
                borderRadius: 0,
                background: 'white',
                padding: '16px 8px',
                margin: 0
              }
            : { maxWidth: 400, width: '100%', margin: '32px 0 80px 0', marginLeft: 16, marginRight: 16, padding: 24 }
        }
      >
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

function CartNavIcon({ onMenuClose }) {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <li className="nav-item position-relative">
      <Link className="nav-link d-flex align-items-center justify-content-center h-100 position-relative" style={{height: '64px', fontSize: 22}} to="/cart" onClick={onMenuClose}>
        <span className="bi bi-cart position-relative" style={{fontSize: 28, lineHeight: 1, display: 'inline-block'}}>
          {cartCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle-y badge rounded-pill bg-danger" style={{fontSize: 12, minWidth: 20, padding: '2px 6px', left: '70%', top: '-4px'}}>
              {cartCount}
            </span>
          )}
        </span>
      </Link>
    </li>
  );
}

// CartBar: fixed bottom bar for mobile
function CartBar() {
  const { cart } = useCart();
  if (!cart.length) return null;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <div className="cart-bar-mobile d-flex align-items-center justify-content-between px-3 py-2">
      <div className="d-flex flex-column align-items-start" style={{flex: 1}}>
        <span className="fw-bold" style={{fontSize: 15}}>{totalItems} item{totalItems > 1 ? 's' : ''} in cart</span>
        <span className="text-muted" style={{fontSize: 13}}>₹{totalPrice}</span>
      </div>
      <Link to="/cart" className="btn btn-success rounded-pill fw-semibold ms-2" style={{fontSize: 16, padding: '8px 24px'}}>View Cart</Link>
    </div>
  );
}

function MainRoutes() {
  const location = useLocation();
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/menu" element={<ProtectedRoute element={<Menu />} />} />
        <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
        <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
        <Route path="/orders" element={<ProtectedRoute element={<Orders />} />} />
        <Route path="/admin" element={<ProtectedRoute element={<Admin />} adminOnly={true} />} />
      </Routes>
      {location.pathname === '/menu' && <CartBar />}
    </>
  );
}

function App() {
  const { user, logout, login } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showAdminProfile, setShowAdminProfile] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
  }, []);
  
  // Handle clicking outside mobile menu - removed to prevent interference with menu clicks
  
  // Handle escape key to close mobile menu - simplified
  useEffect(() => {
    if (!navCollapsed) {
      const handleEscape = (event) => {
        if (event.key === 'Escape') {
          setNavCollapsed(true);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [navCollapsed]);
  
  // Simple click outside handler - removed to prevent destroy error
  
  // Close mobile menu on route change - removed problematic dependency
  
  // Debug navigation state changes - removed
  
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
              <img src={logo} alt="Lakshmi's Kitchen Logo" style={{ height: 40, width: 40, objectFit: 'cover', borderRadius: '50%' }} />
              Lakshmi's Kitchen
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              aria-controls="navbarNav"
              aria-expanded={!navCollapsed}
              aria-label="Toggle navigation"
              onClick={() => setNavCollapsed(!navCollapsed)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse${!navCollapsed ? ' show' : ''}`} id="navbarNav">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0" style={{gap: 8}}>
                <CartNavIcon onMenuClose={() => setNavCollapsed(true)} />
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center justify-content-center h-100" style={{height: '64px'}} to="/" onClick={() => setNavCollapsed(true)}>Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center justify-content-center h-100" style={{height: '64px'}} to="/menu" onClick={() => setNavCollapsed(true)}>Menu</Link>
                </li>
                {user && localStorage.getItem('userType') !== 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center justify-content-center h-100" style={{height: '64px'}} to="/orders" onClick={() => setNavCollapsed(true)}>Orders</Link>
                  </li>
                )}
                {localStorage.getItem('userType') === 'admin' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link d-flex align-items-center justify-content-center h-100" style={{height: '64px'}} to="/admin" onClick={() => setNavCollapsed(true)}>Admin</Link>
                    </li>
                    <li className="nav-item d-flex align-items-center justify-content-center" style={{height: '64px'}}>
                      <button className="btn btn-link nav-link p-0" style={{margin: 0, fontSize: 36, display: 'flex', alignItems: 'center', height: '64px'}} onClick={() => setShowAdminProfile(true)} title="Admin Profile">
                        <span className="bi bi-person-circle" style={{display: 'block', margin: 'auto'}}></span>
                      </button>
                    </li>
                  </>
                )}
                {user && localStorage.getItem('userType') !== 'admin' ? (
                  <li className="nav-item d-flex align-items-center justify-content-center" style={{height: '64px'}}>
                    <button className="btn btn-link nav-link p-0" style={{margin: 0, fontSize: 36, display: 'flex', alignItems: 'center', height: '64px'}} onClick={() => setShowProfile(true)} title="Profile">
                      <span className="bi bi-person-circle" style={{display: 'block', margin: 'auto'}}></span>
                    </button>
                  </li>
                ) : (!user && localStorage.getItem('userType') !== 'admin') && (
                  <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center justify-content-center h-100" style={{height: '64px'}} to="/login" onClick={() => setNavCollapsed(true)}>Login</Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
        {/* Mobile menu backdrop - removed to fix dimming issue */}
        {user && <ProfileDrawer show={showProfile} onClose={() => setShowProfile(false)} user={user} onSave={handleProfileSave} logout={logout} />}
        {admin && <AdminProfileDrawer show={showAdminProfile} onClose={() => setShowAdminProfile(false)} admin={admin} onLogout={handleAdminLogout} />}
        <MainRoutes />
      </Router>
    </CartProvider>
  );
}

export default App;
