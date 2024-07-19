import cartReducer from "./cart";
import productReducer from "./products";
import userReducer from "./user";
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    product: productReducer,
    shoppingCart: cartReducer,
    user: userReducer
})

export default rootReducer;