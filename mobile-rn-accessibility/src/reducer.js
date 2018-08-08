import * as constants from './constants';
import logging from './utils/logging.js';

const log = logging.logff.bind(logging.logff, {name: '[A11Y::Reducer] '});

export const initialState = {
  status: false,        // a11y (VoiceOver) status
  screen: '',           // current a11y screen
  stack: [],            // modal windows stack
  options: { logLevel: constants.LOG_LEVEL, debug: false }  // component options
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case constants.SET_PARAMS:
      state.options.logLevel >= 2 && log({action, state});
      return {
        ...state,
        ...(action.screen && {screen: action.screen}),
        ...(action.stack && {stack: action.stack})
      };
    case constants.SET_STATUS:
      state.options.logLevel >= 2 && log({action, state});
      return {
        ...state,
        status : action.status
       };
    case constants.SET_STATE:
      state.options.logLevel >= 2 && log({action});
      return {...state, ...action.params};
    default:
      return state;
  }
}
