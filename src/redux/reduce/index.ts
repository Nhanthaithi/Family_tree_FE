import { combineReducers } from "redux";
import genealogySlice from "./genealogySlice";

const rootReducer = combineReducers({ dataGenealogy: genealogySlice });

export default rootReducer;
