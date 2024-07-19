import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../actions';
import { emptyCart } from '../actions';
import { toast } from 'react-toastify';
import axios from 'axios';

function Dropdown( {user} ) {
    function handleDropdown() {
        document.getElementById("dropdown").classList.toggle("hidden");
    }
    
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userEmail')
		dispatch(logoutUser());
		dispatch(emptyCart())
        await axios.delete('http://localhost:5000/logout', {
            data: {
                refreshToken: refreshToken
            }
        })
		toast.success("Logged out")
		navigate('/')
	}

  return (
    <div className='relative'>
        <div className="mx-6 cursor-pointer relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600" onClick={handleDropdown}>
            <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
            </svg>
        </div>
        <ul id="dropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-36 dark:bg-gray-700 dark:divide-gray-600 absolute">
            <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                <div className="font-medium truncate">{user}</div>
            </div>
            <li className="cursor-pointer px-4 py-2 hover:bg-gray-100 rounded-b-lg" onClick={handleLogout}>Log Out</li>
        </ul>
    </div>
  )
}

export default Dropdown