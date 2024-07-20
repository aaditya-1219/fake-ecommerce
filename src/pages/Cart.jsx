import React, { useEffect, useMemo } from "react";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "../components/CartItem";
import Divider from "../components/Divider";
import { Link } from "react-router-dom";
import { emptyCart } from "../actions";
import axios from "axios";

function Cart() {
	const cartArray = useSelector((state) => state.shoppingCart.cart);
	const dispatch = useDispatch()
	const handleCheckout = async () => {
		const accessToken = localStorage.getItem('accessToken')
		try {
			await axios.post(
			`http://localhost:5000/empty`,null,
				{
					headers: {
                        'Authorization': `Bearer ${accessToken}`,
					},
				}
			);
		} catch (error) {
			console.log(error)
		}
		dispatch(emptyCart())	
	}
	const subtotal = useMemo(() => calculateSubtotal(), [cartArray])
	function calculateSubtotal(){
		let total = 0
		cartArray.forEach(product => {
			total += parseFloat(product.price * product.quantity)
		});
		return total.toFixed(2)
	}
	return (
		<div className="p-4 pb-6 font-semibold text-2xl">
			{cartArray && cartArray.length === 0 ? (
				<h1 className="text-2xl text-slate-500">Your cart is empty</h1>
			) : (
				<>
					<h1 className="text-2xl mb-4">Your cart</h1>
					<div className="flex flex-col gap-2">
						{cartArray.map((product, index) => {
							return (
								<React.Fragment key={index}>
									<CartItem key={index} product={product} />
									<Divider />
								</React.Fragment>
							);
						})}
					</div>
					<div className="my-4 border font-light text-lg w-fit p-3 ml-auto mr-4">
						Cart Subtotal ({cartArray.length} item
						{cartArray.length > 1 && "s"}) {" "}
						<span className="font-bold">
							$
							{subtotal}
						</span>
						<Link to={'/checkout'} onClick={handleCheckout}>
							<button className="my-2 block bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 border border-gray-400 rounded shadow w-full">
								Proceed to Checkout
							</button>
						</Link>
					</div>
				</>
			)}
		</div>
	);
}

export default Cart;
