import React, { useEffect, useState } from 'react'
import api from '../services/api'
import Navbar from './Navbar.jsx'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { toast } from 'react-toastify'
import RequestModalPage from './RequestModalPage.jsx'
import MovieDropdownFilter from './MovieDropdownFilter.jsx'

function MovieListPage() {
    const [movies , setMovies] = useState([])
    const [filteredMovies, setFilteredMovies] = useState([])
    const [filterGenre, setFilterGenre] = useState('')
    const [filterLanguage, setFilterLanguage] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [requestedMovies , setRequestedMovies] = useState([]) 
    
    const userEmail = localStorage.getItem('userEmail')

    const fetchMovies = async () => {
        try{
            const movieRes = await api.get('/movies/all')
            const likedRes = await api.get('/users/liked-movies', { withCredentials: true})
            const requestRes = await api.get(`/requests/user/${userEmail}`);
            
            const likedMoviesIds = likedRes.data.data.map(m => m._id)
            const requestedTitles = requestRes.data.data.requests.map(r => r.movieTitle)

            const updatedMovies = movieRes.data.data.movies.map(movie => ({
              ...movie,
              isLiked: likedMoviesIds.includes(movie._id),
              isRequested: requestedTitles.includes(movie.title)
            }))

            setRequestedMovies(requestedTitles)
            setMovies(updatedMovies)
            setFilteredMovies(updatedMovies)
        }
        catch(err)
        {
            console.error('Error fetching movies', err);
        }
    }

    useEffect(() => {
        fetchMovies()

        const interval = setInterval(fetchMovies, 3000)

        return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const filtered = movies.filter(
      m =>
        (!filterGenre || m.genre === filterGenre) &&
        (!filterLanguage || m.language === filterLanguage)
    )
    setFilteredMovies(filtered)
  }, [filterGenre, filterLanguage, movies])


const handleLikeToggle = async (movieId, liked) => {
    try {
      await api.post(`/users/toggle-like/${movieId}`, {}, { withCredentials: true });
      toast.success(liked ? 'Movie unliked' : 'Movie liked')
      fetchMovies()
    } catch (err) {
      toast.error('Failed to toggle like')
    }
  }

const handleRequestClick = movie => {
    setSelectedMovie(movie)
    setShowModal(true)
    setRequestedMovies(prev => [...prev, movie.title])
  }

  const genres = [...new Set(movies.map(m => m.genre))]
  const languages = [...new Set(movies.map(m => m.language))]

  const handleFilterChange = (type, value) => {
    if (type === 'genre') setFilterGenre(value)
    if (type === 'language') setFilterLanguage(value)
  }

 return (
    <>
      <Navbar />
      <div className='container mt-4'>
        <h2 className='mb-4'>All Movies</h2>

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
                <th>Ratings</th>
                <th>Genre</th>
                <th>Language</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovies.map(movie => (
                <tr key={movie._id}>
                  <td>
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      style={{ height: '120px', width: '90px', objectFit: 'contain', borderRadius: '8px' }}
                    />
                  </td>
                  <td>{movie.title}</td>
                  <td>{movie.description}</td>
                  <td>{movie.genre}</td>
                  <td>{movie.language}</td>
                  <td>
                    {!requestedMovies.includes(movie.title) && (<button className="btn btn-sm btn-dark me-2" onClick={() => handleRequestClick(movie)}>
                      Request
                    </button>
                  )}
                    <button className="btn btn-sm btn-outline-dark" onClick={() => handleLikeToggle(movie._id, movie.isLiked)}>
                      {movie.isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
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


export default MovieListPage