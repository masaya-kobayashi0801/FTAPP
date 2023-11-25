// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import thunk from "redux-thunk";
import persistedReducer from "../reducers";

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
  // 他の設定を追加することもできます
});

export const persistor = persistStore(store);
export default store;
