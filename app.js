// Parameters for search
const meteoParams = {
    latitude: 35.9132,
    longitude: -79.0558,
    daily: ["temperature_2m_max", "temperature_2m_min",  "precipitation_probability_mean", "weather_code"],
    current: ["temperature_2m",  "precipitation_probability", "weather_code"],
    timezone: "EST",
    forecast_days: 4
};

const timerSearchParams = {
    lon: -79.0558,
    lat: 35.9132,
    product: "civil",
    output: "json"
};

// Construct URLs
const meteoSearch = new URLSearchParams(meteoParams);
const meteoURL = `https://api.open-meteo.com/v1/forecast?${meteoSearch}`;

const timerSearch = new URLSearchParams(timerSearchParams);
const timerURL = `http://www.7timer.info/bin/api.pl?${timerSearch}`;

// Initialize data arrays 
let days = [];                   // string array
let tempMax = [];                // Maximum temperature in fahrenheight
let tempMin = [];               // Minimum temperature in fahrenheight
let tempCurr = 0;                // Current temperature in fahrenheight
let precipPerc = [];             // Precipitation percentage 
let weather_code = [];           // in WMO
let humidityCurr = "";           // Relative humidity %
let wind_speed = 0;
let wind_direction = "";


// constants
const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const weatherCodes = {
    0: "Clear Skies",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    56: "Light Freez. Drizzle",
    57: "Moderate Freez. Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    66: "Light Freez. Rain",
    67: "Heavy Freez. Rain",
    71: "Slight Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    77: "Snow grains",
    80: "Slight Rain Show.",
    81: "Moderate Rain Show.",
    82: "Violent Rain Show.",
    85: "Slight Snow Show.",
    86: "Heavy Snow Show.",
    95: "Thunderstorm"
}

const displayWeather = async () => {
    let data = undefined;
    try {
        const response = await fetch(timerURL);
        if (!response.ok) throw new Error('Weather data could not be fetched.');
        data = await response.json();
    } catch (error) {
        console.error('Error fetching 7Timer! data:', error);
    }

    if (data != undefined) {
        const currentData = data.dataseries[0];
        const windData = currentData.wind10m;

        humidityCurr = currentData.rh2m;
        wind_speed = windData.speed;
        wind_direction = windData.direction;
    }
};

// Function to fetch weather data (openmeteo)
async function meteoWeather() {
    let data = undefined;
    try {
        const response = await fetch(meteoURL);
        if (!response.ok) throw new Error('Failed to fetch weather data');
        data = await response.json();

    } catch (error) {
        console.error('Error fetching OpenMeteo data:', error);
    }

    if (data != undefined) {
        console.log(data);

        const dailyData = data.daily;
        const timeStamps = dailyData.time;
        precipPerc = dailyData.precipitation_probability_mean;
        tempMax = dailyData.temperature_2m_max.map(
            (x) => toFahrenheight(x)
        );
        tempMin = dailyData.temperature_2m_min.map(
            (x) => toFahrenheight(x)
        );

        weather_code = dailyData.weather_code;

        const currentData = data.current
        tempCurr = toFahrenheight(currentData.temperature_2m);
        console.log(`Current temperature: ${tempCurr}`);


        for (let i = 0; i < timeStamps.length; i++) {
            let date = new Date(timeStamps[i]);
            // console.log(timeStamps[i]);
            // console.log(dayNames[date.getDay()]);
            days.push(dayNames[date.getDay()]);
            tempMax.push()
        }

        console.log(days);
    }
}

function toFahrenheight(temp) {
    result = (temp * 9/5) + 32
    return result.toFixed();
}

// grab div main by id and populate inside with next 4 days of weather with info from this

function populateData() {

    // Current data
    document.getElementById('current').innerHTML = 
    `   
        <weather-card>
            <h1> 
                ${days[0]}
            </h1>

            <img src="./icons/placeholder.png">

            <h2>
                ${weatherCodes[weather_code[0]]}
            </h2>
            
        </weather-card>
    `


    // Upcoming data
    for (let i = 1; i < days.length; i++) {
        let weather_div = document.createElement("weather-card");
        weather_div.innerHTML = 
        `
            <h1> 
                ${days[i]}
            </h1>
            <img src="./icons/placeholder.png">
            <h2>
                ${weatherCodes[weather_code[i]]}
            </h2>
            <div class='temp'>
                <h2 class='low'> Lo </h2>
                <h1> ${tempMin[i]} </h1>
            </div>
            <div class='temp'>
                <h2 class='high'> Hi </h2>
                <h1> ${tempMax[i]} </h1>
            </div>

        `

        document.getElementById("upcoming").appendChild(weather_div);
        
    }
    // document.getElementById('main').innerHTML = ``
    // document.getElementById('weather').innerHTML = `
    //     <p>Temperature: ${data.dataseries[0].temp2m}°C</p> 
    // `;
        
}

async function render() {
    await meteoWeather();
    await displayWeather();
    populateData();
}

render();