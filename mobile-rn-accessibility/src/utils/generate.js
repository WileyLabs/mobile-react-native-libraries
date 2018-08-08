export const generate = {
  guid,        // generate unique string identifier
  crc32,       // generate crc32 code
  id,          // generate unique integer identifier
  hid          // generate unique hexadecimal identifier
};

export default generate;

// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript (uuidv4())
export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8); //eslint-disable-line no-bitwise
    return v.toString(16).toUpperCase();
  });
}

// https://jsperf.com/js-crc32
export const crc32 = str => {
  var crc = 0 ^ (-1); //eslint-disable-line no-bitwise
  for (var i = 0; i < str.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF]; //eslint-disable-line no-bitwise
  }
  return (crc ^ (-1)) >>> 0; //eslint-disable-line no-bitwise
};

export function id() {
  return crc32(guid());
}

export function hid() {
  return id().toString(16).toUpperCase();
}

var makeCRCTable = function() {
  var c;
  var crcTable = [];
  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)); //eslint-disable-line no-bitwise
    }
    crcTable[n] = c;
  }
  return crcTable;
};

const crcTable = makeCRCTable();
