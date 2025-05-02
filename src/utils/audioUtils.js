/**
 * Audio utility for handling notification sounds
 */

// Create audio elements for different notification types
const notificationSounds = {
  default: new Audio(),
  success: new Audio(),
  warning: new Audio(),
  error: new Audio(),
};

// Set default sound URLs
notificationSounds.default.src =
  "https://actions.google.com/sounds/v1/alarms/gentle_alarm_clock.ogg";
notificationSounds.success.src =
  "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg";
notificationSounds.warning.src =
  "https://actions.google.com/sounds/v1/alarms/medium_bell_ringing_near.ogg";
notificationSounds.error.src =
  "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg";

// Set audio properties
Object.values(notificationSounds).forEach((audio) => {
  audio.volume = 0.5; // 50% volume by default
});

/**
 * Play a notification sound
 * @param {string} type - The type of notification sound (default, success, warning, error)
 * @param {object} options - Additional options like volume
 */
export const playNotificationSound = (type = "default", options = {}) => {
  const sound = notificationSounds[type] || notificationSounds.default;

  // Apply options
  if (options.volume !== undefined) {
    sound.volume = Math.min(1, Math.max(0, options.volume)); // Ensure volume is between 0 and 1
  }

  // Stop any currently playing sound
  sound.pause();
  sound.currentTime = 0;

  // Play the sound
  sound.play().catch((err) => {
    console.warn("Could not play notification sound:", err);
    // Browsers often block autoplay without user interaction
    // This error is expected if the user hasn't interacted with the page yet
  });
};

/**
 * Set custom sound URLs
 * @param {object} soundUrls - Object mapping sound types to URLs
 */
export const setCustomSounds = (soundUrls) => {
  Object.entries(soundUrls).forEach(([type, url]) => {
    if (notificationSounds[type]) {
      notificationSounds[type].src = url;
    }
  });
};

/**
 * Set the default volume for all sounds
 * @param {number} volume - Volume level between 0 and 1
 */
export const setDefaultVolume = (volume) => {
  const normalizedVolume = Math.min(1, Math.max(0, volume));
  Object.values(notificationSounds).forEach((audio) => {
    audio.volume = normalizedVolume;
  });
};

export default {
  playNotificationSound,
  setCustomSounds,
  setDefaultVolume,
};
