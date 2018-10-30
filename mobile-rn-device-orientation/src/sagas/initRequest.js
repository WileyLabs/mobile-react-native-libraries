import { eventChannel } from 'redux-saga';
import { call, put, take, takeEvery, race } from 'redux-saga/effects';
import Orientation from 'react-native-orientation';
import { setOrientation, setSpecificOrientation, onOrientationChange, onSpecificOrientationChange,
         lockOrientation, lockSpecificOrientation, setSilent } from '../actions';
import { INIT_REQUEST, log } from '../constants';
import specificOrientationInterface from '../specificOrientation';

const specificOrientation = specificOrientationInterface(Orientation);

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
    specificOrientation.addOrientationListener(orientationDidChange);
    return () => Orientation.removeOrientationListener(orientationDidChange);
  });
}

// Creates initial specific orientation listener
function _createGetSpecific() {
  return !specificOrientation.isSupported() ? undefined :
    eventChannel(emitter => {
      const cb = (err, orientation) => { !err && emitter(orientation); };
      specificOrientation.getOrientation(cb);
      return () => {};
    });
}

function* _initRequest(action) {
  yield put(setOrientation(Orientation.getInitialOrientation()));
  const channel = _createGetSpecific();
  channel && (yield put(setSpecificOrientation(yield take(channel))));
  const { options } = action;
  const silent = !options || options.silent !== false;
  const channels = [yield call(_createOrientationListener), yield call(_createSpecificOrientationListener)];
  yield put(setSilent(silent));
  options && options.lockSpecificOrientation && (yield put(lockSpecificOrientation(options.lockSpecificOrientation)));
  options && options.lockOrientation && (yield put(lockOrientation(options.lockOrientation)));
  while (true) {
    const [ orientationEvent, specificOrientationEvent ] = yield race([take(channels[0]), take(channels[1])]);
    try {
      orientationEvent && (yield put(onOrientationChange(orientationEvent)));
      specificOrientationEvent && (yield put(onSpecificOrientationChange(specificOrientationEvent)));
    }
    catch (err) {
      silent || log(err.message);
    }
  }
}

export function* watchInitRequest() {
  yield takeEvery(INIT_REQUEST, _initRequest);
}
