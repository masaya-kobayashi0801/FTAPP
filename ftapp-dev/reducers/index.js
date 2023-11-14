import { combineReducers } from "redux"; //  調査
import cardDetailsReducer from "./cardDetailsReducer";

const rootReducer = combineReducers({
  cardDetails: cardDetailsReducer,
  // 他のReducerがあればここに追加
});

export default rootReducer;
