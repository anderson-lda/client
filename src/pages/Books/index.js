import React, {useState, useEffect } from "react";
import './styles.css';
import logoImage from '../../assets/logo.svg'
import { Link, useNavigate } from "react-router-dom";
import { FiPower, FiEdit, FiTrash2 } from "react-icons/fi";
import  api from '../../services/api';

export default function Books(){
    const [books,setBooks] = useState([]);
    const userName = localStorage.getItem('userName');
    const accessToken = localStorage.getItem('accessToken');

    const navigate = useNavigate();

    useEffect(()=>{
        api.get('api/Book/v1/asc/10/1',{
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response=>{
            setBooks(response.data.list)
        });
    },[accessToken]);//accessToken é o monitorado, entao sempre que ele mudar outro get é feito

    async function deleteBook(id){
        try{
            await api.delete(`api/Book/v1/${id}`,{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setBooks(books.filter(book=>book.id !== id));
        }catch(err){
            alert('Delete failed');
        }
    }

    async function logout(){
        try{
            await api.get('api/auth/v1/revoke',{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            localStorage.clear();
            navigate('/');
        }catch(err){
            alert('Logout failed');
        }
    }

    return(
        <div className="book-container">
            <header>
                <img src={logoImage} alt="Erudio"/>
                <span>Welcome, <strong>{userName.toUpperCase()}</strong>!</span>
                <Link className="button" to="/book/new">Add new book</Link>
                <button onClick={logout} type="button">
                    <FiPower size={18} color="#251FC5"/>
                </button>
            </header>
            <h1>Registered books</h1>
            <ul>
                {books.map(book => (
                    <li key={book.id}>
                        <strong>Title:</strong>
                        <p>{book.title}</p>
                        <strong>Author:</strong>
                        <p>{book.author}</p>
                        <strong>Price:</strong>
                        <p>{Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(book.price)}</p>
                        <strong>Release Date:</strong>
                        <p>{Intl.DateTimeFormat('pt-BR').format(new Date(book.launch_date))}</p>
                        <button type="button">
                            <FiEdit size={20} color="#251FC5"/>
                        </button>
                        <button onClick={()=>deleteBook(book.id)} type="button">
                            <FiTrash2 size={20} color="#251FC5"/>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
