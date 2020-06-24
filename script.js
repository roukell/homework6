let cityList = document.querySelector(".city-section");


// get input from local storage
let storedCity = JSON.parse(localStorage.getItem("storedCity"));

if (storedCity !== null) {
    cityArray = storedCity;
} else {
    cityArray = new Array();
    cityArray[0] = "Sydney";
}

renderCities();

// console.log(cityArray);
// console.log(cityArray.length);

function renderCities() {
    for (i = 0; i < cityArray.length; i++) {
    console.log(cityArray[i]);
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

