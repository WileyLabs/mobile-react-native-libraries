import { eventChannel } from 'redux-saga';
import { call, put, take, takeEvery, race } from 'redux-saga/effects';
import Orientation from 'react-native-orientation';
import { setOrientation, setSpecificOrientation, onOrientationChange, onSpecificOrientationChange,
         lockOrientation, lockSpecificOrientation, setSilent } from '../actions';
import { INIT_REQUEST, log } from '../constants';

// Creates orientation listener
function _createOrientationListener() {
  return eventChannel(emitter => {
    const orientationDidChange = orientation => emitter(orientation);
    Orientation.addOrientationListener(orientationDidChange);
    return () => Orientation.removeOrientationListener(orientationDidChange);
  });
}

// Creates specific orientation listener
function _createSpecificOrientationListener() {
  return eventChannel(emitter => {
    const orientationDidChange = orientation => emitter(orientation);
    Orientation.addSpecificOrientationListener(orientationDidChange);
    return () => Orientation.removeSpecificOrientationListener(orientationDidChange);
  });
}

// Creates initial specific orientation listener
function _createGetSpecific() {
  return eventChannel(emitter => {
    const cb = (err, orientation) => { !err && emitter(orientation); };
    Orientation.getSpecificOrientation(cb);
    return () => {};
  });
}

function* _initRequest(action) {
  yield put(setOrientation(Orientation.getInitialOrientation()));
  yield put(setSpecificOrientation(yield take(_createGetSpecific())));
  const { options } = action;
  const silent = !options || options.silent !== false;
  const channels = [yield call(_createOrientationListener), yield call(_createSpecificOrientationListener)];
  yield put(setSilent(silent));
  options && options.lockSpecificOrientation && (yield put(lockSpecificOrientation(options.lockSpecificOrientation)));
  options && options.lockOrientation && (yield put(lockOrientation(options.lockOrientation)));
  while (true) {
    const [ orientation, specificOrientation ] = yield race([take(channels[0]), take(channels[1])]);
    try {
      orientation && (yield put(onOrientationChange(orientation)));
      specificOrientation && (yield put(onSpecificOrientationChange(specificOrientation)));
    }
    catch (err) {
      silent || log(err.message);
    }
  }
}

export function* watchInitRequest() {
  yield takeEvery(INIT_REQUEST, _initRequest);
}
