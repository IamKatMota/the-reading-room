/* TODO - add your code to create a functional React component that displays all of the available books in the library's catalog. Fetch the book data from the provided API. Users should be able to click on an individual book to navigate to the SingleBook component and view its details. */
import { useState, useEffect } from "react";
import { fetchAllBooks } from "../api";
import BookList from "./BookList";
import "../css/Books.css"

export default function AllBooks(){
    const [books, setBooks] = useState([]); //store books from the API
    const [error, setError] = useState(null); //store error messages 
    const [searchParam, setSearchParam] = useState("") //stores what the user types in the search bar 

    //calls fetchAllBooks() and updates the books state with the fetched book data
    useEffect(() => {
        async function getAllBooks() {
            const APIResponse = await fetchAllBooks();
            if (APIResponse.success){
                setBooks(APIResponse.data);
            }else {
                setError(APIResponse.error.message);
            }
        }
        getAllBooks();
    }, [])
//filter list of players before rendering, If searchParam is not empty, the code filters players to show only those whose name includes the search term.If searchParam is empty, it displays all books.

    const booksToDisplay = searchParam ? books.filter((book) => book.title.toLowerCase().includes(searchParam.toLowerCase())) : books;

    return (
        <div className="books-container">
            <label className="search-bar">
                Search:
                <input 
                type="text"
                placeholder="Search for a book"
                onChange={(event) => setSearchParam(event.target.value.toLowerCase())} />
            </label>
            {error && <p className="error-message">{error}</p>}
            <div className="books-list">
                {booksToDisplay.length > 0 ? booksToDisplay.map((book) => {
                    return <BookList key={book.id} book={book} />
                })
                : <p className="no-results">No books match search term.</p>
            }
            </div>
        </div>
    )
}