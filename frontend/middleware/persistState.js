const persistState = store => next => action => {
    const result = next(action);
  
    localStorage.setItem('reduxState', JSON.stringify(store.getState()));
  
    return result;
};
  
export default persistState;