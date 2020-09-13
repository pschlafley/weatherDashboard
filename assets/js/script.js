var searchEl = document.querySelector("#citySearched");
var searchButtonEl = document.querySelector("#form-input");
var weatherContainerEl = document.querySelector("#weatherContainer");
var weatherInfo = document.querySelector("#weather-info");
var currentDate = moment().format("MM/DD/YYYY");

function getCityWeather() {
    var city = searchEl.value;

    var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=bb668105a98f241dd921ea57a3fc035c";

    fetch(weatherUrl)
    .then (function(response) {
        return response.json();
    })
    .then(function(response) {
        weatherContainerEl.innerHTML = '';
        // console.log(response);
        // console.log(response.main);

        // create <p> element to hold the City name and Date
        var weatherContent = document.createElement("h3");
        weatherContent.innerHTML =  city + " (" + currentDate + ") ";
        weatherContainerEl.appendChild(weatherContent);

        // create an icon for the current weather of given city
        var icon = response.weather[0].icon;
        var weatherIcon = document.createElement("img");
        weatherIcon.src = "https://openweathermap.org/img/w/" + icon + ".png";
        weatherContainerEl.appendChild(weatherIcon);

        // create a <p> element to hold the temperature data
        var temp = response.main.temp;
        var temperature = document.createElement("p");
        temperature.classList = "lead"
        temperature.innerHTML = "Temperature: " + temp + " °F";
        weatherContainerEl.appendChild(temperature);

        // create a <p> element to hold the humidty data
        var humidityInfo = response.main.humidity;
        var humidity = document.createElement("p");
        humidity.classList = "lead";
        humidity.innerHTML = "Humidity: " + humidityInfo + "%";
        weatherContainerEl.appendChild(humidity);

        // create a <p> element to hold the wind speed data
        var windSpeedInfo = response.wind.speed;
        var windSpeed = document.createElement("p");
        windSpeed.classList = "lead";
        windSpeed.innerHTML = "Wind Speed: " + windSpeedInfo + " MPH";
        weatherContainerEl.appendChild(windSpeed);

        var lat = response.coord.lat;
        var lon = response.coord.lon;

        getUvIndex(lat, lon);
    })
};

function getUvIndex(lat, lon) {
    var uvIndexUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=bb668105a98f241dd921ea57a3fc035c&lat=" + lat + "&lon=" + lon;
    fetch(uvIndexUrl)
    .then (function(response) {
        return response.json();
    })
    .then (function(response) {
        displayUvIndex(response);
    })
};

function displayUvIndex(uv) {
    var uvIndexEl = document.createElement("p");
    uvIndexEl.innerHTML = "UV Index:  <span id='uv-index'>" + uv.value + "</span>"; 
    weatherContainerEl.appendChild(uvIndexEl);

    if (uv.value <= 2) {
        document.querySelector("#uv-index").classList = "bg-success";
    } 
    else if (uv.value > 2 && uv.value <= 7) {
        document.querySelector("#uv-index").classList = "bg-warning";
    }
    else if (uv.value > 7 && uv.value <= 10) {
        document.querySelector("#uv-index").classList = "bg-danger";
    }
};



function formSubmitHandler(event) {
    event.preventDefault();
    getCityWeather();
};


searchButtonEl.addEventListener("submit", formSubmitHandler);