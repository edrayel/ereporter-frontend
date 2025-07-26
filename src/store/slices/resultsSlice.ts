import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Result {
  id: string;
  pollingUnitId: string;
  electionType: string;
  totalVotes: number;
  validVotes: number;
  invalidVotes: number;
  candidates: {
    id: string;
    name: string;
    party: string;
    votes: number;
  }[];
  agentId: string;
  status: 'draft' | 'submitted' | 'verified' | 'published';
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ResultsState {
  results: Result[];
  selectedResult: Result | null;
  loading: boolean;
  error: string | null;
  filters: {
    pollingUnitId?: string;
    electionType?: string;
    status?: string;
    agentId?: string;
  };
}

const initialState: ResultsState = {
  results: [],
  selectedResult: null,
  loading: false,
  error: null,
  filters: {},
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    setResults: (state, action: PayloadAction<Result[]>) => {
      state.results = action.payload;
    },
    addResult: (state, action: PayloadAction<Result>) => {
      state.results.unshift(action.payload);
    },
    updateResult: (state, action: PayloadAction<Result>) => {
      const index = state.results.findIndex(result => result.id === action.payload.id);
      if (index !== -1) {
        state.results[index] = action.payload;
      }
    },
    removeResult: (state, action: PayloadAction<string>) => {
      state.results = state.results.filter(result => result.id !== action.payload);
    },
    setSelectedResult: (state, action: PayloadAction<Result | null>) => {
      state.selectedResult = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ResultsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: state => {
      state.filters = {};
    },
  },
});

export const {
  setResults,
  addResult,
  updateResult,
  removeResult,
  setSelectedResult,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = resultsSlice.actions;

export default resultsSlice.reducer;
