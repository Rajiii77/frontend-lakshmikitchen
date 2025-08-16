import React, { useState } from 'react';
import axios from 'axios';

function AdminProfileDrawer({ show, onClose, admin, onLogout }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [addError, setAddError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(null);
  const [adding, setAdding] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ ...admin });
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(null);
  const [editing, setEditing] = useState(false);

  if (!show) return null;

  const drawerStyle = {
    position: 'fixed',
    top: 0,
    right: show ? 0 : '-100%',
    height: '100vh',
    width: 350,
    maxWidth: '100vw',
    background: 'linear-gradient(120deg, #fff8f0 60%, #f7c873 100%)',
    boxShadow: '-4px 0 24px rgba(60,40,20,0.10)',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    zIndex: 2000,
    transition: 'right 0.35s cubic-bezier(.4,1.2,.4,1)',
    overflowY: 'auto',
    paddingBottom: 32,
  };
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.15)',
    zIndex: 1999,
    display: show ? 'block' : 'none',
  };
  if (window.innerWidth < 600) {
    drawerStyle.width = '100vw';
    drawerStyle.borderTopLeftRadius = 18;
    drawerStyle.borderBottomLeftRadius = 18;
  }

  // Handle add new admin
  const handleAddChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  
  const handleOtpChange = e => {
    setOtp(e.target.value);
  };
  
  const handleSendOtp = async e => {
    e.preventDefault();
    setAdding(true);
    setAddError(null);
    setAddSuccess(null);
    try {
      const response = await axios.post('/api/admin/send-otp', form);
      setOtpSent(true);
      setAddSuccess(response.data.message || 'OTP sent successfully!');
      if (response.data.developmentMode && response.data.otp) {
        console.log('Development OTP:', response.data.otp);
      }
    } catch (err) {
      setAddError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setAdding(false);
    }
  };
  
  const handleVerifyOtp = async e => {
    e.preventDefault();
    setAdding(true);
    setAddError(null);
    setAddSuccess(null);
    try {
      await axios.post('/api/admin/verify-otp', { email: form.email, otp });
      setAddSuccess('Admin added successfully!');
      setForm({ username: '', email: '', password: '' });
      setOtp('');
      setOtpSent(false);
    } catch (err) {
      setAddError(err.response?.data?.error || 'Failed to verify OTP');
    } finally {
      setAdding(false);
    }
  };
  
  const handleAddAdmin = async e => {
    e.preventDefault();
    handleSendOtp(e);
  };

  // Handle edit profile
  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };
  const handleEditProfile = async e => {
    e.preventDefault();
    setEditing(true);
    setEditError(null);
    setEditSuccess(null);
    try {
      const res = await axios.put('/api/admin/profile', editForm);
      setEditSuccess('Profile updated!');
      // Update localStorage so changes persist
      localStorage.setItem('admin', JSON.stringify(res.data));
      setEditMode(false);
    } catch (err) {
      setEditError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setEditing(false);
    }
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={drawerStyle} className="shadow-lg animate__animated animate__slideInRight">
        <button type="button" className="btn-close position-absolute end-0 m-3" style={{ zIndex: 2 }} onClick={onClose}></button>
        <div className="d-flex flex-column align-items-center pt-4 pb-2" style={{ position: 'relative' }}>
          <div style={{
            background: 'linear-gradient(135deg, #b85c38 60%, #f7c873 100%)',
            borderRadius: '50%',
            width: 90,
            height: 90,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(184,92,56,0.10)',
            marginBottom: 12,
          }}>
            <span className="bi bi-person-circle" style={{ fontSize: 56, color: '#fff' }}></span>
          </div>
          <h4 className="fw-bold mb-1" style={{ color: '#1a4d2e', fontFamily: 'Segoe UI' }}>{admin.username}</h4>
          <div className="text-secondary mb-2" style={{ fontSize: 15 }}>{admin.email}</div>
        </div>
        <div className="px-4 card-body pt-0 w-100">
          {editMode ? (
            <form onSubmit={handleEditProfile} className="border rounded p-3 bg-white shadow-sm mb-3">
              <h6 className="fw-bold mb-2">Edit Profile</h6>
              <div className="mb-2">
                <input className="form-control" name="username" placeholder="Username" value={editForm.username || ''} onChange={handleEditChange} required />
              </div>

              <div className="mb-2">
                <input className="form-control" name="email" type="email" placeholder="Email" value={editForm.email || ''} onChange={handleEditChange} required />
              </div>
              {editError && <div className="alert alert-danger py-1 my-2">{editError}</div>}
              {editSuccess && <div className="alert alert-success py-1 my-2">{editSuccess}</div>}
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-secondary rounded-pill px-4" type="button" onClick={() => setEditMode(false)}>Cancel</button>
                <button className="btn btn-success rounded-pill px-4" type="submit" disabled={editing}>{editing ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          ) : (
            <>
              <div className="mb-3 d-flex align-items-center">
                <span className="bi bi-person me-2" style={{ color: '#b85c38', fontSize: 20 }}></span>
                <span className="fw-semibold">{admin.username}</span>
              </div>
              <div className="mb-3 d-flex align-items-center">
                <span className="bi bi-envelope me-2" style={{ color: '#b85c38', fontSize: 20 }}></span>
                <span>{admin.email}</span>
              </div>
              <button className="btn btn-outline-primary rounded-pill w-100 fw-semibold shadow-sm mb-2" style={{ fontSize: 16 }} onClick={() => { setEditForm({ ...admin }); setEditMode(true); }}>Edit Profile</button>
            </>
          )}
        </div>
        <div className="px-4 mb-3">
          <button
            className="btn btn-primary rounded-pill w-100 fw-semibold shadow-sm mb-2"
            style={{ fontSize: 16 }}
            onClick={() => setShowAdd(v => !v)}
          >
            <span className="bi bi-person-plus me-2"></span>Add New Admin
          </button>
        </div>
        {showAdd && (
          <div className="px-4 mb-3">
            {!otpSent ? (
              <form onSubmit={handleAddAdmin} className="border rounded p-3 bg-white shadow-sm">
                <h6 className="fw-bold mb-2">Add New Admin</h6>
                <div className="mb-2">
                  <input className="form-control" name="username" placeholder="Username" value={form.username} onChange={handleAddChange} required />
                </div>
                <div className="mb-2">
                  <input className="form-control" name="email" type="email" placeholder="Email" value={form.email} onChange={handleAddChange} required />
                </div>
                <div className="mb-2">
                  <input className="form-control" name="password" type="password" placeholder="Password" value={form.password} onChange={handleAddChange} required />
                </div>
                {addError && <div className="alert alert-danger py-1 my-2">{addError}</div>}
                {addSuccess && <div className="alert alert-success py-1 my-2">{addSuccess}</div>}
                <button className="btn btn-success w-100 rounded-pill" type="submit" disabled={adding}>{adding ? 'Sending OTP...' : 'Send OTP'}</button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="border rounded p-3 bg-white shadow-sm">
                <h6 className="fw-bold mb-2">Verify OTP</h6>
                <p className="small text-muted">An OTP has been sent to {form.email}</p>
                <div className="mb-2">
                  <input 
                    className="form-control" 
                    placeholder="Enter OTP" 
                    value={otp} 
                    onChange={handleOtpChange} 
                    required 
                    maxLength="6" 
                    pattern="[0-9]{6}" 
                    title="Please enter a 6-digit OTP"
                  />
                </div>
                {addError && <div className="alert alert-danger py-1 my-2">{addError}</div>}
                {addSuccess && <div className="alert alert-success py-1 my-2">{addSuccess}</div>}
                <div className="d-flex gap-2">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary rounded-pill flex-grow-1" 
                    onClick={() => setOtpSent(false)}
                  >
                    Back
                  </button>
                  <button 
                    className="btn btn-success rounded-pill flex-grow-1" 
                    type="submit" 
                    disabled={adding}
                  >
                    {adding ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
                <div className="mt-2 text-center">
                  <button 
                    type="button" 
                    className="btn btn-link btn-sm text-decoration-none" 
                    onClick={handleSendOtp}
                    disabled={adding}
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
        <div className="px-4 mt-2 mb-3">
          <button
            className="btn btn-danger rounded-pill w-100 fw-semibold shadow-sm"
            style={{ fontSize: 18 }}
            onClick={onLogout}
          >
            <span className="bi bi-box-arrow-right me-2"></span>Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminProfileDrawer;