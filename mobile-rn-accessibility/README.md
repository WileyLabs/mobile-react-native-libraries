# mobile-rn-accessibility

A helper module to support accessibility.

Version 0.0.15, 2018/11/28

## Module Public Interfaces

### Constants

```

    NAME                - component name (for reducer)
    ON_SCREEN_CHANGED   - notification that accessibility screen has changed
```

### Action Creators

#### Initialize accessibility functionality for the Application
```
Implementation in mobile-rn-accessibility >>>>>

/**
 * Initializes component (should be called first)
 * @param options.logLevel logging level (0 - no debug info, default; 1; 2 - wordy log)
 * @param options.debug emulate VoiceOver On for iOS (a11yStatus always returns true)
 */
a11y.a11yInit(options)

Usage in appSaga.js >>>>>

import a11y from 'mobile-rn-accessibility'

function* saga() {
  ...
  yield put(a11y.a11yInit({logLevel: 1, debug: false}));
  ...
}
```
#### Pass current screen to accessibility
```
Implementation in mobile-rn-accessibility >>>>>

/**
 * Passes current screen to Accessibility
 * @param screen name of the current screen
 * @param method navigation method (jumpTo, push, pop, immediatelyResetRouteStack)
 * @param sender name of the sender (for debugging purposes)
 */
a11y.a11yNavigate(screen, method = 'jumpTo', sender = '')

Usage in app.js >>>>>

import a11y from 'mobile-rn-accessibility'

When navigating between application screens:

a11y.a11yNavigate('Home');

When showing popup:

  a11y.a11yNavigate('NotificationDlg', 'push'); // on componentDidMount()
  ....
  a11y.a11yNavigate('NotificationDlg', 'pop');  // on componentWillUnmount()
  ```

#### Track of the accessibility screens changes
  ```
Implementation in mobile-rn-accessibility >>>>>

/**
 * Notifies on Accessibility screen change
 * @param screen name of the current screen
 */
export const onScreenChanged = screen => ({ type: constants.ON_SCREEN_CHANGED, screen });

Usage in app.js >>>>>

import a11y from 'mobile-rn-accessibility'

function* _watchOnScreenChanged() {
  while (true) {
    const screen = yield take(a11y.ON_SCREEN_CHANGED);
    yield put(onScreenChanged(screen)); // application-specific event on Screen Changed
  }
}

```

### Selectors
```
import a11y from 'mobile-rn-accessibility'

a11y.a11yScreen()      - name of current accessibility screen
a11y.a11yStatus()      - true if accessibility (VoiceOver/TalkBack) is ON

```

### Accessibility helpers

```

/**
 * Sets accessibility focus on element
 * @param elem Element
 * @param options.name element name (optional)
 * @param options.silent false to switch on logging and error reporting
 * @param options.verify function to be called just before sendAccesibilityEvent to verify that elem exists (Android, rn 0.56+)
 */
function setFocus(elem, { name = '', silent = true, verify = () => true})

/**
 * Posts accessibility focus
 * @param elem Element
 * @param options.name element name (optional)
 * @param options.timeout post timeout 
 * @param options.silent false to switch on logging
 * @param options.verify function to be called by setFocus to verify that elem exists ('mounted' on Android, rn 0.56+)
 */
function postFocus(elem, { name = '', timeout = 333, silent = true, verify = () => true } )

Android/RN 0.56 note: JSX component should be mounted at the times of setFocus() call;
                      if you are not sure that component is mounted - verify state with options.verify() function,
                      otherwise the program will crash on Android/RN 0.56

/**
 * Returns accessibility properties for JSX element
 * 
 * @param accessible true if element accessible
 * @param params.type element's type (one of 'button', 'text', 'checkbox' etc)
 * @param params.name element's name (e.g. text on button)
 * @param params.value element's value (e.g. 1 for switch, 20 for slider etc)
 * @param params.label element's label (overrides name/type pair)
 * @param params.disabled true if element is disabled
 * @param params.focus function to be called on ref to set accessiblity focus
 * @param params.object object type (e..g. 'view', 'modal')
 * @param params.traits special value for 'accessibilityTraits' (iOS)
 * @param params.hidden special value for 'accessibilityElementHidden' (iOS)
 * @param params.important spacial value for 'importantForAccessibility'; (Android)
 * @param params properties to add to a11yProps (e.g. a11yStatus)
 */
 function a11yProps(
  accessible,
  params = { type: '', name: '', value: '', label: '', disabled: 0, focus: 0,
             object: '', traits: '', hidden: false, important: undefined },
  addProps);


[TBC]

```
#### Usage
```javascript

import a11y from 'mobile-rn-accessibility'

** To add accessibility properties to the JSX element
<JSX.Element {...a11y.a11yProps(accessible, { object: 'view' })} />

** To set postponed focus on JSX element (preferable)
<JSX.Element ref={ elem => a11y.postFocus(elem, { verify: () => this.mounted }) } />

** To immediately set focus on JSX element
<JSX.Element ref={ elem => a11y.setFocus(elem) } />

** To pass accessibility elements to children
<JSX.Element>
  {a11y.cloneChildrenWithProps(this.props.children, { accessible: this.props.accessible })}
</JSX.Element>

```

## Getting started

### Step 1. Install mobile-rn-accessibility

```
$ npm install mobile-rn-accessibility --save
# or with yarn
$ yarn add mobile-rn-accessibility
```

### Step 2. Install TalkBack support for Android

In order to use TalkBack on Android emulator it is necessary to install TalkBack apk.
Follow instructions provided at https://play.google.com/store/apps/details?id=com.google.android.marvin.talkback

## Project Integration (2 steps)

### Step 1. Add accessibility reducer to the root reducer
```javascript
import { combineReducers } from 'redux';
import a11y from 'mobile-rn-accessibility';

const rootReducer = combineReducers({
  ...
   [a11y.NAME]: a11y.reducer
});

export default rootReducer;
```

### Step 2. Initialize & run accessibility saga
```javascript
import a11y from 'mobile-rn-accessibility';

export default function* rootSaga() {
  yield all([
    ...
    a11y.saga()
  ]);
}
```

## Usage in React Native components

```javascript

import Accessibility from './Accessibility';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import a11y from 'mobile-rn-accessibility';

function mapStateToProps(state) {
  return {
    a11yStatus: a11y.a11yStatus(state),
    a11yScreen: a11y.a11yScreen(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    a11yInit: a11y.a11yInit,
    a11yNavigate: a11y.a11yNavigate
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Accessibility);
```

## Usage in JSX components

TBD
