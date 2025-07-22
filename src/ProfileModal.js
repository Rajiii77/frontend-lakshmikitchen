import React, { useState } from 'react';

function ProfileDrawer({ show, onClose, user, onSave, logout }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...user });

  React.useEffect(() => {
    setForm({ ...user });
    setEditMode(false);
  }, [user, show]);

  // Drawer styles
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
  // Responsive for mobile
  if (window.innerWidth < 600) {
    drawerStyle.width = '100vw';
    drawerStyle.borderTopLeftRadius = 18;
    drawerStyle.borderBottomLeftRadius = 18;
  }

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(form);
    setEditMode(false);
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
          <h4 className="fw-bold mb-1" style={{ color: '#1a4d2e', fontFamily: 'Segoe UI' }}>{user.name}</h4>
          <div className="text-secondary mb-2" style={{ fontSize: 15 }}>{user.email}</div>
        </div>
        <div className="px-4 card-body pt-0 w-100">
          {editMode ? (
            <form onSubmit={handleSave} className="mt-2">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input className="form-control rounded-pill" name="name" value={form.name || ''} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input className="form-control rounded-pill" name="email" value={form.email || ''} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input className="form-control rounded-pill" name="phone_number" value={form.phone_number || ''} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input className="form-control rounded-pill" name="home_address" value={form.home_address || ''} onChange={handleChange} />
              </div>
              <div className="d-flex gap-2 justify-content-end mt-3">
                <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setEditMode(false)}>Cancel</button>
                <button type="submit" className="btn btn-success rounded-pill px-4">Save</button>
              </div>
            </form>
          ) : (
            <div className="px-1">
              <div className="mb-3 d-flex align-items-center">
                <span className="bi bi-person me-2" style={{ color: '#b85c38', fontSize: 20 }}></span>
                <span className="fw-semibold">{user.name}</span>
              </div>
              <div className="mb-3 d-flex align-items-center">
                <span className="bi bi-envelope me-2" style={{ color: '#b85c38', fontSize: 20 }}></span>
                <span>{user.email}</span>
              </div>
              <div className="mb-3 d-flex align-items-center">
                <span className="bi bi-telephone me-2" style={{ color: '#b85c38', fontSize: 20 }}></span>
                <span>{user.phone_number || <span className="text-muted">Not set</span>}</span>
              </div>
              <div className="mb-4 d-flex align-items-center">
                <span className="bi bi-geo-alt me-2" style={{ color: '#b85c38', fontSize: 20 }}></span>
                <span>{user.home_address || <span className="text-muted">Not set</span>}</span>
              </div>
              <div className="d-flex justify-content-center">
                <button className="btn btn-warning rounded-pill px-4 fw-semibold shadow-sm" style={{ color: '#3e2723' }} onClick={() => setEditMode(true)}>Edit Profile</button>
              </div>
            </div>
          )}
        </div>
        {/* Logout button at the bottom */}
        <div className="px-4 mt-4 mb-3">
          <button
            className="btn btn-danger rounded-pill w-100 fw-semibold shadow-sm"
            style={{ fontSize: 18 }}
            onClick={() => { logout(); onClose(); }}
          >
            <span className="bi bi-box-arrow-right me-2"></span>Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default ProfileDrawer; 