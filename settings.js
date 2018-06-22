const fs = require('fs'); 

function readSettings() {
    return new Promise((resolve, reject) => {
        fs.readFile('./settings.json', (err, settings) => {
            if(err) return reject(err); 
            resolve(JSON.parse(settings.toString())); 
        }); 
    });
}

function writeSettings(settings) {
    return new Promise((resolve, reject) => {
        fs.writeFile('./settings.json', settings, (err) => {
            if(err) return reject(err);
            resolve(settings); 
        }); 
    }); 
}

module.exports = {
    readSettings, 
    writeSettings
};