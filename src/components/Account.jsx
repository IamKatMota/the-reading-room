/* TODO - add your code to create a functional React component that renders account details for a logged in user. Fetch the account data from the provided API. You may consider conditionally rendering a message for other users that prompts them to log in or create an account.  */
import { useEffect, useState } from "react";
import { updateBookStatus } from "../api"; //function to return books
import "../css/Account.css";

export default function Account() {
    const [firstname, setFirstname] = useState("");
    const [checkedOutBooks, setCheckedOutBooks] = useState([]); //the list of checked-out books (stores in localStorage when checking out)
    const [errorMessage, setErrorMessage] = useState(null);
    const [rentalHistory, setRentalHistory] = useState([]);

    useEffect(() => {
        // get user name and checked out books from localStorage
        const storedFirstname = localStorage.getItem("firstname");
        const storedBooks = JSON.parse(localStorage.getItem("checkedOutBooks")) || []; //Converts the stored string back into an object/array when retrieving it
        const storedHistory = JSON.parse(localStorage.getItem("rentalHistory")) || []; // Retrieve past rentals


        if (storedFirstname) {
            setFirstname(storedFirstname);
            setCheckedOutBooks(storedBooks);
            setRentalHistory(storedHistory);
        }

    }, []);

    async function handleReturnBook(bookId) {
        const token = localStorage.getItem("authToken"); //look in localStorage to see if user has a saved login token

        //send a request to the API asking to update the books status, true means book is now available again
        const APIResponse = await updateBookStatus(bookId, token, true);

        if (APIResponse.success) {
            // Find the returned book
            const returnedBook = checkedOutBooks.find(book => book.id === bookId);
            //remove returned book from list of books in state by keeping all the books except the one with the returned books id 
            const updatedBooks = checkedOutBooks.filter(book => book.id !== bookId);
            setCheckedOutBooks(updatedBooks);
            // Add the book to rental history if it doesn't already exist
            const updatedHistory = [...rentalHistory, returnedBook];
            setRentalHistory(updatedHistory);

            // Update localStorage
            localStorage.setItem("checkedOutBooks", JSON.stringify(updatedBooks));
            localStorage.setItem("rentalHistory", JSON.stringify(updatedHistory));
            setErrorMessage("");
        } else {
            setErrorMessage("Failed to return the book.")
        }
    }

    return (
        <div className="accountContainer">
            <div className="welcome-card">
                <h2>Welcome, {firstname}</h2>
                <p className="welcome-message">Explore your reading history and manage your book checkouts with ease.</p>
            </div>

            <h3>Checked Out Books:</h3>
            {checkedOutBooks.length > 0 ? (
                <ul>
                    {checkedOutBooks.map((book) => (
                        <li key={book.id}>
                            <strong>{book.title}</strong> by {book.author}
                            <button className="return-button" onClick={() => handleReturnBook(book.id)}>Return Book</button>
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

