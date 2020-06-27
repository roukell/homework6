let cityList = document.querySelector(".city-section");

// display current time and date on weather forecast in .card-section
const currentTime = moment().format("MMMM Do YYYY, H:mm");
console.log(currentTime);
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
})

// call API for the 5 days forecast of cityEntered
const keyAPI = "4acbae4fdb0b64a992f7caade418dc6d";
const queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityArray[cityArray.length - 1] + "&appid=" + keyAPI;
const cityListJson = 

console.log(queryURL);

// create a function: to display current forecast of cityEntered in .card-section after user click search
function displayCurrentForecast() {
    // create AJAX call
    $.ajax({
        url:queryURL,
        method: "GET"
    }).then(function(response){
        // create a div to hold forecast information
        const forecastInfo = $("<div>");
        forecastInfo.addClass("forcastInfo");
        $(".current-selected-city").append(forecastInfo);

        // display cityEntered
        forecastInfo.text(cityArray[cityArray.length - 1]);

        // convert Kelvin to Celcius
        const celcius = Math.floor(response.list[0].main.temp - 273.15);

        $(".current-selected-city-details").append("<p>" + "Temperature: " + celcius + "&#8451;" + "</p>");
        $(".current-selected-city-details").append("<p>" + "Humidity: " + response.list[0].main.humidity + "</p>");
        $(".current-selected-city-details").append("<p>" + "Wind Speed: " + response.list[0].wind.speed + "</p>");

        // append weather icon
        const iconCode = response.list[0].weather[0].icon;
        const iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
        console.log(iconURL);
        $(".icon").attr("src", iconURL);


    })}

displayCurrentForecast();
