const locationSearchBtn = document.querySelector(".search-btn");
const mobileSearch = document.getElementsByClassName("search_bar mobile")[0];
const locationBtnMobile = document.querySelector(".location-btn");
const locationBtnDesktop = document.querySelector(".location_button");
const currentWeather = document.querySelector(".curent_weather");
const Result = document.querySelectorAll(".result");
const sunRise = document.querySelector(".sun_rise .result");
const sunSet = document.querySelector(".sun_set .result");
const humidity = document.querySelector(".humidity");
const pressure = document.querySelector(".pressure");
const visibilitySection = document.querySelector(".visibility");
const feelsLike = document.querySelector(".feels_like");
const table = document.querySelector(".forecast_table");
const locationMobile = document.querySelector(".location-mbl");
const locationDesktop = document.querySelector(".location-dsk");
const searchLocationMbl = document.querySelector(".click-mbl");
const searchLocationDesktop = document.querySelector(".click-desktop");
const time = document.querySelector(".time");
const wind = document.querySelector(".wind");
const tempGraphOne = document.querySelector(".temp-graph__one");
const tempName = document.querySelector(".temp-name");
const geoLocation = { latitude: "", longitude: "" };

//event listeners
document.addEventListener("DOMContentLoaded", getLocation); // on dom load it will call
locationBtnMobile.addEventListener("click", getLocation); // it will call on mobile location btn click
locationBtnDesktop.addEventListener("click", getLocation); // it will call on desktop location btn click
locationSearchBtn.addEventListener("click", searchBoxToggle); // input search box will show
searchLocationMbl.addEventListener("click", searchCity);
searchLocationDesktop.addEventListener("click", searchCity);

function searchCity() {
  const inputAddress = locationMobile?.value ?? locationDesktop.value;
  table.innerHTML=null;
  tempGraphOne.innerHTML="";
  tempName.innerHTML="";
  cityDataApi(inputAddress);
}
function call(e){
  console.log(e.preventDefault());
}

function searchBoxToggle() {
  mobileSearch.style.display = "block";
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(latLongApi);
  } else {
    return (x.innerHTML = "Geolocation is not supported by this browser.");
  }
}
async function latLongApi({ coords }) {
  weatherForecastApi(coords?.latitude, coords?.longitude);
  const url = `https://open-weather13.p.rapidapi.com/city/latlon/${coords?.latitude}/${coords?.longitude}`;

  const options = {
    method: "GET",
    headers: {
      'X-RapidAPI-Key': process.env.X_RAPID_API_KEY,
      'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
    }
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log("latLongApi", result);
    const { sys } = result;
    sunStatusHTML(sys.sunrise, sys.sunset);
  } catch (error) {
    console.error(error);
  }
}
async function cityDataApi(cityName) {
  // const url = `https://open-weather13.p.rapidapi.com/city/${cityName}`;
  const url =`/data/${cityName}.json`


  const options = {
    method: "GET",
    headers: {
      'X-RapidAPI-Key': process.env.X_RAPID_API_KEY,
      'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
    }
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    geoLocation.latitude = result.coord.lat;
    geoLocation.longitude = result.coord.lon;
    weatherForecastApi(geoLocation.latitude, geoLocation.longitude);
    console.log("cityDataApi", result);
  } catch (error) {
    console.error(error);
  }
}

async function weatherForecastApi(latitude, longitude) {
  const url = `https://open-weather13.p.rapidapi.com/city/fivedaysforcast/${latitude}/${longitude}`;
  const options = {
    method: "GET",
    headers: {
      'X-RapidAPI-Key': process.env.X_RAPID_API_KEY,
      'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
    }
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log("forecastApi", result);
    currentWeatherHTML(result);
    conditionHTML(result);
    fiveDaysCastHTML(result);
  } catch (error) {
    console.error(error);
  }
}



// html section
function currentWeatherHTML(data) {
  const { city, list } = data;
  const { main, weather, dt } = list[0];
  const weatherIcon = weather[0].icon + ".png";
  currentWeather.innerHTML = `
<p class="now">Now</p>
<div class="curent_temp">
    <p>${kelvinToCelcius(main.temp)}°c</sup></p>
    <img src=${"./assets/" + weatherIcon} />
</div>
<p class="cloud_type">${weather[0].description}</p>
<hr />
${getFullDate(dt)}
<p class="curent_location">${city.name}</p>`;
}

function sunStatusHTML(rise, set) {
  sunRise.innerHTML = getTime(rise).strTime;
  sunSet.innerHTML = getTime(set).strTime;
}

function conditionHTML(data) {
  const { list } = data;
  const { main, weather, visibility } = list[0];

  humidity.innerHTML = ` <p class="today_highlights_heading">Humidity</p>
    <img class="weather_img" src=${"/assets/" + weather[0].icon + ".png"}>
    <p class="result">${main.humidity}%</p>`;
  pressure.innerHTML = `<p class="today_highlights_heading">Pressure</p>
    <img class="weather_img" src=${"./assets/air1.png"}>
    <p class="result">${main.pressure}hPa</p>`;
  visibilitySection.innerHTML = `<p class="today_highlights_heading">Visibility</p>
    <img class="weather_img" src=${"./assets/13d.png"}>
    <p class="result">${visibility / 100} Km</p>`;
  feelsLike.innerHTML = `<p class="today_highlights_heading">Pressure</p>
    <img class="weather_img" src=${"./assets/air1.png"}>
    <p class="result">${kelvinToCelcius(main.feels_like) + "° C"}hPa</p>`;
  }
  
function fiveDaysCastHTML(data) {
  const { list, visibility } = data;
  

 
  list.forEach((data, i) => {

    for (let j = 0; j <= 6; j++) {
      const nowDate = new Date().getDate() + j;
      getTime(data.dt).today == nowDate &&
        getTime(data.dt).strTime == "5:30 AM" &&
        (table.innerHTML += `<tr>
            <td >
            <img class="weather_img_6day" src=${
              "./assets/" + data.weather[0].icon + ".png"
            } />
            </td>
            <td class="forecast_temp">${kelvinToCelcius(data.main.temp)}°C</td>
            <td>${
              getTime(data.dt).today + " " + getTime(data.dt).currentMonth
            }</td>
            <td>${getTime(data.dt).dayName}</td>
            </tr>`);
            
    }
    //   weather 7 days
    time.innerHTML += `
          <div class="hourly">
                            <p>${getTime(data.dt).strTime}</p>
                            <img class="today_at_weather_img" src=${
                              "./assets/" + data.weather[0].icon + ".png"
                            } />
                            <p>${kelvinToCelcius(data.main.temp)}°C</p>
                        </div>`;
    //   wind 7 days history
    wind.innerHTML += `<div class="hourly">
                        <p>${getTime(data.dt).strTime}</p>
                        <img class="today_at_weather_img" src="./assets/direction.png" style=transform:rotate(${
                          data.wind.deg + "deg"
                        }) />
                        <p>${data.wind.speed} Km/hr</p>
                    </div>`;
    // daywise graph
    if (getTime(data.dt).today== new Date().getDate()){
      tempGraphOne.innerHTML += `<div class="max-temp" style="height:${
        data.main.temp / 10
      }%; background:red; width:10%;"></div>`;
      tempName.innerHTML += `<p>${getTime(data.dt).strTime}</p>`;
    }
  });
}

function kelvinToCelcius(temp) {
  return Math.round(temp - 273.15);
}

function getFullDate(date) {
  return `<p class="curenttime">${getTime(date).strTime}</p>
  <p class="date">${
    getTime(date).today +
    ", " +
    getTime(date).currentMonth +
    " " +
    getTime(date).fullDate[2]
  }</p>`;
}

function getTime(time) {
  let month = [
    "Jan",
    "Feb",
    "Mar",
    "April",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let day = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const date = new Date(time * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  strTime = hours + ":" + minutes + " " + ampm;
  const fullDate = [date.getDay() + 1, date.getMonth(), date.getFullYear()];
  const currentMonth = month[fullDate[1]];
  const today = date.getDate();
  const dayName = day[fullDate[0]] ?? "Sunday";
  return { strTime, fullDate, currentMonth, today, dayName };
}
