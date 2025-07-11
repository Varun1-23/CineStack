import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

function LoginPage() {
    const [formData , setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          // console.log("🟡 Logging in with:", formData);
            const res = await api.post('/users/login', formData)
          //  console.log("✅ Login Response:", res.data);
            toast.success('Login successful')
            localStorage.setItem("userEmail", res.data.data.email);
            navigate('/movies')
        } catch (error) {
          // console.error("❌ Login Error:", error.response?.data || error.message)
            toast.error(
                error?.response?.data?.message || "Login failed"
            )
        }
    }
  return (
   <div className="login-container">
     {/* Left Side */}
      <div className="login-left">
        <div className="login-left-content">
          <h1>Welcome Back!</h1>
          <p>Explore and request your favorite movies</p>
        </div>
      </div>
        {/* Right Side */}
       <div className="login-right">
        <div className="login-card">
          <h4 className="text-center mb-4">User Login</h4>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              className="form-control mb-3"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              className="form-control mb-3"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <button className="btn btn-dark w-100">Login</button>
            <p className="mt-3 text-center">
              Don't have an account?{' '}
              <span
                className="register-link"
                onClick={() => navigate('/register')}
              >
                Register here
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage