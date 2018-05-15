import { NAME } from './constants';

// Public Selectors
export const isMounted = (state) => state[NAME].isMounted;
export const isPlaying = (state) => state[NAME].isPlaying;
export const isPaused = (state) => state[NAME].isPaused;
export const getCurrentTime = (state) => state[NAME].currentTime;
export const getInfo = (state) => state[NAME].info;
export const getError = (state) => state[NAME].error;

// Public Export
export const publicSelectors = {
  isMounted,          // true if component ready for playing sound (mounted)
  isPlaying,          // true if playback is in progress
  isPaused,           // true if paused (isPlaying is still true)
  getCurrentTime,     // current recording time (isRecording == true)
  getInfo,            // get descriptor of the last sound source
  getError            // get current error { code, name, message(opt) }
};

export default publicSelectors;

// ******************************************************************
// Private Section

// Private Selectors

export const getState = (state) => state[NAME];

