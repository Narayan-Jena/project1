const locationSearchBtn = document.querySelector(".search-btn");
const mobileSearch = document.getElementsByClassName("search_bar mobile")[0];
const locationBtnMobile = document.querySelector(".location-btn");
const locationBtnDesktop = document.querySelector(".location_button");
const currentWeather = document.querySelector(".curent_weather");
const Result = document.querySelectorAll(".result");
const table = document.querySelector(".forecast_table");
const locationMobile = document.querySelector(".location-mbl");
const locationDesktop = document.querySelector(".location-dsk");
const searchLocationMbl = document.querySelector(".click-mbl");
const searchLocationDesktop = document.querySelector(".click-desktop");
const time = document.querySelector(".time");
const wind = document.querySelector(".wind");
const tempGraphOne = document.querySelector(".temp-graph__one");
const tempName = document.querySelector(".temp-name");
const latLong={latitude:"",longitude:""}
//event listeners
document.addEventListener("DOMContentLoaded", getLocation); // on dom load it will call
locationBtnMobile.addEventListener("click", getLocation); // it will call on mobile location btn click
locationBtnDesktop.addEventListener("click", getLocation); // it will call on desktop location btn click
locationSearchBtn.addEventListener("click", searchBoxToggle); // input search box will show
searchLocationMbl.addEventListener("click", searchCity);
searchLocationDesktop.addEventListener("click", searchCity);
function searchCity() {
  const inputAddress = locationMobile?.value ?? locationDesktop.value;
  callApi(false, inputAddress);
  weatherForecast(inputAddress);
}

function searchBoxToggle() {
  mobileSearch.style.display = "block";
}
let userLocation;
function getLocation() {
  if (navigator.geolocation) {
    userLocation = navigator.geolocation.getCurrentPosition(callApi);
  } else {
    return (x.innerHTML = "Geolocation is not supported by this browser.");
  }
}
async function weatherForecast(cityName){
  const url = `https://open-weather13.p.rapidapi.com/city/${cityName}`;
  // const url ="./"
  const options = {
      method: 'GET',
      headers: {
          'X-RapidAPI-Key': 'dbbea5cc8emsh0ed24e4017d9204p1086d1jsnbdc49b53104a',
          'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
      }
  };

try {
const response = await fetch(url, options);
const result = await response.json();
  latLong.latitude= result.coord.lat;
  latLong.longitude=result.coord.lon; 
  console.log(latLong);
} catch (error) {
console.error(error);
}
}


async function callApi({ coords }, InpCity) {
  const latLong = `${coords?.latitude}/${coords?.longitude}` ;
  console.log(latLong, InpCity);
  let weatherResult, weekData, url;
  // url = `https://open-weather13.p.rapidapi.com/city/latlon/${latLong}`;
  // url=`https://api.openweathermap.org/data/2.5/onecall?${latLong}&exclude=hourly,daily&appid=${API_KEY}`;
  if (InpCity) {
    url = `https://open-weather13.p.rapidapi.com/city/${InpCity}`
  }

  // url = "/js/dayWeather.json";
  const weekDataUrl =`https://open-weather13.p.rapidapi.com/city/fivedaysforcast/${latLong.latitude+"/"+latLong.longitude}`
  // const weekDataUrl = "./js/7day.json";
  console.log(weekDataUrl);
  const options = {
    method: "GET",
    headers: {
      'X-RapidAPI-Key': 'dbbea5cc8emsh0ed24e4017d9204p1086d1jsnbdc49b53104a',
      'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const resp = await fetch(weekDataUrl, options);
    const week = await resp.json();
    const result = await response.json();
    weatherResult = result;
    weekData = week;
    // callApi({coords})
    console.log("weekForecast",week,"result",result);
  } catch (error) {
    console.error(error);
  }

  const {
    main,
    name: city,
    weather,
    dt: date,
    sys: sunrise,
    visibility,
  } = weatherResult;
  console.log(main);

  const { list } = weekData;

  currentWeather.innerHTML = `
<p class="now">Now</p>
<div class="curent_temp">
    <p>${kelvinToCelcius(main.temp)}°c</sup></p>
    <img src=${"./assets/" + weather[0]?.icon + ".png"} />
</div>
<p class="cloud_type">${weather[0].description}</p>
<hr />
${getFullDate(date)}
<p class="curent_location">${weatherResult.name}</p>`;
  console.log(Result);
  Result[4].innerText = sunRise(sunrise.sunrise);
  Result[5].innerText = sunRise(sunrise.sunset);
  // Result[6].innerText = main.humidity + "%";
  // Result[7].innerText = main.pressure + "hPa";
  // Result[8].innerText = visibility / 1000 + "KM";
  // Result[9].innerText = kelvinToCelcius(main.feels_like) + "° C";

  const dataAr = list.filter((data) =>{ getTime(data.dt).today === new Date().getDate() && console.log(data.main.temp)});
  console.log(dataAr);
  list.forEach((data, i) => {
    // console.log(data.main.temp_max, data.main.temp_min, data);
    tempGraph(data.main.temp_max, data.main.temp_min);
    for (let i = 0; i <= 6; i++) {
      const nowDate = new Date().getDate() + i;
      getTime(data.dt).today == nowDate &&
        getTime(data.dt).strTime == "5:30 AM" &&
        (table.innerHTML += `<tr>
      <td>
      <img class="weather_img_6day" src=${
        "./assets/" + data.weather[0].icon + ".png"
      } />
      </td>
      <td class="forecast_temp">${kelvinToCelcius(data.main.temp)}°C</td>
      <td>${getTime(data.dt).today + " " + getTime(data.dt).currentMonth}</td>
      <td>${getTime(data.dt).dayName}</td>
      </tr>`);
    }
    time.innerHTML += `
    <div class="hourly">
                      <p>${getTime(data.dt).strTime}</p>
                      <img class="today_at_weather_img" src=${
                        "./assets/" + data.weather[0].icon + ".png"
                      } />
                      <p>${kelvinToCelcius(data.main.temp)}°C</p>
                  </div>`;

    wind.innerHTML += `<div class="hourly">
                  <p>${getTime(data.dt).strTime}</p>
                  <img class="today_at_weather_img" src="./assets/direction.png" style=transform:rotate(${
                    data.wind.deg + "deg"
                  }) />
                  <p>${data.wind.speed} Km/hr</p>
              </div>`;
    console.log(getTime(data.dt).today === new Date().getDate());
  if(i>8)return;
      (tempGraphOne.innerHTML += `<div class="max-temp" style="height:${
        data.main.temp / 10
      }%; background:red; width:10%;"></div>`);
      tempName.innerHTML+=`<p>${getTime(data.dt).strTime}</p>`
  });
  list.forEach((data, i) => {});

  function sunRise(sys) {
    return getTime(sys).strTime;
  }
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
  const fullDate = [date.getDay() - 1, date.getMonth(), date.getFullYear()];
  const currentMonth = month[fullDate[1]];
  const today = date.getDate();
  const dayName = day[fullDate[0]] ?? "Sunday";
  return { strTime, fullDate, currentMonth, today, dayName ,date};
}



function tempGraph(maxTemps, minTemps) {
  // maxTemp.innerHTML += `<div class="max_temp">${maxTemps}</div>
  // <div class="min_temp">${minTemps}</div>`;
}
