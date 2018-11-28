// Public Constants
export const NAME = 'mobile-rn-accessibility';

// Action Types
export const ON_SCREEN_CHANGED = NAME + '/ON_SCREEN_CHANGED';

// Exported Public Constants
export const publicConstants = {
  NAME,                       // component name
  ON_SCREEN_CHANGED           // accessibility screen changed
};

export default publicConstants;

// ******************************************************************
// Private Section

// Private Events
export const NAVIGATE_REQUEST   = NAME + '/NAVIGATE_REQUEST';
export const INIT_REQUEST       = NAME + '/INIT_REQUEST';

// Private Constants for Reducer
export const SET_PARAMS         = NAME + '/SET_PARAMS';
export const SET_STATUS         = NAME + '/SET_STATUS';
export const SET_STATE          = NAME + '/SET_STATE';
