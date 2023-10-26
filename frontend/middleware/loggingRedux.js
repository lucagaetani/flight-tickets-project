const loggingMiddleware = store => next => action => {
    console.log('Current State:', store.getState());
  
    const result = next(action);
  
    console.log('New State:', store.getState());
  
    return result;
  };
  
  export default loggingMiddleware;