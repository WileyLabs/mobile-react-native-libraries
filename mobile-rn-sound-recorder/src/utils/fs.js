import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { logging as console } from './logging.js';
import { helpers } from './helpers.js';

export const PATH_BUNDLE    = ':bundle';
export const PATH_DOCUMENT  = ':document';
export const PATH_TEMP      = ':temp';
export const PATH_DATA      = ':data';

// Parses special path names
export function parsePath(path) {
  const pathNames = [PATH_BUNDLE, PATH_DOCUMENT, PATH_DATA, PATH_TEMP];
  const pathFuncs = [ fs.getBundleFile, fs.getDocumentFile, fs.getDataFile, fs.getTempFile ];
  const index = pathNames.indexOf(path);
  return index < 0 ? path : pathFuncs[index]();
}

// Builds path from arguments
export function buildPath() {
  return [...arguments].reduce((full, arg) => {
    if (helpers.isDefined(arg)) {
      let elem = parsePath(arg);
      if (elem.endsWith('/')) {
        elem = elem.slice(0, elem.length - 1);
      }
      full += helpers.isDefined(elem) ? ((full.length ? '/' : '') + elem) : '';
    }
    return full;
  }, '' );
}

// Returns full path to the application bundle file (or bundle directory)
export function getBundleFile(file) {
  return buildPath(Platform.OS === 'ios' ? RNFS.MainBundlePath : 'file:///android_asset', file);
}

// Returns full path to the application document file
export function getDocumentFile(file) {
  return buildPath(RNFS.DocumentDirectoryPath, file);
}

// Returns full path to the temporary file
export function getTempFile(file) {
  return buildPath(Platform.OS === 'ios' ? RNFS.TemporaryDirectoryPath : RNFS.CachesDirectoryPath, file);
}

// Returns full path to the data file
export function getDataFile(file) {
  return buildPath(Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath + '/Data' : RNFS.DocumentDirectoryPath, file);
}

// Reads file information
// @return RNFS file statistics object on success, { size: -1 } otherwise
export async function awaitGetFileStats(name, silent = true) {
  return await RNFS.stat(name).catch(err => {
    if (!silent) {
      console.log(err.message);
    }
    return { size: -1 }; // error reading file stats
  });
}

// Reads file, returns text on success, empty string otherwise
export async function awaitReadFile(name, silent = true) {
  return await RNFS.readFile(name)
    .catch(err => { if (!silent) {
                      console.log(err.message);
                    }
                    return '';
                  });
}

// Writes file, returns true on success, false otherwise
export async function awaitWriteFile(name, data, encoding = 'utf8', silent = true) {
  return await RNFS.writeFile(name, data, encoding).then(success => true)
    .catch(err => { if (!silent) {
                      console.log(err.message);
                    }
                    return false;
                  });
}

// Copies file
export async function awaitCopyFile(src, dst, silent = true) {
  return await RNFS.copyFile(src, dst).then(success => true)
    .catch(err => { if (!silent) {
                      console.log(err.message);
                    }
                    return false;
                  });
}

// Moves file
export async function awaitMoveFile(src, dst, silent = true) {
  return await RNFS.moveFile(src, dst).then(success => true)
    .catch(err => { if (!silent) {
                      console.log(err.message);
                    }
                    return false;
                  });
}

export async function awaitDeleteFile(file, silent = true) {
  return await RNFS.unlink(file).then(success => true)
    .catch(err => { if (!silent) {
                      console.log(err.message);
                    }
                    return false;
                  });
}

// Reads bundle file, returns text on success, empty string otherwise
export async function awaitReadBundleFile(name) {
  return Platform.OS === 'ios' ?
    awaitReadFile(getBundleFile(name)) : RNFS.readFileAssets(name).catch(err => { console.log(err.message); return '';});
}

// Reads html file from bundle
export async function awaitReadBundleHtml(uri) {
  try {
    const baseUrl = Platform.OS === 'ios' ?
      uri.slice(0, uri.lastIndexOf('/')) : 'file:///android_asset/' + uri.slice(0, uri.lastIndexOf('/') + 1);
    const html = await awaitReadBundleFile(uri);
    return { uri, baseUrl, html };
  }
  catch (err) {
  }
  return { uri, baseUrl: '', html: ''};
}

export const fs = {
  buildPath,
  parsePath,
  getBundleFile,
  getDocumentFile,
  getTempFile,
  getDataFile,
  awaitGetFileStats,
  awaitReadFile,
  awaitWriteFile,
  awaitCopyFile,
  awaitMoveFile,
  awaitDeleteFile,
  awaitReadBundleFile,
  awaitReadBundleHtml,
  PATH_BUNDLE,
  PATH_DOCUMENT,
  PATH_DATA,
  PATH_TEMP
};

export default fs;
