let initialState = {
    // cart will hold an array of objects (items)
    cart: []
} 

const cartReducer = (state = initialState, action) => {
    switch(action.type){
        case 'ADD_TO_CART':
            return {
                ...state,
                cart: [...state.cart, action.payload], 
            };
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                cart: state.cart.map(item => {
                    if(item.id === action.itemId){
                        return {
                            ...item,
                            quantity: action.itemQuantity
                        }
                    }
                    return item;
                })
            }
        case 'DELETE_FROM_CART':
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== action.itemId)
            }
        case 'SET_CART':
            return {
                cart: action.payload
            }; 
        case 'EMPTY_CART':
            return initialState; 

        default:
            return state;
    }
}

export default cartReducer;