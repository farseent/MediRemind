export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    alert("Notifications are not supported by your browser.");
    return false;
  }

  let permission = Notification.permission;

  if (permission === "default") {
    permission = await Notification.requestPermission();
  }

  return permission === "granted";
};
