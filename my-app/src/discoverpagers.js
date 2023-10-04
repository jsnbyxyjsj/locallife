// services/cardsService.js
import axios from 'axios';

export type CardsResponse = {
  data: Array<Card>;
};

export type PermissionsResponse = {
  data: Array<Permission>;
};

export async function getCards(): Promise<CardsResponse> {
  try {
    const response = await axios.get('/cards');
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getPermissions(): Promise<PermissionsResponse> {
  try {
    const response = await axios.get('/permissions');
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

// cardsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCards, getPermissions } from '../services/cardsService';

type CardsState = {
  cards: Array<Card>;
  permissions: Array<Permission>;
  loading: boolean;
  error: Error | null;
};

const initialState: CardsState = {
  cards: [],
  permissions: [],
  loading: false,
  error: null,
};

export const fetchCardsAndPermissions = createAsyncThunk(
  'cards/fetchCardsAndPermissions',
  async () => {
    try {
      const [cardsRes, permsRes] = await Promise.all([
        getCards(),
        getPermissions()
      ]);
      return {
        cards: cardsRes.data,
        permissions: permsRes.data
      };
    } catch (error) {
      return {
        error: error
      };
    }
  }
);

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardsAndPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCardsAndPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload.cards;
        state.permissions = action.payload.permissions;
      })
      .addCase(fetchCardsAndPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(
        'handleError',
        (state, action) => {
          // 将错误信息转换为中文
          const error = action.payload;
          const message = error.message;
          const stack = error.stack;
          state.error = {
            message: message.replace('Error:', '错误：'),
            stack: stack.replace('at ', '在 '),
          };
        },
        {
          // 将错误处理放在优先级最高的地方
          priority: 1,
        },
      ),
  },
});

export default cardsSlice.reducer;

// main.js
import { configureStore } from '@reduxjs/toolkit';
import cardsReducer, { fetchCardsAndPermissions } from './cardsSlice';

type Store = {
  cards: CardsState;
};

const store: Store = configureStore({
  reducer: {
    cards: cardsReducer
  }});

store.dispatch(fetchCardsAndPermissions());
