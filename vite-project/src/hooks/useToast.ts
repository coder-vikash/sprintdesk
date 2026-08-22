import { useNotificationStore } from "../stores/notificationStore";

// thin wrapper around the notification store so components don't need
// to know toasts are technically stored inside notificationStore
export function useToast() {
  const toasts = useNotificationStore((s) => s.toasts);
  const pushToast = useNotificationStore((s) => s.pushToast);

  function success(message: string) {
    pushToast(message, "success");
  }

  function error(message: string) {
    pushToast(message, "error");
  }

  function info(message: string) {
    pushToast(message, "info");
  }

  return { toasts, success, error, info };
}
