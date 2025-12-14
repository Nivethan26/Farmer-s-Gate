import { addNotification } from "@/store/uiSlice";
import type { AppDispatch } from "@/store";

export const notify = {
  success:
    (title: string, message: string, options = {}) =>
    (dispatch: AppDispatch) =>
      dispatch(
        addNotification({ title, message, type: "success", ...options })
      ),

  error:
    (title: string, message: string, options = {}) =>
    (dispatch: AppDispatch) =>
      dispatch(
        addNotification({ title, message, type: "error", ...options })
      ),

  info:
    (title: string, message: string, options = {}) =>
    (dispatch: AppDispatch) =>
      dispatch(addNotification({ title, message, type: "info", ...options })),

  warning:
    (title: string, message: string, options = {}) =>
    (dispatch: AppDispatch) =>
      dispatch(
        addNotification({ title, message, type: "warning", ...options })
      ),
};
