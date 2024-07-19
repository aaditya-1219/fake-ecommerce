import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";

function Navbar() {
	const toggleSidebar = () => {
		document.getElementById("sidebar").classList.toggle("hidden");
		document.getElementById("sidebar").classList.toggle("flex");
	};
	const user = useSelector(state => state.user.email);

	return (
		<div
			id="navbar"
			className="p-4 items-center flex justify-between h-16 bg-slate-800"
		>
			<Link to={"/"} className="no-underline flex items-center">
				<button
					className="md:hidden text-white"
					onClick={toggleSidebar}
				>
					<div className="burger-icon flex flex-col justify-between w-6 h-4 cursor-pointer my-auto">
						<div className="bg-white h-0.5 rounded"></div>
						<div className="bg-white h-0.5 rounded"></div>
						<div className="bg-white h-0.5 rounded"></div>
					</div>
				</button>
				<span className="font-semibold text-white p-2 mx-4 hover:bg-gray-700 hover:text-gray-200 cursor-pointer rounded-md transition-all duration-300">
					Home
				</span>
			</Link>
			<div id="navbar-right-icons" className="flex items-center">
				{user == null ? (
					<Link to={"/login"} className="no-underline">
						<div className="nav-cart p-2 mx-2 hover:bg-gray-700 hover:text-gray-200 cursor-pointer rounded-md transition-all duration-300">
							<span className="font-semibold text-white">Login</span>
						</div>
					</Link>
				) : (
					<Dropdown user={user} />
				)}
				<Link to={(user == null ? "/login" : "/cart")} className="no-underline">
					<div className="nav-cart p-2 mx-2 hover:bg-gray-700 hover:text-gray-200 cursor-pointer rounded-md transition-all duration-300">
						<span className="font-semibold text-white">Cart</span>
						<i className="m-2 fa-solid fa-cart-shopping text-white scale-150"></i>
					</div>
				</Link>
			</div>
		</div>
	);
}

export default Navbar;
