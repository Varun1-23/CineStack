import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import api from '../services/api';

function AdminloginPage() {
    const [formData , setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate()

    const handleChange = (e) => 
        setFormData({...formData, [e.target.name]: e.target.value})
   
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post('/admin/login', formData)
            if(res.data.data.role === 'admin'){
              toast.success('admin logged in')
              navigate('/admin-dashboard')
            }
            else{
              toast.error('invalid credentials')
            }
        } catch (error) {
            toast.error('login failed');
        }
    } 

  return (
   <div className="login-container">
     {/* Left Side */}
     <div className="login-left">
        <div className="login-left-content">
          <h1>Cine Stack!</h1>
          <p>Time to add more movies</p>
        </div>
      </div>
       {/* Right Side */}
       <div className="login-right d-flex flex-column align-items-center justify-content-center">
        <div className="login-card">
          <h4 className="text-center mb-4">Admin Login</h4>
       <form onSubmit={handleSubmit}>
        <input type="email" name="email" className="form-control mb-3" placeholder="Email" onChange={handleChange} autoComplete="username" />
         <input type="password" name="password" className="form-control mb-3" placeholder="Password" onChange={handleChange}  autoComplete="current-password" />
         <button type="submit" className="btn btn-dark w-100">Login</button>
       </form>
       </div>
      </div>
    </div>
  )
}

export default AdminloginPage