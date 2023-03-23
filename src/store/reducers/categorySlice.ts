import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from 'store';
import { Category, CategoryDTO, CategoryState } from 'shared/models';
import { mapCategories } from 'shared/helpers';

const initialState: CategoryState = {
  status: 'idle',
  categories: []
};

export const getCategories = createAsyncThunk('categories/getCategories', async (): Promise<Category[]> => {
  try {
    const response = await axios.get<{ data: CategoryDTO[] }>(`${process.env.REACT_APP_BUDGET_MANAGEMENT_API}/category/getDefaultCategories`);

    const { data } = response.data;
    return mapCategories(data);
  } catch (error) {
    console.error(error);
    return [];
  }
});

export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getCategories.pending, (state) => {
        return {
          ...state,
          status: 'loading'
        };
      })
      .addCase(getCategories.rejected, (state) => {
        return {
          ...state,
          status: 'failed'
        };
      })
      .addCase(getCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        return {
          ...state,
          categories: action.payload,
          status: 'succeeded'
        };
      });
  }
});

export const selectCategories = (state: RootState): CategoryState => state.category;

export default categorySlice.reducer;
