
let startPage = document.getElementById('start_page');
let startButton = document.getElementById("start_button")

startButton.addEventListener("click", function() {
	startPage.style.display = "none"
	startButton.style.zIndex = "-200"
})

