var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#city');
var weatherContainerEl = document.querySelector('#weather-container');
//var currentWeatherEl = document.querySelector('#current-weather');
var currentWeatherEl = document.getElementById('current-weather');
var weatherForecastEl = document.querySelector('#weather-forecast');
const apiKey = '83cef35d319c284fc9756c009b1203ae';

var getDate = function() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}

var formSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value from input element
    var city = cityInputEl.value.trim();
    
    if (city) {
        getCityWeather(city);
        // clear old content
        weatherContainerEl.textContent = "";

    } else {
        alert("Please enter a City");
    }  
};

var getCityWeather = function(city) {
    // format the weather api
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=" + apiKey;
    var cityWeather = {
        lat: '',
        lon: '',
        name: city,
        date: getDate(),
        temp: '',
        wind: '',
        humidity: '',
        uvindex: ''
    }

    // make a get request to url
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {

                cityWeather.lat = data.coord.lat;
                cityWeather.lon = data.coord.lon;
                cityWeather.name = data.name;
                cityWeather.temp = data.main.temp;
                cityWeather.wind = data.wind.speed;
                cityWeather.humidity = data.main.humidity;
                cityWeather.uvindex = getUVIndex(cityWeather.lat, cityWeather.lon);

                console.log(cityWeather);
                displayWeather(cityWeather);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        alert("Some shit went wrong");
    });
};

var getUVIndex = function(latitude, longitude) {
    // format the weather api
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey;
    // make a get request to url
    fetch(apiUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {       
                response.json().then(function(data) {
                    return data.current.uvi;
                });
            } else {
                alert("Error: " + response.statusText);
                return '';
            }
    })
    .catch(function(error) {
        alert("Some shit went wrong one call");
    });
};

var displayWeather = function(weatherdata) {


    currentWeatherEl.innerHTML = weatherdata;

    // check if api returned current weather
    if (weatherdata.length === 0) {
        weatherContainerEl.textContent = "City not found.";
        return;
    } 






}
userFormEl.addEventListener("submit", formSubmitHandler);