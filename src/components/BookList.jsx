import { Link } from "react-router-dom";
import "../css/BooksList.css"

export default function BookList({ book }) {
    const defaultBookCover = "https://images.pexels.com/photos/7034646/pexels-photo-7034646.jpeg"
    return (
        <div className="book-card">
            <h3 className="book-title">{book.title}</h3>
            <img  className="book-cover" src={book.coverimage || defaultBookCover}  alt={book.title} onError={(e) => e.target.src = defaultBookCover}/>
            <Link to={`/books/${book.id}`} className="details-button">
                See Details
            </Link>

        </div>
    )
}