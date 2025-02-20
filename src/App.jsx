import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import Books from './components/Books'
import SingleBook from './components/SingleBook'
import Account from './components/Account'
import Register from './components/Register'
import Navigations from './components/Navigations'
import LoginModal from './components/LoginModal'

function App() {
  const [token, setToken] = useState(localStorage.getItem("authToken") || null); // Set initial token from storage  
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // When token changes, update localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token); // Save token
    } else {
      localStorage.removeItem("authToken"); // Clear if logged out
    }
  }, [token]);

  return (
    <>
      <Navigations token={token} setToken={setToken} setIsLoginOpen={setIsLoginOpen}/>
      <h1>The Reading Room</h1>

      <Routes>
          <Route 
            path='/' 
            element={<Books />} 
          />
          <Route 
            path='/books/:id' 
            element={<SingleBook token={token}/>} 
          />
          <Route 
            path='/account' 
            element={token ? <Account setToken={setToken} token={token}/> : <Navigate to="/"/>}
          />
          <Route
            path='/register'
            element={<Register setToken={setToken} token={token}/>}
            />
      </Routes>
          {/**Render the modal if open */}
      {isLoginOpen && <LoginModal setIsLoginOpen={setIsLoginOpen} setToken={setToken} />}

    </>
  )
}

export default App
