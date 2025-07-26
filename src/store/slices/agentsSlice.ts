import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  pollingUnitId?: string;
  lastSeen?: string;
  createdAt: string;
  updatedAt: string;
}

interface AgentsState {
  agents: Agent[];
  selectedAgent: Agent | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    pollingUnit?: string;
    search?: string;
  };
}

const initialState: AgentsState = {
  agents: [],
  selectedAgent: null,
  loading: false,
  error: null,
  filters: {},
};

const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    setAgents: (state, action: PayloadAction<Agent[]>) => {
      state.agents = action.payload;
    },
    addAgent: (state, action: PayloadAction<Agent>) => {
      state.agents.push(action.payload);
    },
    updateAgent: (state, action: PayloadAction<Agent>) => {
      const index = state.agents.findIndex(agent => agent.id === action.payload.id);
      if (index !== -1) {
        state.agents[index] = action.payload;
      }
    },
    removeAgent: (state, action: PayloadAction<string>) => {
      state.agents = state.agents.filter(agent => agent.id !== action.payload);
    },
    setSelectedAgent: (state, action: PayloadAction<Agent | null>) => {
      state.selectedAgent = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<AgentsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: state => {
      state.filters = {};
    },
  },
});

export const {
  setAgents,
  addAgent,
  updateAgent,
  removeAgent,
  setSelectedAgent,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = agentsSlice.actions;

export default agentsSlice.reducer;
