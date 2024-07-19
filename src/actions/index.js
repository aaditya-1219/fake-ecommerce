export const addData = (productsArray) => {
    return {
        type: 'ADD_DATA',
        payload: productsArray
    }
}

export const setCart = (items) => {
    return {
        type: 'SET_CART',
        payload: items 
    }
}

export const addToCart = (itemObj) => {
    return {
        type: 'ADD_TO_CART',
        payload: itemObj
    }
}

export const emptyCart = () => {
    return {
        type: 'EMPTY_CART',
    }
}

export const deleteFromCart = (itemId) => {
    return {
        type: 'DELETE_FROM_CART',
        itemId: itemId
    }
}

export const updateQuantity = (itemId, itemQuantity) => {
    return {
        type: 'UPDATE_QUANTITY',
        itemId: itemId,
        itemQuantity: itemQuantity
    }
}

export const loginUser = (email) => {
    return {
        type: 'LOGIN_USER',
        email: email
    }
}

export const logoutUser = () => {
    return {
        type: 'LOGOUT_USER',
    }
}