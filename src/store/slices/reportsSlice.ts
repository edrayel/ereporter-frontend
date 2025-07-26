import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'incident' | 'observation' | 'violation' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'submitted' | 'under_review' | 'resolved' | 'rejected';
  agentId: string;
  pollingUnitId: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ReportsState {
  reports: Report[];
  selectedReport: Report | null;
  loading: boolean;
  error: string | null;
  filters: {
    type?: string;
    status?: string;
    priority?: string;
    agentId?: string;
    pollingUnitId?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

const initialState: ReportsState = {
  reports: [],
  selectedReport: null,
  loading: false,
  error: null,
  filters: {},
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setReports: (state, action: PayloadAction<Report[]>) => {
      state.reports = action.payload;
    },
    addReport: (state, action: PayloadAction<Report>) => {
      state.reports.unshift(action.payload);
    },
    updateReport: (state, action: PayloadAction<Report>) => {
      const index = state.reports.findIndex(report => report.id === action.payload.id);
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
    },
    removeReport: (state, action: PayloadAction<string>) => {
      state.reports = state.reports.filter(report => report.id !== action.payload);
    },
    setSelectedReport: (state, action: PayloadAction<Report | null>) => {
      state.selectedReport = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ReportsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: state => {
      state.filters = {};
    },
  },
});

export const {
  setReports,
  addReport,
  updateReport,
  removeReport,
  setSelectedReport,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = reportsSlice.actions;

export default reportsSlice.reducer;
