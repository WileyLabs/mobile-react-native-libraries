import reducer from './src/reducer';
import saga from './src/sagas';
import actions from './src/actions';
import selectors from './src/selectors';
import constants from './src/constants';
import utils from './src/utils';

const { a11yProps, a11yLabel, setFocus, postFocus, cloneChildrenWithProps, addLabel, addClassAttribute,
        readRomanNumber, getDateTime, getDuration } = utils;
const { NAME } = constants;
const { navigateRequest: a11yNavigate, initRequest: a11yInit } = actions;
const { getStatus: a11yStatus, getScreen: a11yScreen } = selectors;

const components = {
  // list of components
  reducer, saga, actions, selectors, constants, utils,
  // direct access to functions & constants
  NAME,
  a11yNavigate, a11yInit,
  a11yProps, a11yLabel, setFocus, postFocus, cloneChildrenWithProps, addLabel, addClassAttribute,
  readRomanNumber, getDateTime, getDuration,
  a11yStatus, a11yScreen
};

export default components;
