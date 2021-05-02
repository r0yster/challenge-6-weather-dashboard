var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#city');
var weatherContainerEl = document.querySelector('#weather-container');
var currentWeatherEl = document.querySelector('#current-weather');
var forecastWeatherEl = document.querySelector('#weather-forecast');
var city = document.getElementById('currCity');
var temp = document.getElementById('currTemp');
var wind = document.getElementById('currWind');
var humidity = document.getElementById('currHumidity');
var uvindex = document.getElementById('currUVIndex');

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
        /*
        currentWeatherEl.textContent = "asdfa";
        forecastWeatherEl.textContent = "asdfa";*/

    } else {
        alert("Please enter a City");
    }  
};

var getCityWeather = async function(city) {
    // format the weather api
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" 
                    + city 
                    + "&units=imperial&APPID=" 
                    + apiKey;

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

                apiUrl = "https://api.openweathermap.org/data/2.5/onecall?" 
                            + "lat=" + cityWeather.lat 
                            + "&lon=" + cityWeather.lon 
                            + "&appid=" + apiKey;

                fetch(apiUrl).then(function(response) {
                    if(response.ok) {
                        response.json().then(function(data) {
                            cityWeather.uvindex = data.current.uvi;
                            displayWeather(cityWeather);
                        });
                    } else {
                        alert("Error: " + response.statusText);
                    }
                })
                .catch(function(error) {
                    alert("Unable to connect to weatherhub");
                });
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to connect to weatherhub");
    });
};

var displayWeather = function(weatherdata) {

    city.innerHTML = weatherdata.name;
    temp.innerHTML = weatherdata.temp;
    wind.innerHTML = weatherdata.wind;
    humidity.innerHTML = weatherdata.humidity;
    uvindex.innerHTML = weatherdata.uvindex;

}
userFormEl.addEventListener("submit", formSubmitHandler);