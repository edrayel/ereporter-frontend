import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { applyTheme, getStoredTheme } from '../../utils/theme';

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  loading: {
    global: boolean;
    [key: string]: boolean;
  };
  modals: {
    [key: string]: boolean;
  };
  notifications: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    read: boolean;
  }[];
}

const initialState: UIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: getStoredTheme(),
  loading: {
    global: false,
  },
  modals: {},
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      applyTheme(action.payload);
    },
    toggleTheme: state => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      applyTheme(state.theme);
    },
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      const { key, loading } = action.payload;
      state.loading[key] = loading;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false;
    },
    toggleModal: (state, action: PayloadAction<string>) => {
      const modalKey = action.payload;
      state.modals[modalKey] = !state.modals[modalKey];
    },
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        read: false,
      };
      state.notifications.push(notification);
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebarCollapsed: state => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload,
      );
    },
    clearNotifications: state => {
      state.notifications = [];
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setSidebarCollapsed,
  toggleSidebarCollapsed,
  setTheme,
  toggleTheme,
  setLoading,
  setGlobalLoading,
  openModal,
  closeModal,
  toggleModal,
  addNotification,
  markNotificationAsRead,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
