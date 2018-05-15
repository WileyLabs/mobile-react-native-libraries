import * as constants from './constants';
import { logging } from './utils';

export const defaultInfo = {
  url: '',                    // file url
  basePath: '',               // base path (if applicable)
  size: 0.0,                  // file size in bytes
  duration: 0.0               // sound duration in secs
};

const initialState = {
  info: defaultInfo,          // playback info
  sound: undefined,           // sound object
  isMounted: false,           // true if component mounted (initialized by mountRequest)
  isPlaying: false,           // true if playback is in progress (approximately)
  isPaused: false,            // true if playback is paused
  currentTime: 0.0,           // current playing time (isPlaying: true)
  error: { errCode: constants.ERROR_NO_ERROR, details: {} }     // last error { errCode, details: {} }
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case constants.SET_STATE:
      if (constants.DEBUG_OUTPUT) {
        logging.deb({action});
      }
      return { ...state, ...action.params };
    case constants.SET_INFO:
      if (constants.DEBUG_OUTPUT) {
        logging.deb({action});
      }
      return { ...state, info: action.info };
    case constants.SET_CURRENT_TIME:
      if (constants.DEBUG_OUTPUT) {
        logging.deb({action});
      }
      return { ...state, currentTime: action.currentTime };
    default:
        return state;
  }
}
