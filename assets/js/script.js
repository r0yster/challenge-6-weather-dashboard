var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#city');
var weatherContainerEl = document.querySelector('#weather-container');
var currentWeatherEl = document.querySelector('#current-weather');
var forecastWeatherEl = document.querySelector('#weather-forecast');
var city = document.getElementById('currCity');
var date = document.getElementById('currDate');
var icon = document.getElementById('currIcon');
var temp = document.getElementById('currTemp');
var wind = document.getElementById('currWind');
var humid = document.getElementById('currHumid');
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

        getCurrentWeather(city);
        getWeatherForecast(city);

        // clear old content
        /*
        currentWeatherEl.textContent = "asdfa";
        forecastWeatherEl.textContent = "asdfa";*/

    } else {
        alert("Please enter a City");
    }  
};

var getCurrentWeather = function(city) {
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
        icon: '',
        temp: '',
        wind: '',
        humid: '',
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
                cityWeather.icon = data.weather[0].icon;
                cityWeather.temp = data.main.temp;
                cityWeather.wind = data.wind.speed;
                cityWeather.humid = data.main.humidity;

                apiUrl = "https://api.openweathermap.org/data/2.5/onecall?" 
                            + "lat=" + cityWeather.lat 
                            + "&lon=" + cityWeather.lon 
                            + "&appid=" + apiKey;

                fetch(apiUrl).then(function(response) {
                    if(response.ok) {
                        response.json().then(function(data) {
                            cityWeather.uvindex = data.current.uvi;
                            displayCurrentWeather(cityWeather);
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

var getWeatherForecast = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" 
    + city 
    + "&units=imperial&APPID=" 
    + apiKey;
    
    var forecast = [];

    var day = {
        date: '',
        img: '',
        temp: '',
        wind: '',
        humid: ''
    }

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                for(var i = 0; i < data.list.length; i+=8) {

                    day = {
                        date: data.list[i].dt_txt,
                        img: data.list[i].weather[0].icon,
                        temp: data.list[i].main.temp,
                        wind: data.list[i].wind.speed,
                        humid: data.list[i].main.humidity
                    }
                    forecast.push(day)
                }
                displayForecast(forecast);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to connect to weatherhub");
    });
};

var displayCurrentWeather = function(weatherdata) {

    city.innerHTML = weatherdata.name;
    date.innerHTML = weatherdata.date;
    icon.setAttribute("src", "https://openweathermap.org/img/w/" + weatherdata.icon + ".png");
    temp.innerHTML = "Temp: " + weatherdata.temp + "°F";
    wind.innerHTML = "Wind: " + weatherdata.wind + "MPH";
    humid.innerHTML = "Humidity: " + weatherdata.humid + "%";
    uvindex.innerHTML = "UV Index: " + weatherdata.uvindex;

}

var displayForecast = function(weatherforecast) {
    var cardDate = '';
    var cardIcon = '';
    var cardTemp = '';
    var cardWind = '';
    var cardHumid = '';

    var card = '';
    var cardBody = '';

    for (var i = 0; i < weatherforecast.length; i++) {

        cardDate = $('<h4>' + weatherforecast[i].date + '</h4>');
        cardIcon = $('<img class="card-img" src=' + 'https://openweathermap.org/img/w/' + weatherforecast[i].img + '.png />');
        cardTemp = $('<p>' + weatherforecast[i].temp + '°F</p>');
        cardWind = $('<p>' + weatherforecast[i].wind + 'MPH</p>');
        cardHumid = $('<p>' + weatherforecast[i].humid + '%</p>');

        cardBody = $('<div calss="body"></div>');

        cardDate.appendTo(cardBody);
        cardIcon.appendTo(cardBody);
        cardTemp.appendTo(cardBody);
        cardWind.appendTo(cardBody);
        cardHumid.appendTo(cardBody);

        card = $('<div class="card"></div>');

        cardBody.appendTo(card);

        card.appendTo('#weather-forecast');
    }
};





userFormEl.addEventListener("submit", formSubmitHandler)

