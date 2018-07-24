// Locks itself for a timeout ms
export class Locker {

  constructor(props) {
    this.timeout = props.timeout === undefined ? 1000 : props.timeout;
    this.name = !props.name ? 'locker' : props.name;
    this.time = 0;
    this.locked = 0;
    this.log = !!props.log;
  }

  try() {
    const time = Date.now();
    const gone = this.timeout > 0 ? (time - this.time) : 0;
    if (!this.locked || (gone > this.timeout)) {
      this.time = time;
      this.locked = true;
      if (this.log) {
        console.log('[Locker]', this.name, 'acquired at', this.time);
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
      console.log('[Locker]', this.name, 'acquired at', this.time);
    }
    return true;
  }

  unlock() {
    this.time = Date.now();
    this.locked = false;
    if (this.log) {
      console.log('[Locker]', this.name, 'unlocked at', this.time);
    }
  }

}

export default Locker;
