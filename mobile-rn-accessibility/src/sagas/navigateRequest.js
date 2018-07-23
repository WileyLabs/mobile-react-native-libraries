import { put, select, take, actionChannel, call } from 'redux-saga/effects';
import * as selectors from '../selectors';
import * as actions from '../actions';
import * as constants from '../constants';

// Calculates parameters for 'push' navigation method
function* pushScreen(action, current) {
  if (action.screen === current.screen) {
    return {};
  }
  const stack = current.stack ? current.stack.slice() : [];
  const screen = Array.isArray(action.screen) ? action.screen[action.screen.length - 1] : action.screen;
  stack.push(current.screen);
  return { screen, stack };
}

// Calculates parameters for 'pop' navigation method
function* popScreen(action, current) {
  const stack = current.stack ? current.stack.slice() : [];
  if (!stack.length) {
    return {};
  }
  const screen = stack.length ? stack.pop() : current.screen;
  return { screen, stack };
}

// Calculates parameters for all navigation methods except 'push' and 'pop'
function* navigate(action, current) {
  const screen = Array.isArray(action.screen) ? action.screen[action.screen.length - 1] : action.screen;
  if (screen === current.screen) {
    return {};
  }
  const stack = (current.stack !== undefined && current.stack.length > 0 && (action.method !== 'immediatelyResetRouteStack')) ? current.stack.slice(1) : [];
  return { screen, stack };
}

// Processes Accessibility navigation
function* _processNavigationEvent(action) {
  const screen = yield select(selectors.getScreen);
  const stack = yield select(selectors.getStack);
  const logLevel = (yield select(selectors.getOptions)).logLevel;
  let navigationParams = {};

  if (logLevel >= 2) {
    console.log('[A11Y::Navigation] ', { action });
  }

  try {
    switch (action.method) {
      case 'push':
        navigationParams = yield call(pushScreen, action, {screen, stack});
        break;
      case 'pop':
        if (action.screen && action.screen.length && action.screen !== screen) {
          return;
        }
        navigationParams = yield call(popScreen, action, {screen, stack});
        break;
      default:
        navigationParams = yield call(navigate, action, {screen, stack});
    }
    if (navigationParams.screen !== undefined) {
      yield put(actions.setParams(navigationParams.screen, navigationParams.stack));
      if (logLevel >= 1) {
        console.log('[A11Y::Navigation] Current screen: ' + navigationParams.screen + (navigationParams.stack.length ? '; stack = ' + JSON.stringify(navigationParams.stack) : ''));
      }
    }
  } catch (err) {
    if (logLevel >= 1) {
      console.log('[A11Y::Navigation]', err.message);
    }
  }

 }

// Root accessibility saga
export function* watchNavigation() {
  const channel = yield actionChannel(constants.NAVIGATE_REQUEST);
  while (true) {
    yield* _processNavigationEvent(yield take(channel));
  }
}
