# mobile-rn-device-orientation

A helper module to manage your device orientation state in Redux-saga.

Version 0.0.7, 2023/07/24

### Latest changes

ver 0.0.7 Use react-native-orientation-locker instead of outdated react-native-orientation

ver 0.0.6 Module API simplified

ver 0.0.5 Removed specific orientation for Android as react-native-orientation with RN 0.56 does not support it
          https://github.com/yamill/react-native-orientation/issues/308

## Module Public Interfaces

### Constants

```javascript
  NAME                    - component name (for reducer)
  ON_ORIENTATION_CHANGED  - notification on orientation change
```

### Lock orientation Action

```javascript
export const lockOrientationRequest = (landscape, rotated) => ({
  type: constants.LOCK_ORIENTATION_REQUEST,
  landscape,
  rotated
});
```

### Notification Action

```javascript
// Notifications
export const onOrientationChanged = (landscape, rotated) => ({
  type: constants.ON_ORIENTATION_CHANGED,
  landscape,
  rotated
});
```

### Selectors

```javascript
export const getDeviceOrientation = state => state[NAME].status ? (state[NAME].status.landscape ? 'LANDSCAPE' : 'PORTRAIT') : undefined;
export const isLandscape = state => state[NAME].status ? state[NAME].status.landscape : undefined;
export const isRotated = state => state[NAME].status ? state[NAME].status.rotated : undefined;
```

### Module API

```javascript
  /**
   * Lock device orientation
   * [param] landscape true for LANDSCAPE, false for PORTRAIT
   * [param] rotated (optional) true for Upside-down (PORTRAIT)/for Landscape-left (LANDSCAPE)
   * **rotated param maybe not supported on some devices
  */
  lock(landscape, rotated);
  
  /**
   * Unlock all previously locked orientationsn
  */
  unlock()
  
  /**
   * Returns current orientation parameters
  */
  const orientationParams = getParams()
  const { landscape, rotated } = orientationParams;

  /**
   * Backward compatibility
  */
  lockToPortrait()        /** lock orientation to PORTRAIT */
  lockToLandscape()       /** lock orientation to LANDSCAPE */
  unlockAllOrientations() /** unlock all previously locked orientations */

```

## Getting started

### Step 1. Install react-native-orientation-locker

```
$ npm install react-native-orientation-locker --save
# or with yarn
$ yarn add react-native-orientation-locker
```

### Step 2. Follow instructions from [react-native-orientation-locker](https://github.com/wonday/react-native-orientation-locker)

## Initialization (2 steps)

**Step 1. Add Reducer**

```javascript
// rootReducer.js
import { combineReducers } from 'redux';
import deviceOrientation from 'mobile-rn-device-orientation';

const rootReducer = combineReducers({
  ...
  [deviceOrientation.NAME]: deviceOrientation.reducer
  ...
};

export default rootReducer;
```
or

```javascript
import { reducer as deviceOrientationReducer,
         constants as deviceOrientationConstants } from 'mobile-rn-device-orientation';

const rootReducer = combineReducers({
  ...
  [deviceOrientationConstants.NAME]: deviceOrientationReducer
  ...
};

```
**Step 2. Add Saga**

```javascript
// rootSaga.js

import { all, call } from 'redux-saga/effects';
import { saga as deviceOrientationSaga } from 'mobile-rn-device-orientation';

export default function* rootSaga() {
  yield all([
    ...
   //  Step 2. Register deviceOrientationSaga
    call(deviceOrientationSaga),
    ...
  ]);
}
```
or
```javascript
import deviceOrientation from 'mobile-rn-device-orientation';

export default function* rootSaga() {
  yield all([
    ...
    call(deviceOrientation.saga),
    ...
  ]);
}
```


## Usage 

**Sagas**

Lock orientation with Redux Action
```javascript
// features/app/sagas/initAppRequest.js

import { put, takeEvery } from 'redux-saga/effects';
import { INIT_APP_REQUEST } from '../constants';
import { actions as deviceOrientationActions } from 'mobile-rn-device-orientation';

function* _initAppRequest({ navigator }) {
  console.log('----saga app._initAppRequest saga-----');

  ...
  // Lock orientation to PORTRAIT
  yield put(deviceOrientationActions.lockOrientationRequest(false));

  ... 

  // Unlock all orientations
  yield put(deviceOrientationActions.lockOrientationRequest());

  ...
}

export function* watchInitAppRequest() {
  yield takeEvery(INIT_APP_REQUEST, _initAppRequest);
}

```
Track changes in current orientation
```javascript
// features/app/sagas/onOrientationChanged.js

import { put, takeEvery } from 'redux-saga/effects';
import deviceOrientation from 'mobile-rn-device-orientation';

function* _orientationChanged({ landscape, rotated }) {

  // landscape: true if current mode is LANDSCAPE, false for PORTRAIT
  // rotated: true if your device is rotated: Upside down for PORTRAIT mode, Lanscale-Left for LANDSCAPE mode
  //          false if your device is not rotated: portrait in PORTRAIT mode, Lanscale-Right for LANDSCAPE mode

  // Put your logic here
  ...
}

export function* _watchOnOrientationChanged() {
  yield takeEvery(deviceOrientation.ON_ORIENTATION_CHANGED, _orientationChanged);
}

```

**Function Code**

Lock orientation with module API
```javascript
import deviceOrientation from 'mobile-rn-device-orientation';

/**
 * Lock to PORTRAIT
 * export const lock = (landscape, rotated) => {}
*/
deviceOrientation.lock(false);

// or

deviceOrientation.lockToPortrait();
.....

/** Unlock all previously locked orientations */

deviceOrientation.unlock();

// or

deviceOrientation.unlockAllOrientations();

/** Get current orientation */

const { landscape, rotated } = deviceOrientation.getParams();


```

**React Native components**

Containers
```javascript
// HomeContainer.js

import Home from './Home';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectors as deviceOrientationSelectors } from 'mobile-rn-device-orientation';

function mapStateToProps(state) {
  return {
    ...
    /** true if your device is in landscape orientation; otherwise returns false; */
    landscape: deviceOrientationSelectors.isLandscape(state),
    ...
    /** 
     * true if your device is rotated: Upside down for PORTRAIT mode, Lanscale-Left for LANDSCAPE mode
     * false if your device is not rotated: portrait in PORTRAIT mode, Lanscale-Right for LANDSCAPE mode
    */ 
    rotated: deviceOrientationSelectors.isRotated(state),
    ...
    /** string, one of: "LANDSCAPE", "PORTRAIT" or undefined */
    deviceOrientation: deviceOrientationSelectors.getDeviceOrientation(state)
    ...
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...
    ...
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);


```

eof
