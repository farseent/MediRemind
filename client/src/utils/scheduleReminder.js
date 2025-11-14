// utils/scheduleReminder.js

export const scheduleReminder = (medicine, time) => {
  const [hour, minute] = time.split(":").map(Number);

  const now = new Date();
  const reminderTime = new Date();

  reminderTime.setHours(hour, minute, 0, 0);

  // If time is already passed → schedule for tomorrow
  if (reminderTime <= now) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }

  const delay = reminderTime.getTime() - now.getTime();

  console.log(
    `⏰ Scheduling reminder for ${medicine.medicineName} at ${time} (in ${Math.round(
      delay / 1000
    )}s)`
  );

  setTimeout(() => {
    showReminderNotification(medicine, time);
    playAlarmSound();

    // Re-schedule automatically for next day
    scheduleReminder(medicine, time);
  }, delay);
};

// -----------------------------------------
// 🔔 POPUP NOTIFICATION
// -----------------------------------------

function showReminderNotification(medicine, time) {
  if (Notification.permission === "granted") {
    new Notification("💊 Medication Reminder", {
      body: `${medicine.medicineName} — ${medicine.dosage} (${time})`,
      icon: "/pill-icon.png"
    });
  }
}

// -----------------------------------------
// 🔊 AUDIO ALARM (repeat 3 times)
// -----------------------------------------

function playAlarmSound() {
  const audio = new Audio("/alarm.mp3");
  audio.volume = 1.0;

  // Try playing immediately
  audio.play().catch((err) => {
    console.warn("🔇 Audio blocked until user interacts with page");
  });

  // Play again (louder effect)
  setTimeout(() => audio.play().catch(() => {}), 1500);
  setTimeout(() => audio.play().catch(() => {}), 3000);
}
