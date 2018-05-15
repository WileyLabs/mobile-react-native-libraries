import * as constants from './constants';
import { logging } from './utils';

export const defaultInfo = {
  name: '',                   // file name (generated)
  path: '',                   // path to the file
  size: 0.0,                  // resulting file size in bytes
  duration: 0.0,              // sound duration in secs
  userData: {}                // data provided by the User as payload for saveAsFileRequest action
};

const initialState = {
  info: defaultInfo,          // last recording info
  hasPermission: undefined,   // current microphone access permission
  audioSettings: undefined,   // current audio settings (either provided by the User or default)
  isMounted: false,           // true if component mounted (initialized by mountRequest)
  isRecording: false,         // true if recording is in progress (currentTime updated appx one per 0.3 sec)
  isReadyToSave: false,       // true if last recording was successfully finished and ready to be saved
  currentTime: 0.0,           // current recording time (isRecording: true)
  error: { errCode: constants.ERROR_NO_ERROR, details: {} },    // last error { errCode, details: {} }
  recordingFile: '',          // temporary file name for current recording
  dictionary: undefined,      // dictionary (user-defined or default)
  options: { updateFrequency: constants.DEFAULT_UPDATE_MS, logLevel: 0 }
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case constants.SET_STATE:
    if (state.options.logLevel > 1) {
        logging.deb({action});
      }
      return { ...state, ...action.params };
    case constants.SET_INFO:
    if (state.options.logLevel > 1) {
        logging.deb({action});
      }
      return { ...state, info: action.info };
    case constants.SET_CURRENT_TIME:
      return { ...state, currentTime: action.currentTime };
    default:
        return state;
  }
}
