import * as constants from './constants';

// ******************************************************************
// Public Section

// Public Selectors
export const getScreen = state => state[constants.NAME].screen;
export const getStatus = state => state[constants.NAME].status;

// Public Export
export const publicSelectors = {
  getScreen,          // name of current accessibility screen
  getStatus           // true if accessibility (VoiceOver/Talkback) is ON, false otherwise
};

export default publicSelectors;

// ******************************************************************
// Private Section

// Private Selectors
export const getStack = state => state[constants.NAME].stack;
export const getState = state => state[constants.NAME];
export const getOptions = state => state[constants.NAME].options;
