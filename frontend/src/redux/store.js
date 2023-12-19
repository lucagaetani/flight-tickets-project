import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import loggingRedux from "../../middleware/loggingRedux";

const store = configureStore({
  reducer: rootReducer,
  middleware: [loggingRedux],
});

export default store;
