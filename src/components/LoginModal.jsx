/* TODO - add your code to create a functional React component that renders a login form */
import { useState } from "react";
import { loginUser } from "../api"; //import function from API utility
import "../css/Login.css"

export default function LoginModal({ setIsLoginOpen, setToken}){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    async function handleLogin(event){
        event.preventDefault()

        const APIResponse = await loginUser(email,password)
        if (APIResponse.success){
            setToken(APIResponse.data.token) //store token
            setIsLoginOpen(false) //close modal
        }else {
            setError(APIResponse.error)
        }
    }
    return (
        <div className="modalOverlay">

        <div className="modal">
                <button className="closeButton" onClick={()=> setIsLoginOpen(false)}>
                ✖
            </button>
            <h2>Login</h2>
            {error && <p className="errorMessage">{error}</p>}
            <form onSubmit={handleLogin}>
                <label>
                    Email:
                    <input 
                    type="email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    required 
                    />
                </label>
                <label>
                    Password:
                    <input 
                    type="password"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    required 
                    />
                </label>
                <button type="submit" className="loginButton">Login</button>
            </form>
        </div>
        </div>
    )
}