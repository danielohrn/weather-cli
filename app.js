const fetch = require('node-fetch'); 


// returns arguments object 
function getArgs(input = []) {
    
    const [ACTION, ...OPTIONS] = input; 
    
    const _arguments = { type: null }; 
    
    // configure defaults not yet implemented 
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


// determines what type of action to be executed 
function getAction(options = {}) {

    if(options.type === 'search') {
        fetch(getQueryURL(options))
         .then(res => res.json())
         .then(data => {
            if(!data.main) {
                console.log('No city found for query', options.city);
                return; 
            }

            console.log(`\nWeather for ${options.city} today:\n\n`); 
            console.log(`Description:\t${data.weather[0].description}`); 
            console.log(`Right now:\t${data.main.temp}${options.units_full_name}`);
            console.log(`Min today:\t${data.main.temp_min}${options.units_full_name}`);
            console.log(`Max today:\t${data.main.temp_max}${options.units_full_name}\n\n`);
         })
         .catch(err => console.log('There was an error:', err));
    
       // 'config' not implemented 
    } else if(options.type === 'config') {
        console.log('Defaults set with', options);
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
        console.log('Don\'t forget the city'); 
    }
}


module.exports = getWeather; 