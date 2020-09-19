var searchEl = document.querySelector("#citySearched");
var searchButtonEl = document.querySelector("#form-input");
var weatherContainerEl = document.querySelector("#weatherContainer");
var weatherInfo = document.querySelector("#weather-info");
var currentDate = moment().format("MM/DD/YYYY");
var forecastContainer = document.querySelector("#forecast");

function getCityWeather() {
    var city = searchEl.value;

    var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=bb668105a98f241dd921ea57a3fc035c";

    fetch(weatherUrl)
    .then (function(response) {
        return response.json();
    })
    .then(function(response) {
        weatherContainerEl.innerHTML = "";
       
        weatherContainerEl.classList = "border-weight"

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
    var uvIndexUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=bb668105a98f241dd921ea57a3fc035c&lat=" + lat + "&lon=" + lon;
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

function getForeCast(city) {
    var city = searchEl.value;

    var foreCastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=bb668105a98f241dd921ea57a3fc035c";

    fetch(foreCastUrl)
    .then (function(response) {
        return response.json();
    })
    .then(function(response) {
        var foreCastDays = response.list;

            forecastContainer.textContent = "";

        for (var i = 5; i < foreCastDays.length; i = i + 8) {
            var currentDay = foreCastDays[i];

            console.log(currentDay);

            var currentDayContainer = document.createElement("div");
            currentDayContainer.classList = "card bg-primary mh-100 text-white m-20 ml- p-3";
            forecastContainer.appendChild(currentDayContainer);

            var date = document.createElement("span");
            date.innerHTML = currentDay.dt_txt;
            currentDayContainer.appendChild(date);

            var icon = foreCastDays[i].weather[0].icon;
            var weatherIcon = document.createElement("img");
            weatherIcon.src = "https://openweathermap.org/img/w/" + icon + ".png";
            weatherIcon.classList = "w-25";
            currentDayContainer.appendChild(weatherIcon);


            var temp = foreCastDays[i].main.temp;
            var temperatureEl = document.createElement("span");
            temperatureEl.innerHTML = "Temperature: " + temp + "°F";
            currentDayContainer.appendChild(temperatureEl);

            var humidity = foreCastDays[i].main.humidity;
            var humidityEl = document.createElement("span");
            humidityEl.innerHTML = "Humidity: " + humidity + "%";
            currentDayContainer.appendChild(humidityEl);
        } 
    })
};


function formSubmitHandler(event) {
    event.preventDefault();
    getCityWeather();
    getForeCast();
};


searchButtonEl.addEventListener("submit", formSubmitHandler);