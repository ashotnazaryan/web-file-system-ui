import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Setting, SettingDTO, SettingState } from 'shared/models';
import { RootState } from './rootReducer';
import { resetApp } from './appSlice';

const initialState: SettingState = {
  currency: {
    iso: 'USD',
    name: 'US Dollar',
    symbol: '$'
  },
  showDecimals: false,
  status: 'idle'
};

export const getSettings = createAsyncThunk('setting/getSettings', async (): Promise<Setting> => {
  try {
    const response = await axios.get<SettingDTO>(`${process.env.REACT_APP_BUDGET_MANAGEMENT_API}/settings`);

    return response?.data;
  } catch (error) {
    console.error(error);
    return {} as Setting;
  }
});

export const addSetting = createAsyncThunk('setting/addSetting', async (setting: Partial<Setting>, { dispatch }): Promise<void> => {
  try {
    await axios.post<void>(`${process.env.REACT_APP_BUDGET_MANAGEMENT_API}/settings/setting`, setting);
    dispatch(getSettings());
  } catch (error) {
    console.error(error);
  }
});

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getSettings.pending, (state) => {
        return {
          ...state,
          status: 'loading'
        };
      })
      .addCase(getSettings.rejected, (state) => {
        return {
          ...initialState,
          status: 'failed'
        };
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        return {
          ...state,
          ...action.payload,
          status: 'succeeded'
        };
      })
      .addCase(resetApp, () => {
        return initialState;
      });
  }
});

export const selectCurrency = (state: RootState): SettingState['currency'] => state.setting.currency;
export const selectSettings = (state: RootState): SettingState => state.setting;

export default settingSlice.reducer;
