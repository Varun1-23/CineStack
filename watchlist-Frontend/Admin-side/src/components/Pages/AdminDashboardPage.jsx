import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import api from '../services/api';
import AdminNavbar from './AdminNavbar.jsx'
import MovieDropdownFilter from './MovieDropdownFilter.jsx';

function AdminDashboardPage() {
const [form , setForm] = useState({ title: "", description: "", genre: "", language: "", poster: null, _id: null });
const [movies , setMovies] = useState([]);
const [filteredMovies, setFilteredMovies] = useState([])
const [filterGenre, setFilterGenre] = useState('')
const [filterLanguage, setFilterLanguage] = useState('')

const fetchMovies = async () => {
  try {
     const res = await api.get('/movies/all')
     setMovies(res.data.data.movies)
  } catch (error) {
    toast.error('failed to fetch movies')
  }
}

useEffect(() => {
  fetchMovies()
}, [])

useEffect(() => {
  const filtered = movies.filter(movie => 
  (!filterGenre || movie.genre === filterGenre) && (
  !filterLanguage || movie.language === filterLanguage)
  )
    setFilteredMovies(filtered);
} , [filterGenre, filterLanguage, movies])

const handleFilterChange = (type , value) => {
  if(type === 'genre') setFilterGenre(value)
    if(type === 'language') setFilterLanguage(value)
}

const handleChange = (e) => {
    if(e.target.name === 'poster'){
        setForm({...form, poster: e.target.files[0]})
    }
    else{
        setForm({...form, [e.target.name]: e.target.value})
    }
}

const handleSubmit = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key , value]) => { formData.append(key, value)})


    try {
      if(form._id){
        await api.put(`/movies/${form._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Movie Updated')
      }else{
        await api.post('/movies/add', formData , {Headers: {'Content-Type': 'multipart/form-data'}})
        toast.success('Movie added')
      }
      setForm({ title: "", description: "", genre: "", language: '', poster: null, _id: null })
      document.getElementById("posterInput").value = "";
      fetchMovies()
    } catch (error) {
        toast.error('Failed to upload')
    }
  }

  const handleEdit = (movie) => {
    setForm({
      title: movie.title,
      description: movie.description,
      genre: movie.genre,
      language: movie.language,
      poster: null,
      _id: movie._id
    })
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  const genres = [...new Set(movies.map((m) => m.genre))];
  const languages = [...new Set(movies.map((m) => m.language))];

  
  const handleDelete = async (movieId) => {
    try {
      await api.delete(`/movies/${movieId}`)
      toast.success('Movie deleted')
      fetchMovies()
    } catch (error) {
      toast.error('Failed to delete movie')
    }
  }


 return (
    <>
      <AdminNavbar />
      <div className='container mt-4'>
        <div className='mb-3'><h2>Upload Movie</h2></div>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Title" className="form-control mb-2" value={form.title} onChange={handleChange} />
          <textarea name="description" placeholder="Rating" className="form-control mb-2" value={form.description} onChange={handleChange}></textarea>
          <input type="text" name="genre" placeholder="Genre" className="form-control mb-2" value={form.genre} onChange={handleChange} />
          <input type="text" name="language" placeholder="Language" className="form-control mb-2" value={form.language} onChange={handleChange} />
          <input type="file" id="posterInput" name="poster" className="form-control mb-2" onChange={handleChange} />
          <button type="submit" className="btn btn-dark mt-2">{form._id ? 'Update' : 'Upload'}</button>
        </form>

        <hr className="my-4" />

        <MovieDropdownFilter
          genres={genres}
          languages={languages}
          selectedGenre={filterGenre}
          selectedLanguage={filterLanguage}
          onFilterChange={handleFilterChange}
        />

        <div className='mb-3'><h3>Uploaded Movies</h3></div>

        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle text-center">
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
              {filteredMovies.map(movie => (
                <tr key={movie._id}>
                  <td>
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      style={{ height: '100px', width: '80px', objectFit: 'contain', borderRadius: '5px' }}
                    />
                  </td>
                  <td>{movie.title}</td>
                  <td>{movie.description}</td>
                  <td>{movie.genre}</td>
                  <td>{movie.language}</td>
                  <td>
                    <button className='btn btn-sm btn-secondary me-2' onClick={() => handleEdit(movie)}>Edit</button>
                    <button className='btn btn-sm btn-danger' onClick={() => handleDelete(movie._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {movies.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted">No movies uploaded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}


export default AdminDashboardPage