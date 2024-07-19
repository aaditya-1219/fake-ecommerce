import React, { useState, useRef } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { emptyCart, loginUser, setCart } from '../actions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Login() {
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const [hasAccount, setHasAccount] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    function handleLogin(e){
        e.preventDefault();
        const userEmail = emailRef.current.value
        const userPassword = passwordRef.current.value
        const formDetails = {email: userEmail, password: userPassword};
        let endpoint = (hasAccount ? "login" : "signup");
        axios.post(`http://localhost:5000/${endpoint}`, formDetails)
        .then((response) => {
            localStorage.setItem('accessToken', response.data.accessToken)
            localStorage.setItem('refreshToken', response.data.refreshToken)
            dispatch(loginUser(userEmail))
            if(hasAccount) {
                toast.success("Logged In");
                navigate('/')
                dispatch(setCart(response.data.items))
            }
            else {
                toast.success("Signed up");
                navigate('/')
                dispatch(emptyCart())
            } 
            localStorage.setItem('userEmail', userEmail)
        }).catch((error) => {
            if (error.response && error.response.status === 401){
                toast.error(error.response.data.message);
            }
        })
    }

    function handleSwitch(){
        emailRef.current.value = ""
        passwordRef.current.value = ""
        setHasAccount((prevValue) => !prevValue);
    }

    return (
        <div className='login-container w-screen p-10 select-none'>
            <h1 className='text-2xl font-bold'>{hasAccount ? "Log In" : "Sign Up"}</h1>
            <form onSubmit={handleLogin} className='flex flex-col gap-5 py-10'>
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
                    <input type="text" id="email" 
                    ref={emailRef}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="johndoe@gmail.com" required />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input 
                    ref={passwordRef}
                    type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
                </div> 
                <button type="submit" className="w-fit text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>
            {hasAccount ? (<>
                <div>Don't have an account? <a className='cursor-pointer text-blue-800 hover:underline' onClick={handleSwitch}>Sign Up</a></div>
            </>) : (<>
                <div>Already have an account? <a className='cursor-pointer text-blue-800 hover:underline' onClick={handleSwitch}>Log In</a></div>
            </>)}
        </div>
    )
}


export default Login