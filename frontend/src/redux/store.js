import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import loggingRedux from '../../middleware/loggingRedux';
import persistState from '../../middleware/PersistState';

const store = configureStore({
    reducer: rootReducer,
    middleware: [loggingRedux, persistState],
});

export default store;