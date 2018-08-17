// Placeholder for Accessibility Actions
import * as constants from './constants';

// Public Action Creators for Sagas

// Action Creators for Sagas

/**
 * Initializes component (optional)
 * @param options.logLevel logging level (0 - no debug info, default; 1; 2 - wordy log)
 * @param options.debug emulate VoiceOver On for iOS
 */
export const initRequest = (options = { logLevel: 0, debug: false }) => ({ type: constants.INIT_REQUEST, options });

/**
 * Passes current screen to Accessibility
 * @param screen name of the current screen
 * @param method navigation method (jumpTo, replace, push, pop, immediatelyResetRouteStack)
 */
export const navigateRequest = (screen, method = 'jumpTo', sender = '') => ({ type: constants.NAVIGATE_REQUEST, screen, method, sender });

// Exported Public Actions
export const publicActions = {
  initRequest,                // initializes component
  navigateRequest             // notify navigation
};

export default publicActions;

// ******************************************************************
// Private Section

// Private Action Creators for Reducer
export const setParams = (screen, stack) => ({ type: constants.SET_PARAMS, screen, stack });
export const setStatus = status => ({ type: constants.SET_STATUS, status });
export const setState = params => ({ type: constants.SET_STATE, params });
