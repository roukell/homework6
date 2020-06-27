let cityList = document.querySelector(".city-section");

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

// create a function: to display current forecast of cityEntered in .card-section
function displayCurrentForecast() {
    // create AJAX call
    $.ajax({
        url:queryURL,
        method: "GET"
    }).then(function(response){

        // create a div to hold forecast information
        // const forecastInfo = $("<div>");
        // forecastInfo.addClass("forcastInfo");
        // $(".card-section").append(forecastInfo);
        console.log(cityArray[cityArray.length - 1]);
        console.log(response.list[0].main.temp);
        console.log(response.list[0].main.humidity);
        console.log(response.list[0].wind.speed);
    })

}

displayCurrentForecast();

