// Utility: Format date and time
function formatDate() {
    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "March", "Apr", "May", "June", "July", "Sept", "Oct", "Nov", "Dec"];
    
    let day = days[now.getDay()];
    let month = months[now.getMonth()];
    let date = now.getDate();
    let year = now.getFullYear();
    
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    
    document.querySelector("#date").innerHTML = `${day}, ${month} ${date}, ${year} | ${hours}:${minutes}`;
  }
  
  // Utility: Format forecast day
  function formatDay(timestamp) {
    const date = new Date(timestamp * 1000);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
  }
  
  // Display weather forecast
  function displayWeatherForecast(response) {
    const forecastData = response.data.daily;
    let forecastHTML = `<div class="row">`;
  
    forecastData.forEach((forecastDay, index) => {
      if (index < 5) { // Limit to 5-day forecast
        forecastHTML += `
          <div class="col">
            <div class="forecast-day">${formatDay(forecastDay.dt)}</div>
            <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="${forecastDay.weather[0].description}" width="42">
            <div class="forecast-temp">
              <span class="temp-max">${Math.round(forecastDay.temp.max)}&deg;</span>
              <span class="temp-min">${Math.round(forecastDay.temp.min)}&deg;</span>
            </div>
          </div>`;
      }
    });
  
    forecastHTML += `</div>`;
    document.querySelector("#weather-forecast").innerHTML = forecastHTML;
  }
  
  // Fetch forecast
  function fetchForecast(coordinates) {
    const apiKey = "206048a161a48264555254d853eb3669"; // Updated API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.latitude}&lon=${coordinates.longitude}&exclude=minutely,hourly&appid=${apiKey}&units=metric`;
    
    axios.get(apiUrl).then(displayWeatherForecast);
  }
  
  // Fetch current weather
  function fetchWeather(city) {
    const apiKey = "206048a161a48264555254d853eb3669"; // Updated API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    axios.get(apiUrl).then(displayCurrentWeather);
  }
  
  // Handle weather search
  function handleSearch(event) {
    event.preventDefault();
    const city = document.querySelector("#search").value;
    fetchWeather(city);
  }
  
  document.querySelector("#search-form").addEventListener("submit", handleSearch);
  
  // Display current weather details
  function displayCurrentWeather(response) {
    const data = response.data;
    
    document.querySelector("#city-name").innerHTML = data.name;
    document.querySelector("#country").innerHTML = data.sys.country;
    document.querySelector("#city-name-mini").innerHTML = data.name;
    
    celsiusValue = data.main.temp;
    document.querySelector("#temp-main").innerHTML = Math.round(celsiusValue);
    
    document.querySelector("#humidity-value").innerHTML = data.main.humidity;
    document.querySelector("#feels-like").innerHTML = Math.round(data.main.feels_like);
    document.querySelector("#wind-value").innerHTML = Math.round(data.wind.speed);
    document.querySelector("#wind-speed").innerHTML = Math.round(data.wind.speed);
    document.querySelector("#wind-direction").innerHTML = Math.round(data.wind.deg);
    document.querySelector("#pressure").innerHTML = data.main.pressure;
    
    document.querySelector("#weather-description").innerHTML = data.weather[0].description;
    
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.querySelector("#icon").setAttribute("src", iconUrl);
    document.querySelector("#icon").setAttribute("alt", data.weather[0].description);
    
    fetchForecast(data.coord); // Coordinates for forecast
  }
  
  // Get current location weather
  function fetchLocationWeather(position) {
    const apiKey = "206048a161a48264555254d853eb3669"; // Updated API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
    
    axios.get(apiUrl).then(displayCurrentWeather);
  }
  
  function getCurrentLocationWeather(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(fetchLocationWeather);
  }
  
  document.querySelector("#current-weather-btn").addEventListener("click", getCurrentLocationWeather);
  
  // Temperature conversion
  let celsiusValue = null;
  
  function convertToFahrenheit(event) {
    event.preventDefault();
    document.querySelector("#celsius").classList.add("active");
    document.querySelector("#fahrenheit").classList.remove("active");
    
    let fahrenheitValue = Math.round((celsiusValue * 9) / 5 + 32);
    document.querySelector("#temp-main").innerHTML = fahrenheitValue;
  }
  
  function convertToCelsius(event) {
    event.preventDefault();
    document.querySelector("#celsius").classList.remove("active");
    document.querySelector("#fahrenheit").classList.add("active");
    
    document.querySelector("#temp-main").innerHTML = Math.round(celsiusValue);
  }
  
  document.querySelector("#fahrenheit").addEventListener("click", convertToFahrenheit);
  document.querySelector("#celsius").addEventListener("click", convertToCelsius);
  
  // Initial call
  fetchWeather("Nairobi");
  formatDate();
  