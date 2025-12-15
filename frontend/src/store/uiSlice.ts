import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const loadLanguage = (): Language => {
  const saved = localStorage.getItem("agrilink_language");
  return (saved as Language) || "en";
};

const saveLanguage = (lang: Language) => {
  localStorage.setItem("agrilink_language", lang);
};

export type Language = "en" | "si" | "ta";
export type UserRole = "admin" | "seller" | "buyer" | "agent" | "all";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  category?: "order" | "system" | "message" | 'delivery' | 'payment';
  role?: UserRole;
  link?: string;
  sender?: {
    id: string;
    name: string;
    role: UserRole;
  };
  sellerId?: string;  
  buyerId?: string;
  read: boolean;
  createdAt: string;
}

interface UIState {
  language: Language;
  sidebarOpen: boolean;
  notifications: Notification[];
}

const loadNotifications = (): Notification[] => {
  try {
    const raw = localStorage.getItem("agrilink_notifications");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveNotifications = (data: Notification[]) => {
  localStorage.setItem("agrilink_notifications", JSON.stringify(data));
};

const initialState: UIState = {
  language: loadLanguage(),
  sidebarOpen: false,
  notifications: loadNotifications(),
};


const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      saveLanguage(action.payload);
    },

    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, "id" | "read" | "createdAt">>
    ) => {
      state.notifications.unshift({
        ...action.payload,
        id: crypto.randomUUID(),
        read: false,
        createdAt: new Date().toISOString(),
      });

      state.notifications = state.notifications.slice(0, 100);
      saveNotifications(state.notifications);
    },

    markNotificationRead: (state, action: PayloadAction<string>) => {
      const n = state.notifications.find((n) => n.id === action.payload);
      if (n) n.read = true;
      saveNotifications(state.notifications);
    },

    markAllNotificationsRead: (state) => {
      state.notifications.forEach((n) => (n.read = true));
      saveNotifications(state.notifications);
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
      saveNotifications(state.notifications);
    },

    clearNotifications: (state) => {
      state.notifications = [];
      saveNotifications([]);
    },
  },
});


export const {
  setLanguage,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
