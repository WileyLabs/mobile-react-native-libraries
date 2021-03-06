import * as constants from './constants';
import { log } from './utils';

const initialState = {
  info: constants.defaultInfo,          // playback info
  sound: undefined,                     // sound object
  isMounted: false,                     // true if component mounted (initialized by mountRequest)
  isPlaying: false,                     // true if playback is in progress (approximately)
  isPaused: false,                      // true if playback is paused
  currentTime: 0.0,                     // current playing time (isPlaying: true)
  volume: { mute: false, level: 1.0 },  // current volume
  error: { errCode: constants.ERROR_NO_ERROR, details: { error: undefined } },    // last error { errCode, details: {} }
  options: { updateFrequency: constants.DEFAULT_UPDATE_MS, logLevel: 0 }
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case constants.SET_STATE:
      state.options.logLevel > 1 && log({action});
      return { ...state, ...action.params };
    case constants.SET_INFO:
      state.options.logLevel > 1 && log({action});
      return { ...state, info: action.info };
    case constants.SET_CURRENT_TIME:
      state.options.logLevel > 1 && log({action});
      return { ...state, currentTime: action.currentTime };
    case constants.SET_VOLUME:
      state.options.logLevel > 1 && log({action});
      return { ...state, volume: { ...state.volume, ...action.volume }};
    default:
        return state;
  }
}
