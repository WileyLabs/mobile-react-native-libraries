import reducer from './src/reducer';
import saga from './src/sagas';
import actions from './src/actions';
import selectors from './src/selectors';
import constants from './src/constants';
import utils from './src/utils';
import logging from './src/utils/logging.js';

const { a11yProps, a11yLabel, setFocus, postFocus, cloneChildrenWithProps, addLabel, addClassAttribute,
        readRomanNumber, getDateTime, getDuration, Locker } = utils;
const { NAME } = constants;
const { navigateRequest: a11yNavigate, initRequest: a11yInit } = actions;
const { getStatus: a11yStatus, getScreen: a11yScreen } = selectors;

// Exported components, functions & constants
const components = {
  // list of components
  reducer, saga, actions, selectors, constants, utils,
  // direct access to functions & constants
  NAME,
  a11yNavigate, a11yInit, a11yScreen, a11yStatus, a11yProps, a11yLabel, setFocus, postFocus,
  // html
  addLabel, addClassAttribute,
  // helpers
  cloneChildrenWithProps, readRomanNumber, getDateTime, getDuration, Locker,
  logging
};

export default components;
