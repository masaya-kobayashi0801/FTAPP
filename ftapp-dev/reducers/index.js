import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cardDetailsReducer from "./cardDetailsReducer";
import clientSecretReducer from "./clientSecretReducer";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  cardDetails: cardDetailsReducer,
  clientSecret: clientSecretReducer,
  // 他のReducerがあればここに追加
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
