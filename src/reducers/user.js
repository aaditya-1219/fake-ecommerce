let initialState = {
    email: null
}

const userReducer = (state = initialState, action) => {
    switch(action.type){
        case 'LOGIN_USER':
            return {
                ...state,
                email: action.email, 
            };
        case 'LOGOUT_USER':
            return initialState;
        default:
            return state;
    }
}

export default userReducer;