import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const url = `${import.meta.env.VITE_AUTH_BACKEND_URL}` || "http://localhost:8000";

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Important for cookies
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      
      // Fetch user data
      const userResponse = await fetch(`${url}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });
      
      if (!userResponse.ok) {
        return rejectWithValue('Failed to fetch user data');
      }
      
      const userData = await userResponse.json();
      return { ...data, user: userData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'), // Initialize token from localStorage
    status: 'idle',
    error: null,
    isAuthenticated: !!localStorage.getItem('token'),
    username: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.username = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token'); // Remove token from localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.username = action.payload.user.username;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
