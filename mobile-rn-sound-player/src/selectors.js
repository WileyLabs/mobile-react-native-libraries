import { NAME } from './constants';

// Public Selectors
export const isMounted = (state) => state[NAME].isMounted;
export const isPlaying = (state) => state[NAME].isPlaying;
export const isPaused = (state) => state[NAME].isPaused;
export const getCurrentTime = (state) => state[NAME].currentTime;
export const getInfo = (state) => state[NAME].info;
export const getDuration = (state) => state[NAME].info.duration;
export const getVolume = (state) => state[NAME].volume;
export const getError = (state) => state[NAME].error;

// Public Export
export const publicSelectors = {
  isMounted,          // true if component ready for playing sound (mounted)
  isPlaying,          // true if playback is in progress
  isPaused,           // true if paused (isPlaying is still true)
  getCurrentTime,     // current position in sound file (secs)
  getInfo,            // descriptor of the last loaded sound
  getDuration,        // duration of the last loaded sound
  getVolume,          // volume descriptor { mute, level }
  getError            // last error descriptor { code, name, message(opt) }
};

export default publicSelectors;

// ******************************************************************
// Private Section

// Private Selectors

export const getState = (state) => state[NAME];
export const getOptions = (state) => state[NAME].options;
