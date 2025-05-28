import React, { useContext } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Saarthi from './pages/Saarthi';
import { AuthContext } from '../context/AuthContext';

const App = () => {
  const {authUser}= useContext(AuthContext)
  return (
    <>
      <div className="bg-[url('./src/assets/background.svg')] bg-contain">
         <Toaster/>
        <Routes>
          <Route path="/" element={authUser ? <HomePage />:<Navigate to={"/login"}/>} />
          <Route path="/login" element={!authUser ? <LoginPage />:<Navigate to={"/"}/>} />
          <Route path="/profile" element={authUser ? <ProfilePage />:<Navigate to={"/login"}/>} />
          <Route path="/saarthi" element={authUser ? <Saarthi />:<Navigate to={"/login"}/>}/>

        </Routes>
      </div>
    </>
  );
};

export default App;
