import "./App.css";
import { Link, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addData, setCart } from "./actions";
import { loginUser } from "./actions";
import { useEffect } from "react";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import { ToastContainer, Zoom } from "react-toastify";

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get("http://localhost:5000/getProducts")
				.then((response) => {
					dispatch(addData(response.data));
				});
		};
		fetchData();
	}, [dispatch]);

	useEffect(() => {
		const fetchCart = async (userEmail) => {
			const accessToken = localStorage.getItem('accessToken')
			await axios
				.get(`http://localhost:5000/cart/${userEmail}`,
					{
						headers: {
							'Authorization': `Bearer ${accessToken}`
						}
					}
				)
				.then((response) => {
					dispatch(setCart(response.data.items));
				});
		}
		const userEmail = localStorage.getItem('userEmail');
		if(userEmail) {
			dispatch(loginUser(userEmail));
			(async () => {
				await refreshAccessToken();
				fetchCart(userEmail);
			})();
		}
	}, [])

	const refreshAccessToken = async () => {
		if(!user) return
		const refreshToken = localStorage.getItem('refreshToken')
		const response = await axios.post('http://localhost:5000/refreshToken', {
			refreshToken: refreshToken
		})
		localStorage.setItem('accessToken', response.data.accessToken)
	}

	const user = useSelector(state => state.user.email)
	const setupTokenRefresh = () => {
		if(!user) return
		// accessToken stays valid for 10 mins, refreshed 1 min before expiry
		const refreshTime = (9 * 60 * 1000)
		setTimeout(async () => {
			await refreshAccessToken();
			setupTokenRefresh();
		}, refreshTime);
	};
	setupTokenRefresh();

	return (
		<>
			<ToastContainer
				position="bottom-right"
				hideProgressBar="true"
				autoClose="2000"
				transition={Zoom}
			/>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/product" element={<Product />} />
				<Route path="/cart" element={<Cart />} />
				<Route path="/checkout" element={<Checkout />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</>
	);
}

export default App;
