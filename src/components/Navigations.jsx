/* TODO - add your code to create a functional React component that renders a navigation bar for the different views in your single page application. You may consider conditionally rendering some options - for example 'Login' should be available if someone has not logged in yet. */
import { Link, useNavigate } from 'react-router-dom'
import LoginModal from './LoginModal';
import { useState } from 'react';
import "../css/Navigations.css"
export default function Navigations({ token, setToken }) {
    const navigate = useNavigate();
    const [isLoginOpen, setIsLoginOpen] = useState(false); // Track if login modal is open


    async function handleLogout() {
        setToken(null);
        localStorage.removeItem("authToken"); // Remove token from local storage
        navigate("/"); //redirect user to homepage after logout
    }

    return (
        <>
            <nav className='navbar'>
                <ul className='navLinks'>
                    <li>
                        <Link to={"/"}>Home</Link>
                    </li>
                    {!token ? (
                        <>
                            <li>
                                {/* Open login modal instead of navigating */}
                                <button className="loginButton" onClick={() => setIsLoginOpen(true)}>Login</button>
                            </li>
                            <li>
                                <Link to={"/register"} className='registerButton'>Register</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to={"/account"} className='accountButton'>My Account</Link>
                            </li>
                            <li>
                                <button className='logoutButton' onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
            {/* Show Login Modal if isLoginOpen is true */}
            {isLoginOpen && <LoginModal setIsLoginOpen={setIsLoginOpen} setToken={setToken} />}</>
    )
}