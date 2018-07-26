/**
 * Locker by timeout
 * ver 0.0.1
 * created: Mar, 2018
 * last updated: 26 July 2018
 * author: mmalykh@wiley.com
 * dependencies: ./helpers.js
 */
import helpers from './helpers.js';
import generate from './generate.js';

// Locks itself for a timeout ms
export class Locker {

  constructor(props) {
    this.timeout = props.timeout === undefined ? 1000 : props.timeout;
    this.name = !props.name ? 'Locker #' + generate.hid() : props.name;
    this.time = 0;
    this.locked = 0;
    this.log = !!props.log && helpers.isDevice('emulator'); // logging on emulator only
  }

  try() {
    const time = Date.now();
    const gone = this.timeout > 0 ? (time - this.time) : 0;
    if (!this.locked || (gone > this.timeout)) {
      this.time = time;
      this.locked = true;
      if (this.log) {
        console.log('[Locker]', this.name, 'acquired at', helpers.getTime(this.time));
        setTimeout(() => console.log('[Locker]', this.name, 'released at', helpers.getTime()), this.timeout);
      }
      return true;
    }
    if (this.log) {
      console.log('[Locker]', this.name, 'rejected', { gone, timeout: this.timeout });
    }
    return false;
  }

  isLocked() {
    const gone = this.timeout > 0 ? Date.now() - this.time : 0;
    return (!this.locked || (gone > this.timeout)) ? false : true;
  }

  lock(resetTimer = true) {
    this.time = resetTimer ? Date.now() : this.time;
    this.locked = true;
    if (this.log) {
      console.log('[Locker]', this.name, 'acquired at', helpers.getTime(this.time));
    }
    return true;
  }

  unlock() {
    this.time = Date.now();
    this.locked = false;
    if (this.log) {
      console.log('[Locker]', this.name, 'unlocked at', helpers.getTime(this.time));
    }
  }

}

export default Locker;
