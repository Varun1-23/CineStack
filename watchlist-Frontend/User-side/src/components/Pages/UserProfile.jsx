import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import api from '../services/api'
import Navbar from './Navbar.jsx'


function UserProfile() {
    const[user, setUser] = useState(null)

    const fetchprofile = async () => {
        try {
            const res = await api.get('/users/profile', { withCredentials: true })
            setUser(res.data.data.user)
        } catch (error) {
            toast.error('failed to fetch profile')
        }
    }

    useEffect(()=>{
        fetchprofile()
    }, [])

    if(!user)
        return <p className='text-center'>Loading profile...</p>
  return (
    <>
    <Navbar/>
    <div className="container mt-5">
      <div className="card p-4 shadow" style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: '#1e1e1e', color: '#fff' }}>
        <h3 className="text-center mb-4">👤 User Profile</h3>
        <p><strong>Username:</strong> {user.username || 'N/A'}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Total Liked Movies:</strong> {user.likedMovies?.length || 0}</p>
      </div>
    </div>
    </>
  )
}

export default UserProfile