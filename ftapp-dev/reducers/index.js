import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cardDetailsReducer from "./cardDetailsReducer";
import clientSecretReducer from "./clientSecretReducer";
import registerInfoReducer from "./registerInfoReducer";
import paymentIntentReducer from "./paymentIntentReducer";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  cardDetails: cardDetailsReducer,
  clientSecret: clientSecretReducer,
  isRegister: registerInfoReducer,
  paymentIntentId: paymentIntentReducer,
  // 他のReducerがあればここに追加
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
