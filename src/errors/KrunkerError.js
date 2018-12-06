// Modified https://github.com/nodejs/node/blob/master/lib/internal/errors.js

const kCode = Symbol('code');
const getMessages = new Map();

function makeKrunkerjsError(Base) {
    return class KrunkerjsError extends Base {
        constructor(key, ...args) {
        super(getMessage(key, args));
        this[kCode] = key;
    }

    get name() {
        return `${super.name} [${this[kCode]}]`;
    }
  };
}

function getMessage(key, args) {
    const msg = getMessages.get(key);
    if (typeof msg === 'function') return msg(...args);
    if (args === undefined || args.length === 0) return msg;
    args.unshift(msg);
    return String(...args);
}

function E(sym, val) {
    getMessages.set(sym, typeof val === 'function' ? val : String(val));
}

module.exports = {
  E,
  Error: makeKrunkerjsError(Error),
  TypeError: makeKrunkerjsError(TypeError),
};