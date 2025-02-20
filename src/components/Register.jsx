/* TODO - add your code to create a functional React component that renders a registration form */
import { useNavigate } from "react-router-dom"; // 
import { registerUser } from "../api"
import { useState } from "react"
import "../css/Register.css"

export default function Register({ setToken }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [successMessage, setSuccessMessage] = useState(null)

    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        setError(""); // Reset any errors before request
        setSuccessMessage("");

        const APIResponse = await registerUser(firstname, lastname, email, password);

        if (APIResponse.success) {
            setSuccessMessage("Registration successful. Redirecting...");

            // Store token in state and localStorage
            const userToken = APIResponse.response.token;
            setToken(userToken);
            localStorage.setItem("authToken", userToken); 
            localStorage.setItem("firstname", APIResponse.response.user.firstname)
            localStorage.setItem("email", APIResponse.response.user.email)


            // Redirect user to homepage
            setTimeout(() => navigate("/"), 1500);
        } else {
            setError(APIResponse.error);
        }
    }
    return (
        <div className="registerContainer">
            <h2>Register</h2>
            {error && <p className="errorMessage">{error}</p>}
            {successMessage && <p className="successMessage">{successMessage}</p>}
            <form onSubmit={handleRegister}>
                <label>
                    First Name:
                    <input type="text"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Last Name:
                    <input type="text"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password:
                    <input type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Register</button>

            </form>
        </div>
    )
}