import React, { useEffect, useState } from "react";
import Divider from "./Divider";
import Stars from "./Stars";

function Sidebar({ filteredProducts, setFilteredProducts, products }) {
	const [productFilter, setProductFilter] = useState({
		category: "all",
		price: new Set(),
		ratingLowerLimit: 0,
	});

	const getPriceRange = (price) => {
		if (price < 10) return "below10";
		if (price >= 10 && price < 50) return "tenFifty";
		if (price >= 50 && price <= 100) return "fiftyHundred";
		if (price >= 100) return "above100";
	};

	const handleFilterChange = (filterName, filterValue) => {
		setProductFilter((prevFilter) => {
			if (filterName === "price") {
				const updatedPriceFilters = new Set(prevFilter.price);
				if (updatedPriceFilters.has(filterValue))
					updatedPriceFilters.delete(filterValue);
				else updatedPriceFilters.add(filterValue);
				return {
					...prevFilter,
					price: updatedPriceFilters,
				};
			} else {
				return {
					...prevFilter,
					[filterName]: filterValue,
				};
			}
		});
	};

	useEffect(() => {
		// console.log(productFilter);
		setFilteredProducts(
			products.filter((product) => {
				if (productFilter.category !== "all" && product.category !== productFilter.category) return false;
				if (productFilter.price.size > 0 && !productFilter.price.has(getPriceRange(product.price))) return false;
				if(product.rating.rate < productFilter.ratingLowerLimit) return false;
				return true;
			})
		);
	}, [productFilter]);

	const categoryFilters = [
		{ id: "all", category: "all" },
		{ id: "mensClothing", category: "men's clothing" },
		{ id: "womensClothing", category: "women's clothing" },
		{ id: "jewelery", category: "jewelery" },
		{ id: "electronics", category: "electronics" },
	];

	const priceFilters = [
		{ id: "below10", value: "Below $10" },
		{ id: "tenFifty", value: "$10 - $50" },
		{ id: "fiftyHundred", value: "$50 - $100" },
		{ id: "above100", value: "Above $100" },
	];

	const ratingFilters = ["1star", "2star", "3star", "4star"];

	return (
		<div id="sidebar" className="z-10 hidden md:flex bg-gray-50 flex-col border border-y-0 border-slate-300 sm:h-screen md:sticky md:top-0 p-3 gap-4 whitespace-nowrap">
			<div>
				<h2 className="text-lg font-semibold">Filter by Category</h2>
				{categoryFilters.map((categoryObj, index) => (
					<div key={index}>
						<input
							type="radio"
							name="categoryFilter"
							id={categoryObj.id}
							onChange={() =>
								handleFilterChange(
									"category",
									categoryObj.category
								)
							}
							checked={
								productFilter.category === categoryObj.category
							}
						/>
						<label className="ml-2" htmlFor={categoryObj.id}>
							{categoryObj.category &&
								categoryObj.category.charAt(0).toUpperCase() +
									categoryObj.category.slice(1)}
						</label>
					</div>
				))}
			</div>
			<Divider />
			<div>
				<h2 className="text-lg font-semibold">Filter by Price</h2>
				{priceFilters.map((priceFilter, index) => (
					<div key={index}>
						<input
							type="checkbox"
							name={priceFilter.id}
							id={priceFilter.id}
							onChange={() =>
								handleFilterChange("price", priceFilter.id)
							}
						/>
						<label className="ml-2" htmlFor={priceFilter.id}>
							{priceFilter.value}
						</label>
					</div>
				))}
			</div>
			<Divider />
			<div>
				<h2 className="text-lg font-semibold">Filter by Rating</h2>
				{ratingFilters.map((filterValue, index) => (
					<div className="flex" key={index}>
						<input
							type="radio"
							name="ratingFilter"
							id={filterValue}
							onChange={() => handleFilterChange("ratingLowerLimit", index+1)}
						/>
						<label className="ml-2" htmlFor={filterValue}>
							<Stars numOfStars={index + 1} /> & up
						</label>
					</div>
				))}
			</div>
			<Divider />
		</div>
	);
}

export default Sidebar;

// Categories:
// men's clothing
// women's clothing
// jewelery
// electronics