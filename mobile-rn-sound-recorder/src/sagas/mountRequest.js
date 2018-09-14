import { put, takeEvery, select } from 'redux-saga/effects';
import { Platform, PermissionsAndroid } from 'react-native';
import * as constants from '../constants';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { log, generate, fs, helpers } from '../utils';

// Requests permissions to use microphone for Android
async function _checkPermission(state) {
  if (Platform.OS !== 'android') {
    return Promise.resolve(true);
  }
  const rationale = {
    'title': helpers.getField(state, 'dictionary.titleMicrophonePermission', 'Microphone Permission'),
    'message': helpers.getField(state, 'dictionary.msgMicrophonePermission', 'Application needs access to your microphone so you can record audio')
  };
  return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
    .then((result) => {
      if (state.options.logLevel > 0) {
        log('Permission result:', result);
      }
      return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
    });
}

/**
 * Initialize (Mount) Component
 * @param {options.audioSettings} audio settings (optinal)
 * @param {options.dictionary} words
 * @param @param {options.logLevel} logging level
*/
function* _mountRequest(action) {

  helpers.getField(action, 'options.logLevel', (yield select(selectors.getOptions)).logLevel) >= 2 && log({action});

  // Reset all states
  const state = { isMounted: false,
                  isRecording: false,
                  isReadyToSave: false,
                  currentTime: 0.0,
                  hasPermission: undefined,
                  error: constants.ERROR_NO_ERROR,
                  recordingFile: '',
                  dictionary: helpers.getField(action, 'options.dictionary'),
                  options: {...action.options}
  };

  yield put(actions.setState(state));

  // Check & update permissions
  let hasPermission = yield _checkPermission(yield select(selectors.getState));
  yield put(actions.setState({ hasPermission }));
  if (!hasPermission) {
    const error = helpers.getField(state, 'dictionary.msgNoPermission', 'No recording permissions granted');
    yield put(actions.onError(helpers.buildError(constants.ERROR_NOT_PERMITTED, new Error(error))));
    return;
  }

  // Set Audio Settings (user-provided or default for platform)
  const audioSettings = action.options.audioSettings === undefined ? (Platform.OS === 'ios' ? constants.iosAudioSettings : constants.androidAudioSettings) :
                        action.options.audioSettings;

  // Update state
  yield put(actions.setState({ isMounted: true,
                                hasPermission: true,
                                recordingFile: fs.getTempFile(generate.guid() + '.tmp'),
                                audioSettings
                              }));

}

export function* watchMountRequest() {
  yield takeEvery(constants.MOUNT_REQUEST, _mountRequest);
}
