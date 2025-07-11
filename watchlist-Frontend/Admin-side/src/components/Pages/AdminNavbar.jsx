import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout', {}, { withCredentials: true });
      toast.success("Admin logged out");
      localStorage.clear()
      navigate('/');
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const isActive = (path) => location.pathname === path
  

  return (
    
    <nav className="navbar navbar-dark bg-dark px-4">
      <div className="container d-flex justify-content-between align-items-center">
      <span className="navbar-brand">🎬 Admin Panel</span>
      <div className=" d-flex align-items-center gap-2 ">
        <button className={`btn ${isActive('/admin-dashboard') ? 'btn-secondary' : 'btn-outline-light'} `} onClick={() => navigate('/admin-dashboard')}>Add Movies</button>
        <button className={`btn ${isActive('/admin-requests') ? 'btn-secondary' : 'btn-outline-light'} `} onClick={() => navigate('/admin-requests')}>Requests</button>
        <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
     </div>
     </div>
   </nav>
  );
}

export default AdminNavbar;
