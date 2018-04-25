import { eventChannel } from 'redux-saga';
import { call, put, take, takeEvery } from 'redux-saga/effects';
import { AppState } from 'react-native';
import { INIT_REQUEST } from '../constants';
import { setAppState, onAppStateChange } from '../actions';

function createEventChannel() {
  return eventChannel(emitter => {
    const appStateDidChange = nextAppState => emitter(nextAppState);
    AppState.addEventListener('change', appStateDidChange);
    return () => AppState.removeEventListener('change', appStateDidChange);
  });
}

function* _setInitialAppState() {
  const appState = AppState.currentState;
  console.log(`Application state = ${appState}`);
  yield put(setAppState(appState));
}

function* _initRequest() {
  console.log('----saga appState._initRequest saga----');

  yield call(_setInitialAppState);

  const channel = yield call(createEventChannel);

  while (true) {
    const appState = yield take(channel);
    console.log(`Application state = ${appState}`);
    yield put(setAppState(appState));
    yield put(onAppStateChange(appState));
  }
}

export function* watchInitRequest() {
  yield takeEvery(INIT_REQUEST, _initRequest);
}
