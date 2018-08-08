/**
 * Locker by timeout
 * ver 0.1.1
 * created: Mar, 2018
 * last updated: 07 Aug 2018
 * author: mmalykh@wiley.com
 * dependencies: ./helpers.js, ./generate.js
 */
import helpers from './helpers.js';
import generate from './generate.js';

const log = (that, ...args) => that.silent || console.log('[Locker]', that.name, ...args);

/**
 * Locks itself for a specified timeout ms or manually by calling lock()/unlock()
 */
export class Locker {

  // Creates locker; options: timeout (ms), name, silent
  constructor(props) {
    this.timeout = props.timeout === undefined ? 1e6 : props.timeout;
    this.name = !props.name ? '#' + generate.hid() : props.name;
    this.time = 0;
    this.locked = 0;
    this.silent = !helpers.isDevice('emulator') || props.silent !== false;   // logging on emulator only
    this.silent || log(this, 'created', helpers.getTime(), this);
  }

  // Returns true & then locks object if it is unlocked, false otherwise
  try(by) {
    const time = Date.now();
    const gone = this.timeout > 0 ? (time - this.time) : 0;
    const suffix = !this.silent && by ? '[' + by + ']' : '';
    if (!this.locked || (gone > this.timeout)) {
      this.time = time;
      this.locked = true;
      this.silent || log(this, 'acquired at', helpers.getTime(this.time), suffix);
      this.silent || setTimeout(() => log(this, 'released', helpers.getTime(), suffix), this.timeout);
      return true;
    }
    this.silent || log(this, 'rejected at', helpers.getTime(this.time), suffix, {gone, timeout: this.timeout});
    return false;
  }

  // Returns true if object is locked
  isLocked() {
    const gone = this.timeout > 0 ? Date.now() - this.time : 0;
    return (!this.locked || (gone > this.timeout)) ? false : true;
  }

  // Locks object
  lock(by, reset = true) {
    this.time = reset ? Date.now() : this.time;
    this.locked = true;
    this.silent || log(this, 'locked at', helpers.getTime(this.time), by ? '[' + by + ']' : '');
    return true;
  }

  // Unlocks object
  unlock(by) {
    this.time = Date.now();
    this.locked = false;
    this.silent || log(this, 'unlocked at', helpers.getTime(this.time), by ? '[' + by + ']' : '');
  }

}

export default Locker;
