import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Language = 'en' | 'si' | 'ta';

interface UIState {
  language: Language;
  sidebarOpen: boolean;
  notifications: Notification[];
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// Load language from localStorage
const loadLanguage = (): Language => {
  try {
    const storedLang = localStorage.getItem('agrilink_language');
    if (storedLang && ['en', 'si', 'ta'].includes(storedLang)) {
      return storedLang as Language;
    }
  } catch (error) {
    console.error('Error loading language:', error);
  }
  return 'en';
};

const initialState: UIState = {
  language: loadLanguage(),
  sidebarOpen: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      localStorage.setItem('agrilink_language', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'read' | 'createdAt'>>) => {
      state.notifications.unshift({
        ...action.payload,
        id: `notif-${Date.now()}`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setLanguage,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  markNotificationRead,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
