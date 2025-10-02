import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./features/chat/chatSlice";
import userReducer from "./features/user/user";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    user: userReducer,
  },
});

// Types exportés
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
