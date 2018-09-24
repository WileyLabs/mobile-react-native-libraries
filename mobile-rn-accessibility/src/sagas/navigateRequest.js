/**
 * Navigation saga
 *
 * Version: 0.0.2, 2018.09.07
 * Created: 2018.03.01 by mmalykh@wiley.com
 * Latest changes:
 *      2018.09.07 0.0.2 Syntax changed
 */
import { put, select, take, actionChannel, call } from 'redux-saga/effects';
import * as selectors from '../selectors';
import * as actions from '../actions';
import * as constants from '../constants';
import logging from '../utils/logging.js';

const log = logging.logff.bind(logging.logff, {name: '[A11Y::Navigation] ', space: ' '});

// Calculates parameters for 'push' navigation method
function* _pushScreen(action, current) {
  if (action.screen === current.screen) {
    return {};
  }
  const stack = current.stack ? current.stack.slice() : [];
  const screen = Array.isArray(action.screen) ? action.screen[action.screen.length - 1] : action.screen;
  stack.push(current.screen);
  return { screen, stack };
}

// Calculates parameters for 'pop' navigation method
function* _popScreen(current) {
  const stack = current.stack ? current.stack.slice() : [];
  return !stack.length ? {} : { screen: stack.length ? stack.pop() : current.screen, stack };
}

// Calculates parameters for all navigation methods except 'push' and 'pop'
function* _navigate(action, current) {
  const screen = Array.isArray(action.screen) ? action.screen[action.screen.length - 1] : action.screen;
  return screen === current.screen ? {} : { screen,
           stack: (current.stack !== undefined && current.stack.length > 0 && (action.method !== 'immediatelyResetRouteStack')) ? current.stack.slice(1) : [] };
}

// Processes Accessibility navigation
function* _processNavigationEvent(action) {
  const screen = yield select(selectors.getScreen);
  const stack = yield select(selectors.getStack);
  const logLevel = (yield select(selectors.getOptions)).logLevel;
  let navigationParams = {};
  logLevel >= 2 && log(action);
  try {
    switch (action.method) {
      case 'push':
        navigationParams = yield call(_pushScreen, action, {screen, stack});
        break;
      case 'pop':
        if (action.screen && action.screen.length && action.screen !== screen) {
          return;
        }
        navigationParams = yield call(_popScreen, {screen, stack});
        break;
      default:
        navigationParams = yield call(_navigate, action, {screen, stack});
    }
    if (navigationParams.screen !== undefined) {
      yield put(actions.setParams(navigationParams.screen, navigationParams.stack));
      logLevel >= 1 && log(navigationParams);
    }
  } catch (err) {
    logLevel >= 1 && log(err.message);
  }

 }

// Navigation saga
export function* watchNavigation() {
  const channel = yield actionChannel(constants.NAVIGATE_REQUEST);
  while (true) {
    yield* _processNavigationEvent(yield take(channel));
  }
}
