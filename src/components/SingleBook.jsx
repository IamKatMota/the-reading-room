/* TODO - add your code to create a functional React component that renders details for a single book. Fetch the book data from the provided API. You may consider conditionally rendering a 'Checkout' button for logged in users. */
import {useEffect, useState} from "react";
import { fetchSingleBook, updateBookStatus, createReservation } from "../api";
import {useParams, Link} from "react-router-dom";
import "../css/SingleBook.css";

export default function SingleBook({ token }){
    const {id} = useParams();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutError, setCheckoutError] = useState("");
    const defaultBookCover = "https://images.pexels.com/photos/7034646/pexels-photo-7034646.jpeg"

    useEffect(() => {
        async function getSingleBook(){
            const APIResponse = await fetchSingleBook(id);
            if (APIResponse.success){
                setBook(APIResponse.data) //stores book details
            }else {
                setError(APIResponse.error.message);
            }
        }
        getSingleBook();
    }, [id]) //runs when id changes

    async function handleCheckout() {
        if (!token) {
            setCheckoutError("You must be logged in to check out a book.");
            return;
        }
        setIsCheckingOut(true);
        setCheckoutError("");
    
        // Step 1: Create a reservation
        const reservationResponse = await createReservation(id, token);
        if (!reservationResponse.success) {
            setCheckoutError(reservationResponse.error || "Failed to create reservation.");
            setIsCheckingOut(false);
            return;
        }
    
        // Step 2: Update book status (optional)
        const bookResponse = await updateBookStatus(id, token, false);
        if (!bookResponse.success) {
            setCheckoutError(bookResponse.error || "Failed to update book status.");
            setIsCheckingOut(false);
            return;
        }
    
        // Step 3: Update UI
        setBook((prevBook) => ({ ...prevBook, available: false }));
    
        alert("Book checked out successfully!");
        setIsCheckingOut(false);
    }
    

    return (
        <div className="single-book-container">
            {error && <p className="checkout-error">{error}</p>}
            {book && (
                <div>
                    <Link to="/" className="back-button">Back to All Books</Link>
                    <figure>
                        <img className="book-image" src={book.coverimage} alt={book.title} onError={(e) => e.target.src = defaultBookCover} />
                    </figure>
                    <figcaption className="book-details">
                        <h3>Book Details</h3>
                        <p>{book.title}</p>
                        <p>Author: {book.author}</p>
                        <p>Description: {book.description}</p>
                        <p>Availability: {book.available ? "Available for Checkout" : "Currently Unavailable"}</p>
                    </figcaption>

                    {/* Show checkout button only if book is available */}
                    {book.available && (
                        <div>
                            <button className="checkout-button" onClick={handleCheckout} disabled={isCheckingOut}>{isCheckingOut ? "Checking Out..." : "Check Out"}</button>
                            {checkoutError && <p className="checkout-error">{checkoutError}</p>} {/*  Show error */}

                        </div>

                    )}
                </div>
            )}
        </div>
    )
}