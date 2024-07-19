import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteFromCart, updateQuantity } from "../actions";
import axios from "axios";
import { toast } from "react-toastify";
import isFirstRender from "../hooks/isFirstRender"

function CartItem({ product }) {
    const [quantity, setQuantity] = useState(product.quantity);
    const dispatch = useDispatch();

    const firstRender = isFirstRender()
    useEffect(() => {
        if(firstRender) return
        const accessToken = localStorage.getItem('accessToken')
        const controller = new AbortController()
        dispatch(updateQuantity(product.id, quantity));
        try {
            axios.post('http://localhost:5000/update', 
                {id: product.id, quantity},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    signal: controller.signal
                }
            )
        } catch (error) {
            console.log(error)
        }
        return () => {
            controller.abort()
        }
    }, [dispatch, product.id, quantity]);

    const deleteProduct = async () => {
        const accessToken = localStorage.getItem('accessToken')
        try {
            await axios.post(`http://localhost:5000/delete/${product.id}`, null, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            dispatch(deleteFromCart(product.id));
        } catch (err){
            toast.error("An error occurred")
            console.log(err)
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    const incrementQuantity = () => {
        if (quantity < 10) {
            setQuantity(prevQuantity => prevQuantity + 1);
        }
    };

    return (
        <div className="p-2 h-40">
            <div className="flex flex-row h-full">
                <img src={product.image} className="w-36 object-contain" />
                <div className="flex flex-col gap-2 ml-8">
                    <p className="text-xl font-normal">{product.title}</p>
                    <p className="text-lg">$ {product.price}</p>
                    <div className="flex flex-row mt-2">
                        <form className="text-sm mr-4">
                            <div className="relative flex products-center max-w-[8rem]">
                                <button
                                    type="button"
                                    id="decrement-button"
                                    data-input-counter-decrement="quantity-input"
                                    className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11"
                                    onClick={decrementQuantity}
                                >
                                    -
                                </button>
                                <input
                                    type="text"
                                    id="quantity-input"
                                    className="outline-none border bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm block w-full py-2.5"
                                    value={quantity}
                                    readOnly
                                />
                                <button
                                    type="button"
                                    id="increment-button"
                                    data-input-counter-increment="quantity-input"
                                    className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11"
                                    onClick={incrementQuantity}
                                >
                                    +
                                </button>
                            </div>
                        </form>
                        <button
                            className="text-sm bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-fit"
                            onClick={deleteProduct}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
