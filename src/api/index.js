const API_URL = "https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api"

export async function fetchAllBooks() {
    try {
        const promise = await fetch(`${API_URL}/books`);
        const response = await promise.json();
        if (!promise.ok) {
            throw new Error(response.error || "Failed to fetch books")
        }
        return { success: true, data: response.books };
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

export async function fetchSingleBook(id) {
    try {
        const promise = await fetch(`${API_URL}/books/${id}`);
        const response = await promise.json();
        if (!promise.ok) {
            throw new Error(response.error || "Failed to fetch book")
        }
        return { success: true, data: response.book };
    } catch (error) {
        console.error("Error fetching book:", error);
    }
}

export async function updateBookStatus(id, token, available) {
    try {
        const promise = await fetch(`${API_URL}/books/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` //pass token for authentication
            },
            body: JSON.stringify({ available }) //send the new availability status
        })
        const response = await promise.json();
        if (!promise.ok){
            throw new Error(response.error || "Failed to update book status.")
        }
        return {success: true, response}

    } catch (error) {
        console.error("Error updating book status:", error);
        return {success: true, error: error.message}
    }
}

export async function loginUser(email, password) {
    try {
        const promise = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            //tells what data to send, in this case we are sending username and password (values comes from setUsername and setPassword)
            body: JSON.stringify({
                email,
                password,
            }),
        })
        const response = await promise.json()
        if (!promise.ok) {
            throw new Error(response.error || "Login failed, please try again.")
        }
        return {success:true, data: response}
    }catch (error){
        console.error("Error logging in:", error)
        return {success: false, error: error.message}
    }
}

export async function registerUser(firstname, lastname, email, password) {
    try{

        const promise = await fetch (`${API_URL}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstname,
                lastname,
                email,
                password,
            })
        })
        const response = await promise.json()
        console.log("Server Response:", response);
        if (!promise.ok){
            throw new Error(response.message || response.error|| "Registration Failed.")
        }
        return {success: true, response}
    }catch(error){
        console.error("Registration failed:", error.message)
        return {success: false, error: error.message}
    }
}
