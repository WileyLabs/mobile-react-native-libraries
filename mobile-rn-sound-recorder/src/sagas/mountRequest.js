import { put, takeEvery, select } from 'redux-saga/effects';
import { Platform, PermissionsAndroid } from 'react-native';
import * as constants from '../constants';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { logging, generate, fs, helpers } from '../utils';

// Requests permissions to use microphone for Android
async function _checkPermission(state) {
  if (Platform.OS !== 'android') {
    return Promise.resolve(true);
  }
  const rationale = {
    'title': state.dictionary.get('titleMicrophonePermission', 'Microphone Permission'),
    'message': state.dictionary.get('msgMicrophonePermission', 'Application needs access to your microphone so you can record audio')
  };
  return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
    .then((result) => {
      if (constants.DEBUG_OUTPUT) {
        console.log('Permission result:', result);
      }
      return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
    });
}

/**
 * Initialize (Mount) Component
 * @param {options.audioSettings} audio settings (optinal)
 * @param {options.lang} language 'eng' or 'ger' (optinal, by default 'eng')
 * @param @param {options.wordsMap} words Map(key, value) (optinal, used for PermissionsAndroid.request)
*/
function* _mountRequest(action) {

  if (constants.DEBUG_OUTPUT) {
    logging.log({action});
  }

  // Reset all states
  const state = { isMounted: false,
                  isRecording: false,
                  isReadyToSave: false,
                  currentTime: 0.0,
                  hasPermission: undefined,
                  error: constants.ERROR_NO_ERROR,
                  recordingFile: ''
  };

  yield put(actions.setState(state));

  // Set dictionary for string constants
  const lang = action.options.lang !== undefined ? action.options.lang : 'eng';
  const dictionary = (lang === 'ger') ? constants.dictionaryGerman : constants.dictionaryEnglish;
  dictionary.update(action.options.wordsMap);
  yield put(actions.setState({ dictionary }));

  // Check & update permissions
  let hasPermission = yield _checkPermission(yield select(selectors.getState));
  yield put(actions.setState({ hasPermission }));

  if (!hasPermission) {
    yield put(actions.onError(helpers.buildError(constants.ERROR_NOT_PERMITTED, new Error('No recording permissions granted'))));
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
