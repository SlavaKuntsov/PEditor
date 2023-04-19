document.addEventListener('DOMContentLoaded', function() {
	let startPage = document.querySelector('.start_page');
	let startButton = document.getElementById("start_button")
	
	if(startPage) {
		startButton.addEventListener("click", function() {
			startPage.style.opacity = "0"
			function display () {
				startPage.style.display = "none"
			}
			setTimeout(display, 300)
		})
	}	
});

