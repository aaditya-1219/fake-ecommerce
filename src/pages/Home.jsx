import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Home() {
	const products = useSelector((state) => state.product.data);
	const [filteredProducts, setFilteredProducts] = useState(null);

	useEffect(() => {
		if (products) setFilteredProducts(products);
	}, [products]);

	return (
		<div className="flex flex-col sm:flex-row">
			<Sidebar
				filteredProducts={filteredProducts}
				setFilteredProducts={setFilteredProducts}
				products={products}
			/>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-50 w-full">
				{filteredProducts &&
					filteredProducts.length > 0 &&
					filteredProducts.map((product, index) => (
						<div
							className="relative h-fit m-4 block max-w-sm p-2 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg"
							key={index}
						>
							<Link
								to={"/product"}
								state={{ product: product }}
								key={index}
							>
								<img
									className="object-contain h-60 w-full "
									src={product.image}
									alt="productImage"
								/>
								<span className="absolute top-0 right-0 bg-opacity-80 bg-slate-50 rounded m-2 p-1">
									<i className="fa-solid fa-star text-yellow-300 scale-90 mr-1"></i>
									{product.rating.rate}
								</span>
								<div className="product-desc px-2 pb-2 mt-4 flex flex-col gap-1">
									<p className="font-semibold text-base w-full leading-none overflow-hidden whitespace-nowrap text-ellipsis">
										{product.title}
									</p>
									<p className="font-semibold text-sm">
										$ {product.price}
									</p>
								</div>
							</Link>
						</div>
					))}
				{filteredProducts && filteredProducts.length === 0 && (
					<div className="font-semibold text-lg text-slate-400">
						No items match your search
					</div>
				)}
			</div>
		</div>
	);
}

export default Home;
