# mobile-rn-utils

A collection of helper modules for react native applications.

# Installation

```bash
yarn add mobile-rn-utils
```
or
```bash
npm install mobile-rn-utils --save
```

## alert

alert - a helper module for redux-saga; it wraps react native [Alert.alert()](https://facebook.github.io/react-native/docs/alert.html) to use within sagas (generator functions). It exports two functions: alert() and confirm().

### alert Usage

### `import { alert, confirm } from 'mobile-rn-utils/alert'`

```javascript
// Example 1 - alert() usage in saga
//
import { call, takeLatest } from 'redux-saga/effects';
import { alert } from 'mobile-rn-utils/alert';
import { ON_APP_ERROR } from './constants';

function* _onAppError(action) {
  console.log('----saga _onAppError saga----');

  yield call(alert, action.title, action.message);
}

export function* watchOnAppError() {
  yield takeLatest(ON_APP_ERROR, _onAppError);
}

// Example 2 - confirm() usage in saga
//
import { call, takeLatest } from 'redux-saga/effects';
import { confirm } from 'mobile-rn-utils/alert';
import { ON_DELETE_REQUEST } from './constants';

function* _onDeleteRequest(action) {
  console.log('----saga _onDeleteRequest saga----');

  const isDeleteConfirmed = yield call(confirm, 'Delete', `Do you really want to delete ${action.name}?`);
  
  if (isDeleteConfirmed) {
    // Delete logic goes here
  }
}

export function* watchOnDeleteRequest() {
  yield takeLatest(ON_DELETE_REQUEST, _onDeleteRequest);
}
```

### alert API

### `alert(title: string, message: string, okButtonTitle?: string = 'OK'): Promise<void>`

Displays react native Alert.alert() with given title, message, and one 'positive' button. Returns nothing.

### `confirm(title: string, message: string, confirmButtonTitle?: string = 'OK', cancelButtonTitle?: string = 'Cancel'): Promise<boolean>`

Displays react native Alert.alert() with given title, message, and two buttons (one 'positive' and one 'negative'). If user press 'positive' button, returns true. Otherwise returns false.

## constants

constants - a collection of useful constants

### constants Usage

```javascript
import { isAndroid } from 'mobile-rn-utils/constants'

if (isAndroid) {
  // Android specific rendering goes here
}
```

### constants API

- `isAndroid: string` true if device is Android
- `isIOS: string` true if iOS device
- `deviceWidth: number` Device screen width (does not depend on the current device orientation)
- `deviceHeight: number` Device screen height (does not depend on the current device orientation)
- `isSmallScreen: boolean` true if device has small screen
- `isShortScreen: boolean` true is device has short screen
- `monospaceFontFamily: string` "Courier" font family on iOS and 'monospace" font family on Android
- `baselineDeviceWidth: number` iPhone 5 screen width
- `baselineDeviceHeight: number` iPhone 5 screen height

## scaleUtils

scaleUtils - a collection of helper functions for responsive UI

### scaleUtils Usage

### `import { scale, verticalScale, moderateScale, widthFromPercentage, heightFromPercentage } from 'mobile-rn-utils/scaleUtils'`

```javascript
  const responsiveWidth = scale(60);
  const responsiveHeight = verticalScale(120);
  const padding = moderateScale(5);

  const width = widthFromPercentage('95%');
  const height = heightFromPercentage('33%');
```

### scaleUtils API

### `scale(size: number): number`

Scale input parameter size based on the current device screen width.

### `verticalScale(size: number): number`

Scale input parameter size based on the current device screen height.

### `moderateScale(size: number, factor: number = 0.5): number`

Scale input parameter based on the current device screen width and additionally provided scale factor

### `widthFromPercentage(widthInPercent: string): number`

Translate given width in percent to width in pixels

### `heightFromPercentage(heightInPercent: string): number`

Translate given height in percent to height in pixels

## hocs -  a collection of Higher-Order Components

withSize - a HOC that will dispatch onLayout method and pass to the wrapped component x, y, width, height via props (the x and y values are relative to the top left corner of the screen)

### withSize Usage

```javascript
import withSize from 'mobile-rn-utils/hocs/withSize'

// EnhancedComponent will receive x, y, with, height via props
const EnhancedComponent = withSize(WrappedComponent);
```
