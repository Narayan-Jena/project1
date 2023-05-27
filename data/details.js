const table = document.querySelector(".forecast_table");
async function aa(){

 console.log(table);
    try {
        const response = await fetch("./js/7day.json");
        const {list} = await response.json();
    console.log(list);
      
    for(let i=0;i<=5;i++){
        console.log(list[i*5].dt_txt);

        table.innerHTML += `<tr>
            <td>
            <img class="weather_img_6day" src=${
                "./assets/" + list[i*5].weather[0].icon + ".png"
            } />
            </td>
            <td class="forecast_temp">${kelvinToCelcius(list[i*5].main.temp)}°C</td>
            <td>${
                getTime(list[i*5].dt).today + " " + getTime(list[i*5].dt).currentMonth
            }</td>
            <td>${getTime(list[i*5].dt).dayName}</td>
            </tr>`


        // const nowDate = new Date().getDate() + i;
        // getTime(list[i].dt).today == nowDate &&
        // getTime(list[i].dt).strTime == "5:30 AM" && 
        //  (table.innerHTML += `<tr>
        //     <td>
        //     <img class="weather_img_6day" src=${
        //         "./assets/" + list[i].weather[0].icon + ".png"
        //     } />
        //     </td>
        //     <td class="forecast_temp">${kelvinToCelcius(list[i].main.temp)}°C</td>
        //     <td>${
        //         getTime(list[i].dt).today + " " + getTime(list[i].dt).currentMonth
        //     }</td>
        //     <td>${getTime(list[i].dt).dayName}</td>
        //     </tr>`);

    }


    // result.list.forEach((data, i) => {
    //     for (let j = 0; j <= 6; j++) {
    //         const nowDate = new Date().getDate() + j;
    //         getTime(data.dt).today == nowDate &&
    //         getTime(data.dt).strTime == "5:30 AM" && console.log(data.dt_txt,j);
    //         // (table.innerHTML += `<tr>
    //         // <td>
    //         // <img class="weather_img_6day" src=${
    //         //     "./assets/" + data.weather[0].icon + ".png"
    //         // } />
    //         // </td>
    //         // <td class="forecast_temp">${kelvinToCelcius(data.main.temp)}°C</td>
    //         // <td>${
    //         //     getTime(data.dt).today + " " + getTime(data.dt).currentMonth
    //         // }</td>
    //         // <td>${getTime(data.dt).dayName}</td>
    //         // </tr>`);

            
           
    //     }
    // })
}catch(err){
    console.log(err);
}
}

aa()

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