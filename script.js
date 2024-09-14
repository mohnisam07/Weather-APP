const apiKey = '6c3d9b28212380924a4cea4e43bf42c7'

document.getElementById('search-input').addEventListener('submit', async function(e){
    e.preventDefault();
    const city = document.getElementById('city-input').value
    await getWeather(city)
})

const getWeather = async (city) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try{
        const response = await fetch(apiUrl)
        if(!response.ok) {
            throw new Error("City Not Found");
        }
        const data = await response.json()

        const temperature = data.main.temp
        const description = data.weather[0].description
        const humidity = data.main.humidity
        const cityName = data.name
        const countryCode = data.sys.country
        const timeZoneOffset = data.timezone
        const latitude = data.coord.lat
        const longitude = data.coord.lon
        const tempIcon = data.weather[0].icon
        const iconUrl = `http://openweathermap.org/img/wn/${tempIcon}@2x.png `

        const flagResponse = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        const countryData = await flagResponse.json();

        const flagUrl = countryData[0]?.flags?.svg || countryData[0]?.flags?.png;

        if (!flagUrl) {
            throw new Error("Flag not found for the country code");

        }
        
        const sunApi = await fetch(`https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}`)
        const sunResponse = await sunApi.json();
        const sunrise = sunResponse.results.sunrise;
        const sunset = sunResponse.results.sunset;
        
        


        document.getElementById('weather').innerHTML = `
                    <h2>Weather in ${cityName} <img src="${flagUrl}" alt="${countryCode} flag" width="30px"></h2>
                    <p id="time" ></p>
                    <p>Temperature: ${temperature}°C <img id="temp-icon" src="${iconUrl}" alt="Weather icon" width="50px"></p>
                    <p>Condition: ${description}</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Sunrise: ${sunrise} <i class="fas fa-sun"></i></p>
                    <p>Sunset: ${sunset} <i class="fas fa-moon"></i></p>

        `

        if(window.currentTimeInterval){
            clearInterval(window.currentTimeInterval)
           }
    
            const updateTime =() =>{
            const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000; 
            const localTime = new Date(utcTime + timeZoneOffset * 1000).toLocaleTimeString();
            document.getElementById('time').textContent = `Current Local Time: ${localTime}`;
           }
    
           window.currentTimeInterval = setInterval(updateTime,1000)
           updateTime();
        
    }
    catch(error){
        console.error('Error fetching the weather data:', error)
        document.getElementById('weather').innerHTML = `<p class="error">City not found. Please try again.</p>`;
    }
}