"use client"; // Client Component me Redux use karne ke liye

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/app/redux/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // Auth reducer ko add kar rahe hain
  },
});
