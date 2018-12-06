const KrunkerJS = require('./index');
// Create a new instance
const Krunker = new KrunkerJS();

// Get the stats of the user
Krunker.getUser('Helinho').then(user => {
    // Console log the user stats as an object
    console.log(user);
    // [V1.2^ Feature] Gets all stats ready as an object
    console.log(user.simplified);
}).catch(console.error);