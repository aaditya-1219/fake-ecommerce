import React from "react";

function Stars({ numOfStars }) {
	const stars = [];
	for (let i = 0; i < numOfStars; i++) {
		stars.push(
			<i
				key={i}
				className="fa-solid fa-star scale-90 text-yellow-400"
			></i>
		);
	}
	for (let i = numOfStars; i < 5; i++) {
		stars.push(
			<i
				key={i}
				className="fa-regular fa-star scale-90 text-yellow-400"
			></i>
		);
	}

	return <>{stars}</>;
}

export default Stars;
