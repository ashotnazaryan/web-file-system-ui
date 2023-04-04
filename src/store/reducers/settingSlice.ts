import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Setting, SettingDTO, StatusState } from 'shared/models';
import { RootState } from './rootReducer';
import { resetApp, setLoading } from './appSlice';

export interface SettingState extends Setting {
  status: StatusState;
}

const initialState: SettingState = {
  currency: {
    iso: 'USD',
    name: 'US Dollar',
    symbol: '$'
  },
  showDecimals: false,
  status: 'idle',
  isDarkTheme: false
};

export const getSettings = createAsyncThunk('setting/getSettings', async (_, { dispatch }): Promise<Setting> => {
  try {
    const response = await axios.get<SettingDTO>(`${process.env.REACT_APP_BUDGET_MANAGEMENT_API}/settings`);

    dispatch(setLoading(false));

    return response?.data;
  } catch (error) {
    console.error(error);
    dispatch(setLoading(false));
    return {} as Setting;
  }
});

export const addSetting = createAsyncThunk('setting/addSetting', async (setting: Partial<Setting>, { dispatch }): Promise<void> => {
  dispatch(setLoading(true));

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
