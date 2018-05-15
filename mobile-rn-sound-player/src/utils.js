import logging from './utils/logging.js';
import helpers from './utils/helpers.js';
import generate from './utils/generate.js';
import fs from './utils/fs.js';
import Dictionary from './utils/dictionary.js';

// submodules
export {
  logging,
  helpers,
  generate,
  fs
};

// classes
export {
  Dictionary
};

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


