import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { logging as console } from './logging.js';

// Returns composed path for 'path' & 'file'
export function buildPath(path, file) {
  let fullPath = (path === undefined || path.trim().length === 0) ? '' : path;
  if (fullPath.endsWith('/')) {
    fullPath = fullPath.slice(0, fullPath.length - 1);
  }
  return fullPath.length ? ((file === undefined || file.trim().length === 0) ? fullPath : fullPath + '/' + file) : file;
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

// Returns full path to the cache file
export function getCacheFile(file) {
  return buildPath(Platform.OS === 'ios' ? RNFS.CachesDirectoryPath : RNFS.DocumentDirectoryPath, file);
}

// Reads file information
export async function awaitGetFileStats(name, silent = true) {
  return await RNFS.stat(name).catch(err => {
    if (!silent) {
      console.log(err.message);
    }
    return undefined;
  });
}

// Reads file, returns text on success, empty string otherwise
export async function awaitReadFile(name) {
  return await RNFS.readFile(name).catch(err => { console.log(err.message); return ''; });
}

// Writes file, returns true on success, false otherwise
export async function awaitWriteFile(name, data, encoding = 'utf8') {
  return await RNFS.writeFile(name, data, encoding).then(success => true).catch(err => { console.log(err.message); return false; });
}

// Copies file
export async function awaitCopyFile(src, dst) {
  return await RNFS.copyFile(src, dst).then(success => true).catch(err => { console.log(err.message); return false; });
}

// Moves file
export async function awaitMoveFile(src, dst) {
  return await RNFS.moveFile(src, dst).then(success => true).catch(err => { console.log(err.message); return false; });
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
  getBundleFile,
  getDocumentFile,
  getTempFile,
  getCacheFile,
  awaitGetFileStats,
  awaitReadFile,
  awaitWriteFile,
  awaitCopyFile,
  awaitMoveFile,
  awaitDeleteFile,
  awaitReadBundleFile,
  awaitReadBundleHtml
};

export default fs;
