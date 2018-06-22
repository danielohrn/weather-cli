## Weather CLI
##### Weather data from openweathermap 
##### --- Quick and dirty test for learning --- 

```
git clone https://github.com/danielohrn/weather-cli
cd weather-cli 
npm install 
```

####Use the app 
in the /weather-cli directory: 
```
./index.js
``` 
or set up alias pointing to the directory like: 
```
alias weather="node ~/{YOUR_PATH}/weather-cli/index.js "
```

####Arguments
#####Searching for weather:  
- City: String
- Units: String (-c || --celsius || -f || --fahrenheit) Default: Celsius 
```
weather stockholm
weather florida --f
```

#####Set default city and unit
- -d || --defaults
- City: String (city=stockholm)
- Units: String (units=celsius)

```
weather -d city=stockholm units=celsius
weather -defaults units=fahrenheit
```

