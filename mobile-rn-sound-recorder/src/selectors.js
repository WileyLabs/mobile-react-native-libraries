import { NAME } from './constants';

// Public Selectors
export const hasPermission = (state) => state[NAME].hasPermission;
export const getAudioSettings = (state) => state[NAME].audioSettings;
export const isMounted = (state) => state[NAME].isMounted;
export const isRecording = (state) => state[NAME].isRecording;
export const isReadyToSave = (state) => state[NAME].isReadyToSave;
export const getCurrentTime = (state) => state[NAME].currentTime;
export const getInfo = (state) => state[NAME].info;
export const getError = (state) => state[NAME].error;
export const getDictionary = state => state[NAME].dictionary;

// Public Export
export const publicSelectors = {
  hasPermission,      // true if the application acquired microphone permission
  getAudioSettings,   // current audio settings [Object]
  isMounted,          // true if component is ready for recording (mounted)
  isRecording,        // true if recording is in progress (between start & stop requests)
  isReadyToSave,      // true if the last recording finished successfully and is ready to be saved
  getCurrentTime,     // current recording time in secs [Real Number]
  getInfo,            // descriptor of the last successfully saved file [Object]
  getError,           // current error [Object]
  getDictionary       // current dictionary
};

export default publicSelectors;

// ******************************************************************
// Private Section

// Private Selectors

// Returns state
export const getState = (state) => state[NAME];
export const getOptions = (state) => state[NAME].options;
