import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hashPassword, verifyPassword } from '../../utils/hash';

const USERS_KEY = 'all_registered_users';
const CURRENT_KEY = 'current_user';

const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const loadUsers = () => safeParse(localStorage.getItem(USERS_KEY), []);
const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

const loadCurrent = () => safeParse(localStorage.getItem(CURRENT_KEY), null);
const saveCurrent = (user) => {
  if (user) localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
  else localStorage.removeItem(CURRENT_KEY);
};

const stripSecret = (user) => {
  if (!user) return null;
  const { passwordHash, salt, ...safe } = user;
  return safe;
};

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (values, { rejectWithValue }) => {
    const email = values.email.trim().toLowerCase();
    const users = loadUsers();
    if (users.some((u) => u.email === email)) {
      return rejectWithValue('An account with this email already exists.');
    }
    const { salt, hash } = await hashPassword(values.password);
    const record = {
      id: Date.now().toString(),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email,
      salt,
      passwordHash: hash,
      registeredAt: new Date().toISOString(),
    };
    users.push(record);
    saveUsers(users);
    const safe = stripSecret(record);
    saveCurrent(safe);
    return safe;
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (values, { rejectWithValue }) => {
    const email = values.email.trim().toLowerCase();
    const users = loadUsers();
    const found = users.find((u) => u.email === email);
    if (!found) {
      return rejectWithValue('No account found with this email.');
    }
    const ok = await verifyPassword(values.password, found.salt, found.passwordHash);
    if (!ok) return rejectWithValue('Incorrect password.');
    const safe = stripSecret(found);
    saveCurrent(safe);
    return safe;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: loadCurrent(),
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.status = 'idle';
      state.error = null;
      saveCurrent(null);
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(signupUser.fulfilled, (s, a) => { s.status = 'succeeded'; s.user = a.payload; })
      .addCase(signupUser.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload || 'Signup failed'; })
      .addCase(loginUser.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => { s.status = 'succeeded'; s.user = a.payload; })
      .addCase(loginUser.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload || 'Login failed'; });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
