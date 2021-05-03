var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#city');
var cityButtons = document.querySelector('#saved-cities');
var city = document.querySelector('#currCity');
var date = document.querySelector('#currDate');
var icon = document.querySelector('#currIcon');
var temp = document.querySelector('#currTemp');
var wind = document.querySelector('#currWind');
var humid = document.querySelector('#currHumid');
var uvindex = document.querySelector('#currUVIndex');

var savedCities = [];
var lastCity = '';

const apiKey = '83cef35d319c284fc9756c009b1203ae';

// helper functions
var getDate = function() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}

var calcUV = function(index) {
    
    var color = '';

    if (index < 3) {
        color = '#34eb77';

    } else if (index >= 3 && index < 6) {
        color = '#ebd234';

    } else if (index >= 6 && index < 8) {
        color = '#ff700a';

    } else if (index >= 8 && index < 10) {
        color = '#ff0000';

    } else {
        color = '#d934eb';
    }

    return color;
}

var createCityBtn = function (loc, cityname) {
    var btn = document.createElement('button');
    btn.id = cityname;
    btn.type = 'button';
    btn.innerHTML = cityname.toUpperCase();
    loc.appendChild(btn);
};

// event handler functions
var formSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value from input element
    var city = cityInputEl.value.trim();
    var savedCity = checkCity(city);

    if (savedCity) {
        savedCities.push(city);
        createCityBtn(cityButtons, city);
    }
    
    lastCity = city;
    saveCity();

    if (city) {

        getCurrentWeather(city);
        getWeatherForecast(city);

    } else {
        alert("Please enter a City");
    }  
};

var buttonHandler = function(event) {

    var target = event.target;

    if (target.type === 'button') {
        var city = target.id
        getCurrentWeather(city);
        getWeatherForecast(city);
    }
}

// get weather methods
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
                $("#weather-forecast").empty();
                for(var i = 1; i < data.list.length; i+=8) {

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

// display weather methods
var displayCurrentWeather = function(weatherdata) {

    var uvcolor = calcUV(weatherdata.uvindex);

    city.innerHTML = weatherdata.name;
    date.innerHTML = weatherdata.date;
    icon.setAttribute("src", "https://openweathermap.org/img/w/" + weatherdata.icon + ".png");
    temp.innerHTML = "Temp: " + weatherdata.temp + "°F";
    wind.innerHTML = "Wind: " + weatherdata.wind + "MPH";
    humid.innerHTML = "Humidity: " + weatherdata.humid + "%";
    uvindex.innerHTML = "UV Index: <span style='background-color:" + uvcolor + ";' color:white;>" + weatherdata.uvindex + "</span>";

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

        cardDate = $('<h4 class="card-title">' + weatherforecast[i].date + '</h4>');
        cardIcon = $('<img class="card-img" src=' + 'https://openweathermap.org/img/w/' + weatherforecast[i].img + '.png />');
        cardTemp = $('<p class="card-text">Temp: ' + weatherforecast[i].temp + ' °F</p>');
        cardWind = $('<p class="card-text">Wind: ' + weatherforecast[i].wind + ' MPH</p>');
        cardHumid = $('<p class="card-text">Humidity: ' + weatherforecast[i].humid + ' %</p>');

        cardBody = $('<div class="card-body"></div>');

        cardDate.appendTo(cardBody);
        cardIcon.appendTo(cardBody);
        cardTemp.appendTo(cardBody);
        cardWind.appendTo(cardBody);
        cardHumid.appendTo(cardBody);

        card = $('<div class="col card"></div>');

        cardBody.appendTo(card);

        card.appendTo('#weather-forecast');
    }
};

// local storage functions
var saveCity = function() {
    localStorage.setItem('savedCities', JSON.stringify(savedCities));
    localStorage.setItem('lastCity', JSON.stringify(lastCity));
}

var loadCities = function() {
    if (localStorage.getItem("savedCities") != null) {
        savedCities = JSON.parse(localStorage.getItem("savedCities"));
        savedCities.forEach( ele => {
            createCityBtn(cityButtons, ele);
        });
    } else {
        savedCities.splice(0, savedCities.length);
    }
    lastCity = JSON.parse(localStorage.getItem("lastCity"));
}

var checkCity = function (city) {
    var check = true;
    if (savedCities) {
        if (savedCities.length > 0) {
            savedCities.forEach (ele => {
                if (city === ele) {
                    check = false;
                }
            });
        }
    }
    return check;
}


loadCities();

userFormEl.addEventListener("submit", formSubmitHandler);
cityButtons.addEventListener("click", buttonHandler);
