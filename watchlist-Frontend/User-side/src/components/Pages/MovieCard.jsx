import React, { useState } from 'react'
import RequestModalPage from './RequestModalPage'
import { FaHeart, FaRegHeart  } from 'react-icons/fa';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { useEffect } from 'react';

function MovieCard({ movie , isLiked = false , userEmail, hideLikeButton = false, refreshLikedList}) {
    const [showModal , setShowModal] = useState(false)
    const [liked , setliked] = useState(isLiked)

    useEffect(() => {
        setliked(isLiked)
    }, [isLiked])

     const handleLikeToggle = async (movieId, liked) => {
    try {
      await api.post(`/users/toggle-like/${movieId}`, {}, { withCredentials: true });
      toast.success(liked ? 'Movie unliked' : 'Movie liked')
      fetchMovies()
    } catch (err) {
      toast.error('Failed to toggle like')
    }
  }

  const handleRequestClick = (movie) => {
    setSelectedMovie(movie)
    setShowModal(true)
  }
  
  return (
    <div className='card h-100 shadow-sm' style={{ maxWidth: '350px', margin: '0 auto', padding: '10px' }}>
        <img src={movie.posterUrl} alt={movie.title} className='card-img-top' style={{   height: '250px',
         width: '100%',
         objectFit: 'contain',  
         padding: '10px',
         borderRadius: '8px'}}  />
        <div className='card-body'>
            <h5 className='card-title mb-3'><strong>Title: </strong>{movie.title}</h5>
            <p className='card-text'><strong>Rating: </strong>{movie.description}</p>
            <p className='card-text'><strong>Genre: </strong> {movie.genre}</p>
            <p className='card-text'><strong>Language: </strong> {movie.language}</p>
            <button className='btn btn-dark' onClick={handleRequestClick}>
                Request
            </button>
           {!hideLikeButton && (
                <button className="btn btn-outline-dark ms-2" onClick={handleLikeToggle}>
                {liked ? <FaHeart color="red" /> : <FaRegHeart />}
            </button>
           )}

        </div>

        {showModal && (<RequestModalPage
                        show={showModal}
                        handleClose={() => setShowModal(false)}
                        movieTitle={movie.title}
                        userEmail={userEmail}
                        />)}
    </div>
  )
}

export default MovieCard