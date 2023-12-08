let user;

/**
 * Check if the cookie exists or not (if not, it means the user is not logged in)
 * If the cookie exists, we take the localStorage userData stored, otherwise we remove it
**/
await (async () => {
  try {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };
    const response = await fetch("http://localhost:3000/auth", requestOptions);
    const res = await response.json();
      if (res.success === true) {
        user = JSON.parse(localStorage.getItem("reduxState")).userData;
      } else {
        user = localStorage.removeItem("reduxState");
      }
  } catch(error) {
    console.log(`Error: ${error}. Can't do fetch of auth. Page rendered`);
  }
})();

const initialState = {
  userData: user ? user : null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        userData: action.payload,
      };
    case "DELETE":
      return {
        ...state,
        userData: null,
      };
    default:
      return state;
  }
};

export default rootReducer;
