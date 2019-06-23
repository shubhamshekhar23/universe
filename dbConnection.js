const mongoose = require('mongoose');
const config = require('./config');


mongoose.connect(config.mongodbURILocal).then(
    () => { console.log('connection to mongodb successful')},
    (err) => { console.log('error connecting to mongodb')}
)