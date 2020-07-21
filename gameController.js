function newGame() {
    document.getElementById("menu").style.visibility = "hidden";
    document.getElementById("tippingPoints").style.visibility = "visible";
}

function openQuestions(tippingPointId) {
    console.log(tippingPointId);
    document.getElementById("question-container").classList.add("scale-out-from-center");
    document.getElementById("tippingPoints").classList.add("fade-out");
}