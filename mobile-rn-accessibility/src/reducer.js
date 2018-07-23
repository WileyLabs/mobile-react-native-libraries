import * as constants from './constants';

export const initialState = {
  status: false,        // a11y (VoiceOver) status
  screen: '',           // current a11y screen
  stack: [],            // modal windows stack
  options: { logLevel: constants.LOG_LEVEL, debug: false }  // component options
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case constants.SET_PARAMS:
      if (state.options.logLevel >= 2) {
        console.log('[A11Y::Reducer]', { action, state });
      }
      return {
        ...state,
        screen : action.screen === undefined ? state.screen : action.screen,
        stack: action.stack === undefined ? state.stack : action.stack,
      };
    case constants.SET_STATUS:
      if (state.options.logLevel >= 2) {
        console.log('[A11Y::Reducer]', { action, state });
      }
      return {
        ...state,
        status : action.status
       };
    case constants.SET_STATE:
      if (state.options.logLevel > 1) {
        console.log('[A11Y::Reducer]', {action});
        }
        return { ...state, ...action.params };
    default:
      return state;
  }
}
