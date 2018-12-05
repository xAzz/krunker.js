const { E } = require('./KrunkerError');

const Errors = {
    MUST_SUPPLY: (unsupplied) => `You must supply ${unsupplied}`,
    BAD_USERNAME_TYPE: 'Username must be a string',
    USER_NOT_FOUND: 'User not found'
}

for (const [name, error] of Object.entries(Errors)) E(name, error);
