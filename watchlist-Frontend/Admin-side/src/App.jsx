import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import AdminDashboardPage from './components/Pages/AdminDashboardPage';
import AdminloginPage from './components/Pages/AdminloginPage';
import { ToastContainer } from 'react-toastify';
import ViewRequests from './components/Pages/ViewRequests';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'





function App() {


  return (
    <>
     <ToastContainer postion="top-right" autoClose={3000} />
     <Routes>
      <Route path='/' element={<AdminloginPage/>} />
      <Route path='/admin-dashboard' element={<AdminDashboardPage/>} />
      <Route path='/admin-requests' element={<ViewRequests/>}/>
     </Routes>
    </>
  )
}

export default App
