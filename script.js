$(".fa-search").on("click", function () {
    let cityEntered = $("input.input-section").val();
    const cityDiv = $("<div>");
    if (cityEntered !== "") {
            cityDiv.attr("class", "cityDiv");
            cityDiv.text(cityEntered);
            $(".city-section").prepend(cityDiv);
        }
})