// store.js
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducers";

const store = configureStore({
  reducer: rootReducer,
  // 他の設定を追加することもできます
});

export default store;
