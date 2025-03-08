"use client"
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, error: null },
  reducers: {
    signupSuccess: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    signupFailed: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { signupSuccess, signupFailed } = authSlice.actions;
export default authSlice.reducer;
