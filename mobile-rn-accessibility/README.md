# mobile-rn-accessibility

A helper module to support accessibility.

Version 0.0.10, 2018/08/27

## Module Public Interfaces

### Constants

```

    NAME        - component name (for reducer)

```

### Action Creators

```
import a11y from 'mobile-rn-accessibility'

Init/Shut

/**
 * Initializes component (should be called first)
 * @param options.logLevel logging level (0 - no debug info, default; 1; 2 - wordy log)
 * @param options.debug emulate VoiceOver On for iOS
 */
a11y.a11yInit(options)

Redux/Saga:

  export function* saga() {
    yield put(a11y.a11yInit({logLevel: 1, debug: true}));
  }

Navigation

/**
 * Passes current screen to Accessibility
 * @param screen name of the current screen
 * @param method navigation method (jumpTo, push, pop, immediatelyResetRouteStack)
 * @param sender name of the sender (for debugging purposes)
 */
a11y.a11yNavigate(screen, method = 'jumpTo', sender = '')

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
