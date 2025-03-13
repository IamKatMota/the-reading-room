/* TODO - add your code to create a functional React component that renders account details for a logged in user. Fetch the account data from the provided API. You may consider conditionally rendering a message for other users that prompts them to log in or create an account.  */
import { useEffect, useState } from "react";
import { updateBookStatus, deleteReservation } from "../api"; //function to return books
import "../css/Account.css";

export default function Account({user}) {
    const [checkedOutBooks, setCheckedOutBooks] = useState([]); //the list of checked-out books (stores in localStorage when checking out)
    const [errorMessage, setErrorMessage] = useState(null);
    const [rentalHistory, setRentalHistory] = useState([]);

    // Update state when `user` prop changes
   useEffect(() => {
    if (user === null) {
        console.log("⏳ Waiting for user data...");
        return;  // Prevent running the effect until `user` is available
    }

    if (user && Array.isArray(user.books)) {
        setCheckedOutBooks([...user.books]);
    } else {
        console.log("🚨 No books found for user.");
    }
}, [user]);

    async function handleReturnBook(reservationId, bookId) {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setErrorMessage("You must be logged in to return a book.");
            return;
        }
    
        // Step 1: Delete the reservation
        const APIResponse = await deleteReservation(reservationId, token);
        if (APIResponse.success) {
            const returnedBook = checkedOutBooks.find(book => book.reservationId === reservationId);
            const updatedBooks = checkedOutBooks.filter(book => book.reservationId !== reservationId);
            setCheckedOutBooks(updatedBooks);
    
            if (returnedBook) {
                setRentalHistory([...rentalHistory, returnedBook]);
    
                // Step 2: Mark book as available
                const updateResponse = await updateBookStatus(bookId, token, true);
                if (!updateResponse.success) {
                    setErrorMessage("Reservation deleted, but book status update failed.");
                }
            }
    
            setErrorMessage("");
        } else {
            setErrorMessage("Failed to return the book.");
        }
    }

    return (
        <div className="accountContainer">
            <div className="welcome-card">
                <h2>Welcome, {user?.firstname || "Reader"}</h2>
                <p className="welcome-message">Explore your reading history and manage your book checkouts with ease.</p>
            </div>

            <h3>Checked Out Books:</h3>
            {checkedOutBooks && checkedOutBooks.length > 0 ? (
                <ul>
                    {checkedOutBooks.map((book) => (
                        <li key={book.reservationId || book.id}>
                            <strong>{book.title}</strong> by {book.author}
                            <button className="return-button" onClick={() => handleReturnBook(book.reservationId, book.id)}>Return Book</button>
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You currently have no checked-out books. Time to borrow some! 📖</p>
            )}
            {/* Rental History Section */}
            <div className="history-section">
                <h2 className="section-title">Previously Borrowed Books 📜</h2>
                {rentalHistory.length > 0 ? (
                    <ul className="book-list">
                        {rentalHistory.map((book) => (
                            <li key={book.id} className="book-item history">
                                <img src={book.coverimage} alt={book.title} className="book-cover" />
                                <div className="book-info">
                                    <h3 className="book-title">{book.title}</h3>
                                    <p className="book-author">by {book.author}</p>
                                    <p className="history-tag">Returned ✔</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="empty-message">You haven’t returned any books yet.</p>
                )}
            </div>

        </div>
    )
}

