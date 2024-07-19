let initialState = {
    data: []
} 

const productReducer = (state = initialState, action) => {
    switch(action.type){
        case 'ADD_DATA':
            return {
                ...state,
                data: action.payload, 
            };
        default:
            return state;
    }
}

export default productReducer;