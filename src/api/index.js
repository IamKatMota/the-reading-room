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

export async function updateBookStatus(bookId, token, available) {
    try {
        const promise = await fetch(`${API_URL}/books/${bookId}`, {
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
export async function fetchUserData(token) {
    try {
        const response = await fetch(`${API_URL}/users/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch user data.");
        }
        return { success: true, data };
    } catch (error) {
        console.error("Error fetching user data:", error);
        return { success: false, error: error.message };
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
        if (!promise.ok){
            throw new Error(response.message || response.error|| "Registration Failed.")
        }
        return {success: true, response}
    }catch(error){
        console.error("Registration failed:", error.message)
        return {success: false, error: error.message}
    }
}

export async function getUserData(authToken, setUser, setToken) {
    const APIResponse = await fetchUserData(authToken);
    if (APIResponse.success) {
        setUser(APIResponse.data);
    } else {
        console.error("Error fetching user:", APIResponse.error);
        setToken(null);
        localStorage.removeItem("authToken");
    }
}
export async function createReservation(bookId, token) {
    try {
        const response = await fetch(`${API_URL}/reservations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ bookId })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Failed to create reservation.");
        }
        return { success: true, data };
    } catch (error) {
        console.error("Error creating reservation:", error);
        return { success: false, error: error.message };
    }
}
export async function deleteReservation(reservationId, token) {
    try {
        const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Failed to delete reservation.");
        }
        return { success: true, data };
    } catch (error) {
        console.error("Error deleting reservation:", error);
        return { success: false, error: error.message };
    }
}
