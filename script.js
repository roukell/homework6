const futureForcastSection = document.getElementById("future-forcast-section");
const currentSelectedCity = document.getElementsByClassName("current-selected-city");
const cityList = document.querySelector(".city-section");

// display current time and date on weather forecast in .card-section
const currentTime = moment().format("MMMM Do YYYY, H:mm");
const timeDisplay = $("<div>");
timeDisplay.text(currentTime);
$(".date-and-time").append(timeDisplay);

// get input from local storage
let storedCity = JSON.parse(localStorage.getItem("storedCity"));
if (storedCity !== null) {
    cityArray = storedCity;
} else {
    cityArray = [];
    cityArray[0] = "Sydney";
}

let lastCityEntered = cityArray[cityArray.length - 1];

renderCities();
displayCurrentForecast();

function renderCities() {
    cityList.innerHTML = "";
    for (i = 0; i < cityArray.length; i++) {
        let cityli = document.createElement("li");
        cityli.innerHTML = cityArray[i];
        cityList.appendChild(cityli);
    }
    // create function when clicked on the cities in side bar
$("li").on("click", function (event) {
    reset();
    event.preventDefault();
    lastCityEntered = $(this).text();
    displayCurrentForecast();
})
}

// when clicked on search icon
// new city will be saved in localStorage
$(".fa-search").on("click", function (event) {
    event.preventDefault();
    let cityEntered = $("input.input-section").val();

    if (cityEntered === "") {
        return;
    }

    for (i = 0; i < cityArray.length; i++) {
        if (cityEntered === cityArray[i]) {
            return;
        }
    }
    // push new city in cityArray
    // and store in localStorage
    cityArray.push(cityEntered);
    localStorage.setItem("storedCity", JSON.stringify(cityArray));

    lastCityEntered = cityEntered;
    renderCities();
    displayCurrentForecast();
    reset();
;})

   
// create a function: to display current forecast of cityEntered in .card-section after user click search
function displayCurrentForecast() {

    // call API for the 5 days forecast of cityEntered
    const keyAPI = "4acbae4fdb0b64a992f7caade418dc6d";
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + lastCityEntered + "&appid=" + keyAPI;
    // console.log(queryURL);
    // create AJAX call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        reset();
        // create a div to hold searched city name
        const forecastInfo = $("<div>");
        forecastInfo.addClass("forcastInfo");
        $(".current-selected-city").append(forecastInfo);
        forecastInfo.text(lastCityEntered);

        // changing the decleartion of today to new Date
        // it allows me to work with specific data of a date
        const today = new Date();
        const day = 60 * 60 * 24 * 1000;
        // setup an empty array dateBins for each date
        const dateBins = {};
        // nBins = 6 so there are 6 days of data
        const nBins = 6;

        for (let i = 0; i < nBins; i++) {
            const date = new Date(today.getTime() + i * day);
            dateBins[date.getDate()] = [];
            // console.log(date);
        }

        const reports = response.list;
        for (const report of reports) {
            const reportDate = new Date(report.dt * 1000).getDate();
            dateBins[reportDate].push(report);
            // console.log(reportDate);
        }

        // display TODAY's weather details in card-section
        // const currentTempArray = dateBins[today.getDate()][0];
        const currentTempArray = response.list[0];
       
        // convert Kelvin to Celcius
        const celcius = Math.floor(currentTempArray.main.temp - 273.15);
        // append temp, humidity, wind speed
        $(".current-selected-city-details").append("<p>" + "Temperature: " + celcius + "&#8451;" + "</p>");
        $(".current-selected-city-details").append("<p>" + "Humidity: " + currentTempArray.main.humidity + "%" + "</p>");
        // convert Mile to Kilometer
        const km = Math.floor(currentTempArray.wind.speed * 1.60934);
        $(".current-selected-city-details").append("<p>" + "Wind Speed: " + km + " km/h" + "</p>");
        // append weather icon
        const iconCode = currentTempArray.weather[0].icon;
        const iconURL = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
        $(".icon").attr("src", iconURL);

        // get UV index
        getUV();
        console.log(dateBins);

        // create a loop to display five days weather data
        for (let j = 1; j <= 5; j++) {
            const fiveDays = (new Date(today.getTime() + j * day));
            const year = fiveDays.getFullYear();
            let month = fiveDays.getMonth() + 1;
            const date = fiveDays.getDate();

            const futureArray = dateBins[date][0];
            const futureIconURL = "https://openweathermap.org/img/wn/" + futureArray.weather[0].icon + ".png";
            const futureTempCelcius = Math.floor(futureArray.main.temp - 273.15);
            const futureHumidity = futureArray.main.humidity;

            const html = (`
            <div class="future-card">
              <div class="future-card-body">
                <p class="future-title">${year}/${month}/${date}</p>
                <p><img class="icon" src="${futureIconURL}"></p>
                <p class="future-temp">Temp:${futureTempCelcius}&#8451;</p>
                <p class="future-humid">Humidity:${futureHumidity}%</p>
              </div>
            </div>
            `);

            futureForcastSection.insertAdjacentHTML("afterend", html);
        }
    })
}

function getUV() {
    const keyAPI = "4acbae4fdb0b64a992f7caade418dc6d";
    const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + lastCityEntered + "&appid=" + keyAPI;
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response){

        const lat = response.coord.lat;
        const lon = response.coord.lon;
        const UVqueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + keyAPI + "&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: UVqueryURL,
            method: "GET"
        }).then(function (UVdata) {
            $(".UVdiv").empty();
            const UV = UVdata.value;
            $(".current-selected-city-details").append("<p class='UVdiv'>" + "UV index: " + "<span id='UVdiv'>" + UV + "</span>" + "</p>");
        })
    }) 
}

function reset() {
    $(".current-selected-city").empty();
    $(".current-selected-city-details").empty();
    $(".icon").empty();
    $(".future-forcast-section").empty();
    $(".future-card").empty();
}