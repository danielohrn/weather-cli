#!/usr/bin/env node

// get the rest args from argv 
const [ , ,...args] = process.argv; 
require('./app.js')(args); 


