import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../redux/appSlice/appSlice';

export const store = configureStore({
  reducer: {
    app: appReducer
  },
});
