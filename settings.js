const fs = require('fs'); 
const path = require('path'); 

function readSettings() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(__dirname + '/settings.json'), (err, settings) => {
            if(err) return reject(err); 
            resolve(JSON.parse(settings.toString())); 
        }); 
    });
}

function writeSettings(settings) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.resolve(__dirname + '/settings.json'), settings, (err) => {
            if(err) return reject(err);
            resolve(settings); 
        }); 
    }); 
}

module.exports = {
    readSettings, 
    writeSettings
};