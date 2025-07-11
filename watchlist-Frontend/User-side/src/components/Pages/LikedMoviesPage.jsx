import React from 'react'
import { useState } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import Navbar from './Navbar.jsx'
import { FaHeart } from 'react-icons/fa'
import RequestModalPage from './RequestModalPage'
import MovieDropdownFilter from './MovieDropdownFilter.jsx'


function LikedMoviesPage() {
    const [likedMovies , setLikedMovies] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [filteredLikedMovies, setFilteredLikedMovies] = useState([])
    const [filterGenre, setFilterGenre] = useState('')
    const [filterLanguage, setFilterLanguage] = useState('')
    const [requestedMovies, setRequestedMovies] = useState([])



    const userEmail = localStorage.getItem('userEmail')
    
    const fetchLikedMovies = async () => {
        try {
            // console.log("⏳ Fetching liked movies...");
            const res = await api.get('/users/liked-movies', { withCredentials: true})
            // console.log("✅ Fetched liked movies:", res.data);
            setLikedMovies(res.data.data)    
        } catch (error) {
            toast.error("Failed to fetch data")
        }
    }

  const fetchUserRequests = async () => {
  try {
    const res = await api.get(`/requests/user/${userEmail}`)
    const requestedTitles = res.data.data.requests.map(r => r.movieTitle)
    setRequestedMovies(requestedTitles)
  } catch (err) {
    console.error("Failed to fetch user requests", err)
  }
}


    const handleRequestClick = (movie) => {
    setSelectedMovie(movie)
    setShowModal(true)
    setRequestedMovies(prev => [...prev, movie.title])
    }

  useEffect(() => {
    if (!likedMovies) return;
    const filtered = likedMovies.filter(movie =>
      (!filterGenre || movie.genre === filterGenre) &&
      (!filterLanguage || movie.language === filterLanguage)
    )
    setFilteredLikedMovies(filtered)
  }, [filterGenre, filterLanguage, likedMovies])

    useEffect(() => {
        fetchLikedMovies()
        fetchUserRequests()
        const interval = setInterval(fetchUserRequests, 3000)
        return () => clearInterval(interval)
    }, [])

  const handleUnlike = async (movieId) => {
    try {
      await api.post(`/users/toggle-like/${movieId}`, {}, { withCredentials: true })
      toast.success("Movie unliked")
      fetchLikedMovies()
    } catch (error) {
      toast.error("Failed to unlike movie")
    }
  }

  const genres = likedMovies ?  [...new Set(likedMovies.map(m => m.genre))] : []
  const languages = likedMovies ? [...new Set(likedMovies.map(m => m.language))] : []

  const handleFilterChange = (type, value) => {
    if (type === 'genre') setFilterGenre(value)
    if (type === 'language') setFilterLanguage(value)

  }

  if (!likedMovies) {
    return (
      <>
        <Navbar />
        <p className='text-center text-black mt-5'>Loading your liked movies...</p>
      </>
    )
  }



if (likedMovies.length === 0) {
    return (
      <>
        <Navbar />
        <p className='text-center text-black mt-5'>You haven't liked any movies yet.</p>
      </>
    );
}
 
   return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h3 className="text-start text-dark mb-4">Your Liked Movies</h3>

        <MovieDropdownFilter
          genres={genres}
          languages={languages}
          selectedGenre={filterGenre}
          selectedLanguage={filterLanguage}
          onFilterChange={handleFilterChange}
        />

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Poster</th>
                <th>Title</th>
                <th>Description</th>
                <th>Genre</th>
                <th>Language</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLikedMovies.map(movie => (
                <tr key={movie._id}>
                  <td>
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      style={{ height: '120px', width: '90px', objectFit: 'contain', borderRadius: '8px' }}
                    />
                  </td>
                  <td>{movie.title}</td>
                  <td>{movie.description?.substring(0, 80)}...</td>
                  <td>{movie.genre}</td>
                  <td>{movie.language}</td>
                  <td>
                    {!requestedMovies.includes(movie.title) && (<button className="btn btn-sm btn-dark me-2" onClick={() => handleRequestClick(movie)}>
                      Request
                    </button>)}  
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleUnlike(movie._id)}>
                      <FaHeart color="red" /> Unlike
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && selectedMovie && (
          <RequestModalPage
            show={showModal}
            handleClose={() => setShowModal(false)}
            movieTitle={selectedMovie.title}
            userEmail={userEmail}
          />
        )}
      </div>
    </>
  )
}

export default LikedMoviesPage