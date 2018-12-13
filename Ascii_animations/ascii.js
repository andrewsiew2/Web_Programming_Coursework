// Name: Andrew Siew
// Date: 4/14/2018
// Section: AI
// A script which give the buttons function and animates the 
// ascii character to be an animation.

"use strict";

(function() {

	let frameNumber = 0;
	let running = false;
	let currentInterval;
	let currentFrames;
	let currentSpeed = 250;

	// Gives buttons and dropboxes the function to do something 
	// based on a certain event.
	window.onload = function() {
		$("animation-dropbox").onchange = initialFrame;
		$("size-dropbox").onchange = changeSize;
		$("start_button").onclick = changeText;
		$("stop_button").onclick = stopText;	
		document.buttons.speed.onchange = changeSpeed;
		let radioButtons = document.getElementsByName("speed");
		for (let i = 0; i < radioButtons.length; i++) {
			radioButtons[i].onclick = changeSpeed;
		}
	};

	// A helper function which helps get the element based on its id
	function $(id){
		return document.getElementById(id);
	}

	// Changes the text in the text box based on the current interval speed 
	// and current frames of each animation. Will also disable some features
	// while animations are happening.
	function changeText() {
		flipDisableOption();
		running = true;
		currentFrames = $("text-area").value;
		currentInterval = setInterval(insertFrame, currentSpeed);
	}

	// Inserts a frame of the animation into the text area.
	function insertFrame(){
		let animation_frames = currentFrames.split("=====\n");
		$("text-area").value = animation_frames[frameNumber]; 
		frameNumber++;
		frameNumber = frameNumber % animation_frames.length;
	}

	// Inserts all the frames into the text box where each frame is divided. 
	function initialFrame() {
		$("text-area").value = ANIMATIONS[$("animation-dropbox").value];
	}

	// Changes the speed of the animation while there is an animnation running.
	function changeSpeed() {
		currentSpeed = getSpeed();
		if (running) {
			clearInterval(currentInterval);
			currentInterval = setInterval(insertFrame, currentSpeed);
		}
	}

	// Changes the size of the fonts of the text area.
	function changeSize(){
		$("text-area").style.fontSize = $("size-dropbox").value;
	}

	// Returns the speed of the option selected.
	function getSpeed() {
		let all_speed = document.getElementsByName("speed");
		for (let i = 0; i < all_speed.length; i++) {
			if (all_speed[i].checked) {
				return all_speed[i].value;
			}
		}
	}

	// Stops the animation and displays the default frame. 
	// Enables use of the disabled features.
 	function stopText() {
 		running = false;
 		frameNumber = 0;
 		flipDisableOption();
		clearInterval(currentInterval);
		$("text-area").value = currentFrames;
	}

	// The function which enables and disables some features.
	function flipDisableOption() {
		$("start_button").disabled = !$("start_button").disabled;
		$("stop_button").disabled = !$("stop_button").disabled;
		$("animation-dropbox").disabled = !$("animation-dropbox").disabled;
	}
})();