import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar.jsx'

function ViewRequests() {
    const [requests, setRequests] = useState([])
    const [showModal , setShowModal] = useState(false)
    const [selectedId, setSelectedId] = useState(null)

    const openModal = (id) => {
            setSelectedId(id)
            setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedId(null)
    }

    const fetchRequests = async () => {
        try {
            const res = await api.get('/requests/all')
            setRequests(res.data.data.requests)
        } catch (error) {
            console.error('Error fetching requests', error);
        }
    }

    const confirmDelete = async (id) => {
            try {
                await api.delete(`/requests/delete/${selectedId}`)
                toast.success('request deleted')
                setRequests((prev) => prev.filter((req) => req._id !== selectedId))
                setShowModal(false)
            } catch (error) {
                console.error('Error', error);
                toast.error("failed ro delete")
                setShowModal(false)
            }
    }

    useEffect(() => {
        const interval = setInterval(fetchRequests, 1000);

        return () => clearInterval(interval)
    } , [])

    
  return (
    <>
    <AdminNavbar/>
    <div className='container mt-5 '>
        <h2>User Requests</h2>

         <div className="table-responsive">
        
            {/* If no requests */}
            {requests.length === 0 ? (
                <div className='text-center text-muted mt-4'>No requests yet.</div>
            ) : (
                <table className='table table-striped table-hover align-middle text-center mt-3'>
                    <thead className='table-dark'>
                        <tr>
                            <th>User Email</th>
                            <th>Movie Title</th>
                            <th>Requested Data Size</th>
                            <th>Requested At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req._id}>
                                <td>{req.userEmail}</td>
                                <td>{req.movieTitle}</td>
                                <td>{req.dataSize}</td>
                                <td>{new Date(req.createdAt).toLocaleString()}</td>
                                <td>
                                    <button className='btn btn-sm btn-danger' onClick={() => openModal(req._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            </div>


        {showModal && (
            <div className='modal show d-block' tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)'}}>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>Confirm Deletion</h5>
                            <button type='button' className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <div className='modal-body'>
                            <p>Are you sure you want to delete this request?</p>
                        </div>
                        <div className='modal-footer'>
                             <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                             <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
    </>
  )
}

export default ViewRequests