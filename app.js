const fetch = require('node-fetch'); 
const { readSettings, writeSettings } = require('./settings'); 


// returns arguments object 
function getArgs(input = []) {
    
    const [ACTION, ...OPTIONS] = input; 
    
    const _arguments = { type: null }; 
    
    // configure defaults 
    if(ACTION === '--defaults' || ACTION === '-d') {
        _arguments.type = 'config';
        
        return OPTIONS.join(',')
         .split(/,|=/g)
         .reduce((argumentsObject, next, currIndex, array) => {
            
            if(currIndex % 2 == 0) {
                argumentsObject[next] = array[currIndex + 1]; 
            }

            return argumentsObject; 

        }, _arguments); 
    } 
    else { // default case is search
        return {
            type: 'search',
            city: input[0], 
            unit: input[1], 
            units_full_name: input[1] === '-f' ? '°F' : '°C'
        };
    }
}

function getUnitSymbol(input) {
    return (
        input === '-f' || input === '-fahrenheit' || input === 'fahrenheit' ? '°F' : '°C'
    ); 
}


// determines what type of action to be executed 
function getAction(options = {}) {

    if(options.type === 'search') {
        fetch(getQueryURL(options))
         .then(res => res.json())
         .then(data => {
            
            // return early if there is no match for query
            if(!data.main) {  
                console.log('No city found for query', options.city);
                return; 
            }

            // display weather details 
            console.log(`\nWeather for ${options.city} today:\n\n`); 
            console.log(`Description:\t${data.weather[0].description}`); 
            console.log(`Right now:\t${data.main.temp}${options.units_full_name}`);
            console.log(`Min today:\t${data.main.temp_min}${options.units_full_name}`);
            console.log(`Max today:\t${data.main.temp_max}${options.units_full_name}\n\n`);
         })
         .catch(err => console.log('There was an error:', err));
    
       // sets a default city and unit 
    } else if(options.type === 'config') {

        // read the file 
        readSettings()
         .then(settings => { 
            // if there are no args supplied, display current settings 
            if(!options.city && !options.units) {
                console.log('Your default settings are:', settings); 
            } else {
                for(let key in options) {
                    if(key !== 'type') {
                        settings[key] = options[key];
                    }
                }
                // update the settings
                writeSettings(JSON.stringify(settings))
                 .then(response => {
                    console.log('Your new settings are:', response); 
                 });
            }
        })
        .catch(err => console.log(err)); 
    }
    
}

// returns the api url with fahrenheit or celsius + city 
function getQueryURL({city, unit}) {
    const UNIT = unit === '-f' ? 'imperial' : 'metric';
    return `http://api.openweathermap.org/data/2.5/weather?APPID=2589c4b2eacc7f42193d27bad88fec62&units=${UNIT}&q=${city}`; 
}

// main function 
function getWeather(args) {
    if(args.length) {
        getAction(getArgs(args)); 
    } else {
        // messy implementation of user default settings for city and units
        readSettings()
         .then(settings => {
             if(settings.city || settings.units) {
                fetch(getQueryURL({city: settings.city, unit: settings.units}))
                .then(res => res.json())  
                .then(weather => {
                    // display weather details 
                    console.log(`\nWeather for ${settings.city} today:\n\n`); 
                    console.log(`Description:\t${weather.weather[0].description}`); 
                    console.log(`Right now:\t${weather.main.temp}${getUnitSymbol(settings.units)}`);
                    console.log(`Min today:\t${weather.main.temp_min}${getUnitSymbol(settings.units)}`);
                    console.log(`Max today:\t${weather.main.temp_max}${getUnitSymbol(settings.units)}\n\n`);
                })               
                .catch(err => console.log(err)); 
             } else {
                console.log('Don\'t forget the city'); 
             }
         }); 
    }
}


module.exports = getWeather; 