'use strict'
const express = require('express')
const mongoose = require('mongoose');
const config = require('./config');
const body_parser = require('body-parser');
require('./dbConnection'); // connecting DB 

// Create the express app
const app = express()
app.use(body_parser.json());
require('./routes')(app); // Adding routing

app.get('/', (req, res)=>{
  res.send({success: true})
})

// Start server
app.listen(config.port, function (err) {
  if (err) {
    return console.error(err)
  }
  console.log('Started at http://localhost:1234')
})
