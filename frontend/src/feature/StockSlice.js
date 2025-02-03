import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchStocks = createAsyncThunk('stocks/fetchStocks', async () => {
  const response = await axios.get('/api/stocks');
  return response.data;
});

export const fetchStockData = createAsyncThunk(
  'stocks/fetchStockData',
  async ({ id, duration }, { dispatch, getState }) => {
    let stockData = [];
    let retries = 0;
    const maxRetries = 6; // Avoid infinite retries

    while (retries <= maxRetries) {
      try {
        const response = await axios.post(`/api/stocks/${id}`, { duration });

        // Extract the `data` array from the response, response consists object
        const newData = response.data?.data || [];
        console.log(newData);

        if (Array.isArray(newData) && newData.length > 0) {
          stockData = newData; // Store only the new data

          // Dispatch an action
          dispatch(setStockData(newData));
        }

        retries++;
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait before retrying
      } catch (error) {
        console.error('Error fetching stock data:', error);
        retries++;
      }
    }

    if (stockData.length === 0) {
      throw new Error('Failed to fetch stock data after multiple attempts');
    }
    return stockData;
  }
);

const stockSlice = createSlice({
  name: 'stocks',
  initialState: {
    stocks: [],
    selectedStock: null,
    stockData: [],
    loading: false,
    error: null,
  },
  reducers: {
    selectStock: (state, action) => {
      state.selectedStock = action.payload;
    },
    setStockData: (state, action) => {
      state.stockData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch stock asynchronously
      .addCase(fetchStocks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.stocks = action.payload;
        state.loading = false;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      // fetch stockData using stock id and body
      .addCase(fetchStockData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        state.stockData = action.payload;
        state.loading = false;
      })
      .addCase(fetchStockData.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const { selectStock, setStockData } = stockSlice.actions;
export default stockSlice.reducer;
