import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'

function RegisterPage() {
    const [formData , setFormData] = useState({ username: '', email:'', password:''})
    const [showOTP, setShowOTP] = useState(false)
    const [userId, setUserId] = useState(null)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post('/auth/register', formData)
            console.log("📨 Registration Response:", res.data);
            console.log("✅ Form Data sent:", formData);
            setUserId(res.data.data.userId)
            setShowOTP(true)
            toast.success('OTP send to email')
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Registration Failed')
            console.error("❌ Registration Error:", error);
        }
    }

const { email, username, password } = formData;

const handleOTPVerify = async(e) => {
    e.preventDefault()
    try {
        const otp = e.target.otp.value
        console.log("🔐 Verifying OTP with:", { email, username, password, otp });
        const res = await api.post('/auth/verify-otp', { email, otp , username , password })
        console.log("✅ OTP Verification Response:", res.data);  
        toast.success('OTP verified')
        navigate('/')
    } catch (error) {
        toast.error('Invalid OTP or expired')
    }
}


  return (
     <div className="register-page">
      <div className="register-card">
        <h3 className="mb-3 text-center">Register</h3>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input type="text" className="form-control" name="username" placeholder="Username" onChange={handleChange} required autoComplete="username" />
          </div>
          <div className="mb-3">
            <input type="email" className="form-control" name="email" placeholder="Email" onChange={handleChange} required autoComplete="email" />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control" name="password" placeholder="Password" onChange={handleChange} required autoComplete="new-password" />
          </div>
          <button className="btn btn-dark w-100">Register</button>
        </form>

        {showOTP && (
          <form onSubmit={handleOTPVerify} className="mt-4">
            <label>Enter OTP sent to your email</label>
            <div className="input-group mb-3 mt-3">
              <input type="text" name="otp" className="form-control me-3" placeholder="6-digit OTP" required />
              <div className='me-3'>
              <button className="btn btn-dark">Verify</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )

}
export default RegisterPage