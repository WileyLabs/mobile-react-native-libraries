const baseDictionary = {
  eng: new Map([
      ['done', 'Done'],
      ['no', 'No'],
      ['yes', 'Yes'],
      ['confirm', 'Confirm']
    ]),
  ger: new Map([
      ['done', 'Erledigt'],
      ['no', 'Nein'],
      ['yes', 'JA'],
      ['confirm', 'Bestätigen']
   ])
  };

// Returns text from specified dictionary
export class Dictionary {

  constructor(wordsMap, lang = 'eng', log = false) {
    this.log = log;
    this.lang = lang === undefined ? 'eng' : lang;
    this.data = new Map();
    this.update(wordsMap);
    if (this.log) {
      console.log('Dictionary created: ', { lang, wordsMap });
    }
  }

  update = (wordsMap) => {
    if (wordsMap === undefined) {
      return;
    }
    try {
      for (let key of wordsMap.keys()) {
        this.data.set(key, wordsMap.get(key));
      }
    }
    catch (err) {
      if (this.log) {
        console.log('Failed to update dictionary: ', err.message);
      }
    }
  };

  get(key, byDefault) {
    let value;
    try {
      if (this.data !== undefined) {
        value = this.data.get(key);
      }
      if (value === undefined) {
        value = baseDictionary[this.lang].get(key);
      }
    }
    catch (err) {
    }
    if (value === undefined && byDefault !== undefined) {
      value = byDefault;
    }
    if (this.log) {
      console.log('Dictionary word: ', {key, value});
    }
    return value;
  }

  set(key, value, overwrite = true) {
    try {
      if (!overwrite && this.data[key] !== undefined) {
        return false;
      }
      this.data[key] = value;
    }
    catch (err) {
      return false;
    }
    return true;
  }

  toString() {
    try {
      const values = [];
      for (let key of this.data.keys()) {
        values.push('[' + key + ': ' + this.data.get(key) + ']');
      }
      const lang = `lang: ${this.lang}; data (${values.length}): `;
      return lang + values.join(', ');
    }
    catch (err) {
    }
    return '';
   }

  toJSON() {
    return this.toString();
  }
}

export default Dictionary;
