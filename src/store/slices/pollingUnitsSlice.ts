import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PollingUnit {
  id: string;
  name: string;
  code: string;
  ward: string;
  lga: string;
  state: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  capacity: number;
  facilities: {
    wheelchairAccessible: boolean;
    visuallyImpairedSupport: boolean;
    hearingImpairedSupport: boolean;
  };
  contact: {
    phone?: string;
    email?: string;
  };
  operatingHours: {
    open: string;
    close: string;
  };
  status: 'active' | 'inactive' | 'maintenance';
  agentId?: string;
  createdAt: string;
  updatedAt: string;
}

interface PollingUnitsState {
  pollingUnits: PollingUnit[];
  selectedPollingUnit: PollingUnit | null;
  loading: boolean;
  error: string | null;
  filters: {
    state?: string;
    lga?: string;
    ward?: string;
    status?: string;
    search?: string;
  };
}

const initialState: PollingUnitsState = {
  pollingUnits: [],
  selectedPollingUnit: null,
  loading: false,
  error: null,
  filters: {},
};

const pollingUnitsSlice = createSlice({
  name: 'pollingUnits',
  initialState,
  reducers: {
    setPollingUnits: (state, action: PayloadAction<PollingUnit[]>) => {
      state.pollingUnits = action.payload;
    },
    addPollingUnit: (state, action: PayloadAction<PollingUnit>) => {
      state.pollingUnits.push(action.payload);
    },
    updatePollingUnit: (state, action: PayloadAction<PollingUnit>) => {
      const index = state.pollingUnits.findIndex(unit => unit.id === action.payload.id);
      if (index !== -1) {
        state.pollingUnits[index] = action.payload;
      }
    },
    removePollingUnit: (state, action: PayloadAction<string>) => {
      state.pollingUnits = state.pollingUnits.filter(unit => unit.id !== action.payload);
    },
    setSelectedPollingUnit: (state, action: PayloadAction<PollingUnit | null>) => {
      state.selectedPollingUnit = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<PollingUnitsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: state => {
      state.filters = {};
    },
  },
});

export const {
  setPollingUnits,
  addPollingUnit,
  updatePollingUnit,
  removePollingUnit,
  setSelectedPollingUnit,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = pollingUnitsSlice.actions;

export default pollingUnitsSlice.reducer;
