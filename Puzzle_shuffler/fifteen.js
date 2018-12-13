// Name: Andrew Siew
// Date: 4/21/2018
// Section: AI
// TA : Jeremy
// Assignment : HW 4
// A script which produces the fifteen game and makes it playable with 
// a shuffle feature.

"use strict";

(function() {
	// Creates the 15 blocks for the games and gives functions to
	// a clicked block and the shuffle button.
	window.onload = function() {
		for (let i = 0; i < 4; i++) {
			let newContainer = document.createElement("DIV");
			newContainer.classList.add("container");
			$("puzzle-area").appendChild(newContainer);
			for (let j = 0; j < 4; j++) {
				let newEle = document.createElement("DIV");
				if(i != 3 || j != 3){
					newEle.classList.add("border");
					newEle.innerHTML = i * 4 + j + 1;
					let right = -i * 100;
					let left = -j * 100;
					newEle.style.backgroundPosition = left + "px " + right + "px";
					newEle.onclick = move;
					if((i == 3 && j == 2) || (i == 2 && j == 3)){
						newEle.classList.add("movable");
					}
				}else {
					newEle.setAttribute("id", "empty");
				}
				newContainer.appendChild(newEle);
				newEle.setAttribute("x-value", j);
				newEle.setAttribute("y-value", i);
			}
		}
		$("copyright-info").innerHTML = "&copy 2018 by <a href='https://game-insider.com/2011/08/10/" + 
										"assassins-creed-revelations-beta-coming-to-playstation-plus-up" +
										"lay/assassins-creed-revelations-400x400/'>Gamer Insider</a>";
		$("shuffle-button").onclick = shuffle;
	};

	// A helper function which helps get the element based on its id
	function $(id){
		return document.getElementById(id);
	}

	// Shuffles the game by making 1000 random moves.
	function shuffle(){
		for (let i = 0; i < 1000; i++) {
			let neighbours = getNeighbours();
			swap(neighbours[randomNumberGenerator(neighbours)], $("empty"));
		}
		resetMovable();
	}

	// Returns a list of neighbours around the empty block.
	function getNeighbours(){
		let neighbours = [];
		let containers = document.getElementsByClassName("container");
		let emptyBlock = $("empty");
		let xPosition = emptyBlock.getAttribute("x-value");
		let yPosition = emptyBlock.getAttribute("y-value");
		let temp;
		if(xPosition < 3){
			temp = 1 + parseInt(xPosition);
			neighbours.push(containers[yPosition].childNodes[temp]);
		}
		if (xPosition > 0){
			temp = -1 + parseInt(xPosition);
			neighbours.push(containers[yPosition].childNodes[temp]);
		}
		if (yPosition < 3){
			temp = 1 + parseInt(yPosition);
			neighbours.push(containers[temp].childNodes[xPosition]);
		}
		if (yPosition > 0){
			temp = -1 + parseInt(yPosition);
			neighbours.push(containers[temp].childNodes[xPosition]);
		}
		return neighbours;
	}

	// Return a random number based on the inputed list's length.
	function randomNumberGenerator(list){
		return parseInt(Math.random() * list.length);
	}

	// Swaps two blocks and takes 2 blocks as parameters.
	function swap(ele1, ele2) {
	    let temp = document.createElement("div");
	    let xValueTemp = ele1.getAttribute("x-value");
	    let yValueTemp = ele1.getAttribute("y-value");
	    ele1.setAttribute("x-value", ele2.getAttribute("x-value"));
		ele1.setAttribute("y-value", ele2.getAttribute("y-value"));
		ele2.setAttribute("x-value", xValueTemp);
		ele2.setAttribute("y-value", yValueTemp);
		ele1.parentNode.insertBefore(temp, ele1);
		ele2.parentNode.insertBefore(ele1, ele2);
		temp.parentNode.insertBefore(ele2, temp);
		temp.parentNode.removeChild(temp);
	}

	// Returns true if the block is a neighbour of the empty block.
	function isANeighbourOfEmpty(block) {
		return getNeighbours().indexOf(block) != -1;
	}

	// Makes a move by swapping the empty block with the clicked block.
	// Does nothing if the clicked block is not next to the empty block.
	function move(){
		if(isANeighbourOfEmpty(this)){
			swap($("empty"), this);
			resetMovable();
		}
	}

	function resetMovable(){
		let movables = document.getElementsByClassName("movable");
		for (let i = 0; i < movables.length; i++) {
			movables[i].classList.remove("movable");
		}
		let newMovables = getNeighbours();
		for (let i = 0; i < newMovables.length; i++) {
			newMovables[i].classList.add("movable");
		}
	}
})();