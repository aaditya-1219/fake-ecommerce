import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../actions";
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

function Product() {
	const dispatch = useDispatch();
	const location = useLocation();
	const cartArray = useSelector((state) => state.shoppingCart.cart);
	const [product, setProduct] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const [productInCart, setProductInCart] = useState(false);
	const navigate = useNavigate();
	const email = useSelector(state => state.user.email)

	useEffect(() => {
		if (location.state && location.state.product) {
			setProduct(location.state.product);
		}
	}, [location.state]);

	useEffect(() => {
		if (product) {
			const isInCart = cartArray.some((item) => item.id === product.id);
			setProductInCart(isInCart);
		}
	}, [product, cartArray]);

	const decrementCount = () => {
		if (quantity > 1) setQuantity((prevCount) => prevCount - 1);
	};

	const incrementCount = () => {
		if (quantity < 10) setQuantity((prevCount) => prevCount + 1);
	};

	const handleAddToCart = async () => {
		if(email == null){
			navigate('/login')
			return
		}
		const accessToken = localStorage.getItem('accessToken')
		try {
			await axios.post("http://localhost:5000/add", {
				product,
				quantity,
			},
			{
				headers: {
					'Authorization': `Bearer ${accessToken}`
				}
			}
		);
			toast.success("Added to cart!");
			dispatch(addToCart({ ...product, quantity: quantity }));
		} catch (error) {
			toast.error("An error occurred");
		}
	};

	if (!product) {
		return <div>Loading...</div>;
	}

	return (
		<div className="product-container flex flex-col">
			<div className="product-wrapper gap-20 grid mx-20 mt-20 grid-cols-2">
				<div className="product-img m-auto">
					<img
						className="h-96"
						src={product.image}
						alt={product.title}
					/>
				</div>
				<div className="w-5/6 gap-6 flex flex-col product-desc">
					<div className="product-title">
						<h1 className="text-2xl font-bold">{product.title}</h1>
						<h2 className="text-xl text-slate-400">
							{product.category}
						</h2>
						<p className="text-base">
							<i className="fa-solid fa-star text-yellow-300 scale-90 mr-1"></i>
							{product.rating && product.rating.rate}
						</p>
					</div>
					<div className="product-price">
						<h2 className="text-2xl font-bold">
							$ {product.price}
						</h2>
					</div>
					<div className="product-size">
						<h2 className="select-size mb-1 text-base font-semibold">
							SELECT SIZE
						</h2>
						<div className="size-counter">
							<button
								className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
								disabled={productInCart}
								onClick={decrementCount}
							>
								-
							</button>
							<span className="mx-4">{quantity}</span>
							<button
								className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
								disabled={productInCart}
								onClick={incrementCount}
							>
								+
							</button>
						</div>
					</div>
					<button
						className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-fit"
						onClick={handleAddToCart}
						disabled={productInCart}
					>
						{productInCart ? "IN CART" : "ADD TO CART"}
					</button>
				</div>
			</div>
			<div className="product-details m-6">
				<h2 className="text-base font-semibold mb-1">
					PRODUCT DETAILS
				</h2>
				<p>{product.description}</p>
			</div>
		</div>
	);
}

export default Product;
