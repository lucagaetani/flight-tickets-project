const initialState = {
    userData: null
};
  
const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD':
            return {
                ...state,
                userData: action.payload
            }
        case 'DELETE':
            return {
                ...state,
                userData: null
            }
        default:
            return state;
    }
};

export default rootReducer;