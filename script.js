const futureForcastSection = document.getElementsByClassName("future-forcast-section");
const cardSection = document.getElementsByClassName("card-section");
const currentSelectedCity = document.getElementsByClassName("current-selected-city");
const icon = document.getElementsByClassName("icon");
const currentSelectedCityDetails = document.getElementsByClassName("current-selected-city-details");
const cityList = document.querySelector(".city-section");
const clickedCity = $(this).text();
const today = Math.floor(new Date().getTime() / 1000.0);

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

renderCities();
displayCurrentForecast();

function renderCities() {
    cityList.innerHTML = "";
    for (i = 0; i < cityArray.length; i++) {
        let cityli = document.createElement("li");
        cityli.innerHTML = cityArray[i];
        cityList.appendChild(cityli);
    }
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

    renderCities();
    displayCurrentForecast();
    reset();
})

// create a function: to display current forecast of cityEntered in .card-section after user click search
function displayCurrentForecast() {
    // call API for the 5 days forecast of cityEntered
    const lastCityEntered = cityArray[cityArray.length - 1];
    const keyAPI = "4acbae4fdb0b64a992f7caade418dc6d";
    const queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + lastCityEntered + "&appid=" + keyAPI;

    // create AJAX call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
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
            console.log(date);
        }

        const reports = response.list;
        console.log(reports);
        for (const report of reports) {
            const reportDate = new Date(report.dt * 1000).getDate();
            dateBins[reportDate].push(report);
            console.log(reportDate);
        }

        // display TODAY's weather details in card-section
        const currentTempArray = dateBins[today.getDate()][0]
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
        const iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
        $(".icon").attr("src", iconURL);

        // create a loop to display five days data
        


    })
}

// create function when clicked on the cities in side bar
$("li").on("click", function (event) {
    reset();
    event.preventDefault();
    const clickedCity = $(this).text();
    // console.log(clickedCity);

    const keyAPI = "4acbae4fdb0b64a992f7caade418dc6d";
    const queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + clickedCity + "&appid=" + keyAPI;

    // create AJAX call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // create a div to hold forecast information
        const forecastInfo = $("<div>");
        forecastInfo.addClass("forcastInfo");
        $(".current-selected-city").append(forecastInfo);
        // display cityEntered
        forecastInfo.text(clickedCity);

        // convert Kelvin to Celcius
        const celcius = Math.floor(response.list[0].main.temp - 273.15);

        // append temp, humidity, wind speed
        $(".current-selected-city-details").append("<p>" + "Temperature: " + celcius + "&#8451;" + "</p>");
        $(".current-selected-city-details").append("<p>" + "Humidity: " + response.list[0].main.humidity + "%" + "</p>");

        // convert Mile to Kilometer
        const km = Math.floor(response.list[0].wind.speed * 1.60934);
        $(".current-selected-city-details").append("<p>" + "Wind Speed: " + km + " km/h" + "</p>");

        // append weather icon
        const iconCode = response.list[0].weather[0].icon;
        const iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
        $(".icon").attr("src", iconURL);
    })

})


function reset() {
    $(".current-selected-city").empty();
    $(".current-selected-city-details").empty();
    $(".icon").empty();
}