import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import MovieListPage from './components/Pages/MovieListPage.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import LoginPage from './components/Pages/LoginPage.jsx';
import RegisterPage from './components/Pages/RegisterPage.jsx';
import UserProfile from './components/Pages/UserProfile.jsx';
import LikedMoviesPage from './components/Pages/LikedMoviesPage.jsx';



function App() {


  return (
    <>
     <ToastContainer postion="top-right" autoClose={3000} />
     <Routes>
      <Route path='/' element={<LoginPage/>} />
      <Route path='/movies' element={<MovieListPage/>} />
      <Route path='/user-profile' element={<UserProfile/>} />
      <Route path='/register' element={<RegisterPage/>} />
      <Route path='/likedMovies' element={<LikedMoviesPage/>} />
     </Routes>
    </>
  )
}

export default App
