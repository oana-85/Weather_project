function formatDate(timestamp) {
  let now = new Date(timestamp);
  let date = now.getDate();
  let year = now.getFullYear();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[now.getMonth()];
  return `${day}, <br /> ${date} ${month} ${year}`;
}
function formatHours(timestamp) {
  let time = new Date(timestamp);
  let hours = time.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}
let now = new Date();
let weekday = document.querySelector("#date-time.col-6.h1");
weekday.innerHTML = formatDate(now);
//time//
let time = document.querySelector("#time");
time.innerHTML = formatHours(now);
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class = "row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-sm-2">
        <div class="card">
            <div class="card-body">
                <div class="weather-forecast-date">
                ${formatDay(forecastDay.dt)}</div>
              <img class= "dailyForecastIcon" src="https://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@4x.png" alt="" width="42"/>
              <div class = "weather-forecast-temperatures">
                <span class="weather-forecast-temperature-max">
                ${Math.round(forecastDay.temp.max)}</span> /
                <span class "weather-forecast-temperature-min">
                ${Math.round(forecastDay.temp.min)}°C</span>
                <p class="weather"> ${forecastDay.weather[0].main}</p>
              </div>
            </div>
        </div>
    </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function searchInput(event) {
  event.preventDefault();
  let currentPlace = document.querySelector("#place");
  let inputCity = document.querySelector("#search-text-input");
  currentPlace.innerHTML = inputCity.value;
}
let enteredPlace = document.querySelector("#search");
enteredPlace.addEventListener("submit", searchInput);
function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "9d3ea23f6bf145bbb0d156ccb1b96e37";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
function displayWeather(response) {
  document.querySelector("h2").innerHTML = response.data.name;
  celsiusTemp = response.data.main.temp;
  document.querySelector("#temperature").innerHTML = Math.round(celsiusTemp);
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
  document
    .querySelector("#icon")
    .setAttribute("src", getIcon(response.data.weather[0].icon));
  time.innerHTML = formatHours(response.data.dt * 1000);
  getForecast(response.data.coord);
}
function getIcon(icon) {
  let iconElement = "";
  if (icon === "01d" || icon === "01n") {
    iconElement = "./media/animated/day.svg"; // day/night, clear sky
  } else if (icon === "02d") {
    iconElement = "./media/animated/cloudy-day-1.svg"; //cloudy day
  } else if (icon === "02n") {
    iconElement = "./media/animated/cloudy-night-1.svg"; //cloudy night
  } else if (icon === "03d") {
    iconElement = "./media/animated/cloudy.svg"; //scattered clouds
  } else if (icon === "03n") {
    iconElement = "./media/animated/cloudy.svg"; //scattered clouds
  } else if (icon === "04d") {
    iconElement = "./media/animated/cloudy.svg"; //broken clouds
  } else if (icon === "04n") {
    iconElement = "./media/animated/cloudy.svg"; //broken clouds
  } else if (icon === "09d") {
    iconElement = "./media/animated/rainy-1.svg"; //shower rain
  } else if (icon === "09n") {
    iconElement = "./media/animated/rainy-5.svg"; //shower rain
  } else if (icon === "10d") {
    iconElement = "./media/animated/rainy-4.svg"; //rain
  } else if (icon === "10n") {
    iconElement = "./media/animated/rainy-7.svg"; //rain
  } else if (icon === "11d") {
    iconElement = "./media/animated/thunder.svg"; //thunder
  } else if (icon === "11n") {
    iconElement = "./media/animated/thunder.svg"; //thunder
  } else if (icon === "13d") {
    iconElement = "./media/animated/snowy-1.svg"; //snow
  } else if (icon === "13n") {
    iconElement = "./media/animated/snowy-6.svg"; //snow
  }
  return iconElement;
}
function searchPlace(city) {
  let units = "metric";
  let apiKey = "9d3ea23f6bf145bbb0d156ccb1b96e37";
  let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndPoint}?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeather);
}
function handleSubmit(event) {
  event.preventDefault();
  let place = document.querySelector("#search-text-input").value;
  searchPlace(place);
}
function retrievePosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "9d3ea23f6bf145bbb0d156ccb1b96e37";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}
function showFahrenheit(event) {
  event.preventDefault();
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}
function showCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
}
let celsiusTemp = null;
let searchForm = document.querySelector("#search");
searchForm.addEventListener("submit", handleSubmit);
let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", getCurrentLocation);
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheit);
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsius);
searchPlace("Arbroath");