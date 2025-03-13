import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import Books from './components/Books'
import SingleBook from './components/SingleBook'
import Account from './components/Account'
import Register from './components/Register'
import Navigations from './components/Navigations'
import LoginModal from './components/LoginModal'
import { fetchUserData } from "./api"; 


function App() {
  const [token, setToken] = useState(localStorage.getItem("authToken") || null); // Set initial token from storage  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null); // Store logged-in user data


  useEffect(() => {
    if (token) {
        getUserData(token);
    } else {
        setUser(null);
    }
}, [token]);

async function getUserData(authToken) {
    const APIResponse = await fetchUserData(authToken);
    if (APIResponse.success) {
        setUser({ ...APIResponse.data });  // Force React to detect the update
    } else {
        console.error("Error fetching user:", APIResponse.error);
    }
}

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
            element={token ? <Account setToken={setToken} token={token} user={user}/> : <Navigate to="/"/>}
          />
          <Route
            path='/register'
            element={<Register setToken={setToken} token={token}/>}
            />
      </Routes>
          {/**Render the modal if open */}
      {isLoginOpen && <LoginModal setIsLoginOpen={setIsLoginOpen} setToken={setToken} setUser={setUser} />}

    </>
  )
}

export default App
