import React, { useState } from 'react'
import api from '../services/api'
import { Modal , Button , Form } from 'react-bootstrap'
import { toast } from 'react-toastify'

function RequestModalPage( {show, handleClose , movieTitle , userEmail}) {
    console.log(userEmail);
    
    const [size , setSize] = useState('')

    const handleRequest = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post('/requests/create', {
                userEmail,
                movieTitle,
                dataSize: size
            })
            toast.success("request sent successfully")
            handleClose()
        } catch (error) {
            toast.error("Failed to send request")
        }
    }

  return (
    <>
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Request Movie Data</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleRequest}>
                <Modal.Body>
                    <p><strong>Movie: </strong> {movieTitle} </p>
                    <Form.Group controlId = "sizeInput">
                        <Form.Label>Enter Size (eg:, 720p - 1GB etc...)</Form.Label>
                        <Form.Control
                        type="text"
                        value={size}
                        onChange = {(e) => setSize(e.target.value)}
                        required
                        placeholder = "Example: 1080p , 1.5GB"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="primary" type="submit">Request</Button>
                </Modal.Footer>
            </Form>
        </Modal>
        </>
  )
}

export default RequestModalPage