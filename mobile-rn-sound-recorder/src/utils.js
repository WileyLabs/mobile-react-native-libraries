import { NAME } from './constants.js';
import logging from './utils/logging.js';
import helpers from './utils/helpers.js';
import generate from './utils/generate.js';
import fs from './utils/fs.js';
import gui from './utils/gui.js';

// submodules
export {
  logging,
  helpers,
  generate,
  gui,
  fs
};

export const log = logging.logff.bind(logging.logff, {name: `[${NAME}] `, space: ' '});

export const getSourceUri = (info) => {
  try {
    return helpers.isDefined(info.basePath) ? fs.buildPath(info.basePath, info.uri) : info.uri;
  }
  catch (err) {
  }
  return '';
};

// functions
export const publicUtils = {
  getSourceUri
};

export default publicUtils;

