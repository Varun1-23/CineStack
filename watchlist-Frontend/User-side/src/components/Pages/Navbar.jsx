import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { toast } from 'react-toastify'



function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()



    const handleLogout = async () => {
        try {
        await api.post('/users/logout')
        toast.success('Logged Out')
        localStorage.clear()
        navigate('/')
    } catch (error) {
            toast.error('Logout Failed')
        }
    }

   const isActive = (path) => location.pathname === path


  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <div className="container d-flex justify-content-between align-items-center">
      <span className="navbar-brand">🎬 Movie Panel</span>
      <div className=" d-flex align-items-center gap-2 ">
        <button className={`btn ${isActive('/movies') ? 'btn-secondary' : 'btn-outline-light'} `}  onClick={() => navigate('/movies')}>Home</button>   
        <button className={`btn ${isActive('/likedMovies') ? 'btn-secondary' : 'btn-outline-light'} `}  onClick={() => navigate('/likedMovies')}>Watchlist</button>   
        <button className={`btn ${isActive('/user-profile') ? 'btn-secondary' : 'btn-outline-light'} `}  onClick={() => navigate('/user-profile')}>Profile</button>   
        <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
      </div>
      </div>
    </nav>
  )
}

export default Navbar