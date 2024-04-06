// Parameters for search
const meteoParams = {
    latitude: 35.9132,
    longitude: -79.0558,
    daily: ["temperature_2m_max", "temperature_2m_min",  "precipitation_probability_mean", "weather_code"],
    current: ["temperature_2m",  "precipitation_probability", "weather_code"],
    timezone: "EST",
    forecast_days: 3
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
days = []                   // string array
tempMax = []                // Maximum temperature in fahrenheight
tempMin = []                // Minimum temperature in fahrenheight
tempCurr = 0                // Current temperature in fahrenheight
precipPerc = []             // Precipitation percentage 
weather_type = []           // 
weather_code = []           // in WMO

// constants
const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const weatherCodes = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing Rime Fog",
    51: "Drizzle: Light",
    53: "Drizzle: Moderate",
    55: "Drizzle: Dense",
    56: "Freezing Drizzle: Light",
    57: "Freezing Drizzle: Moderate",
    61: "Rain: Slight",
    63: "Rain: Moderate",
    65: "Rain: Heavy",
    66: "Freezing Rain: Light",
    67: "Freezing Rain: Heavy",
    71: "Snow: Slight",
    73: "Snow: Moderate",
    75: "Snow: Heavy",
    77: "Snow grains",
    80: "Rain Showers: Slight",
    81: "Rain Showers: Moderate",
    82: "Rain Showers: Violent",
    85: "Snow Showers: Slight",
    86: "Snow Showers: Heavy",
    95: "Thunderstorm"
}


// const displayWeather = async () => {
//     try {
//         const response = await fetch(timerURL);
//         if (!response.ok) {
//             throw new Error('Weather data could not be fetched.');
//         }
//         const data = await response.json();
//         console.log(data.dataseries[0]);
//         // document.getElementById('weather').innerHTML = `
//         //     <p>Temperature: ${data.dataseries[0].temp2m}°C</p> 
//         // `;
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };

// displayWeather();

// Function to fetch weather data (openmeteo)
async function meteoWeather() {
    let data = undefined;
    try {
        const response = await fetch(meteoURL);
        if (!response.ok) throw new Error('Failed to fetch weather data');
        data = await response.json();

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }

    if (data != undefined) {
        console.log(data);

        const dailyData = data.daily;
        const timeStamps = dailyData.time;
        precipPerc = dailyData.precipitation_probability_mean;
        tempMax = dailyData.temperature_2m_max;
        tempMin = dailyData.temperature_2m_min;
        weather_code = dailyData.weather_code;

        const currentData = data.current
        tempCurr = toFahrenheight(currentData.temperature_2m);
        console.log(`Current temperature: ${tempCurr}`);


        for (let i = 0; i < timeStamps.length; i++) {
            let date = new Date(timeStamps[i]);
            days.push(dayNames[date.getDate()]);
            tempMax.push()
        }
    }
}

function toFahrenheight(temp) {
    // convert celsius to fahrenheight temperature
    result = (temp * 9/5) + 32
    return result.toFixed(2);
}

// meteoWeather();


// grab div main by id and populate inside with next 4 days of weather with info from this

// document.getElementById('main').innerHTML = ``
