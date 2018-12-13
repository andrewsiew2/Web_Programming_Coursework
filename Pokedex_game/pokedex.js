// Name: Andrew Siew
// Date: 5/9/2018
// Section: AI
// TA : Jeremy
// Assignment : HW 5
// A script that gives the functionality of a working Pokedex with the 3 starter pokemon 
// and you collect new pokemon. This allows the user to have pokemon battles and every
// defeated pokemon will be added to the pokedex. 

"use strict";

(function() {
	const endPoint = "https://webster.cs.washington.edu/pokedex/";
	const starterPokemon = ["Charmander", "Squirtle", "Bulbasaur"];
	let gameID;
	let playerID;
	let myPokemonMaxHP;
	let isfleeing = false;

	// Gives some button functionality 
	window.onload = function() {
		getAjaxRequest("pokedex.php?pokedex=all", displayPokemonIcons, false);
		$("start-btn").addEventListener("click", startGame);
		$("endgame").addEventListener("click", restart);
		$("flee-btn").addEventListener("click", flee);
		let moveSlot = qsa("#my-card .moves button");
		for (let i = 0; i < moveSlot.length; i++){
			moveSlot[i].addEventListener("click", makesAMove);
		}
		
	};

	// Restarts the entire game by hiding components only shown in battle mode.
	function restart() {
		$("endgame").classList.add("hidden");
		$("results-container").classList.add("hidden");
		$("their-card").classList.add("hidden");
		$("start-btn").classList.remove("hidden");
		$("pokedex-view").classList.remove("hidden");
		$("title").innerText = "Your Pokedex";
		$("flee-btn").classList.add("hidden");
		$("flee-btn").disabled = false;
		$("p1-turn-results").innerText = "";
		$("p2-turn-results").innerText = "";
		isfleeing = false;
		qs("#my-card .hp").innerText = myPokemonMaxHP + "HP";
		qs("#my-card .health-bar").style.width = "100%";
		qs("#their-card .health-bar").style.width = "100%";
		qs("#my-card .health-bar").classList.remove("low-health");
		qs("#their-card .health-bar").classList.remove("low-health");
		qs("#my-card .hp-info").classList.add("hidden");
		
		let myBuffContainer = qs("#my-card .buffs");
		while (myBuffContainer.hasChildNodes()) {
		    myBuffContainer.removeChild(myBuffContainer.lastChild);
		}
		let theirBuffContainer = qs("#their-card .buffs");
		while (theirBuffContainer.hasChildNodes()) {
		    theirBuffContainer.removeChild(theirBuffContainer.lastChild);
		}
	}

	// Changes the view to battle mode when a pokemon has been chosen
	function startGame() {
		$("pokedex-view").classList.add("hidden");
		$("start-btn").classList.add("hidden");
		$("their-card").classList.remove("hidden");
		$("flee-btn").classList.remove("hidden");
		qs("#their-card .buffs").classList.remove("hidden");
		qs("#my-card .buffs").classList.remove("hidden");
		$("results-container").classList.remove("hidden");
		$("title").innerText = "Pokemon Battle Mode!";
		qs("#my-card .card-container .hp-info").classList.remove("hidden");
		let url = endPoint + "game.php";
		let data = new FormData();
		
		data.append("startgame", true);
		data.append("mypokemon", qs("#my-card .card .pokemon-pic img").getAttribute("alt"));
		let moveSlot = qsa("#my-card .moves button");
		for(let i = 0; i < moveSlot.length; i++){
			moveSlot[i].disabled = false;
		}
		$("p1-turn-results").classList.remove("hidden");
		$("p2-turn-results").classList.remove("hidden");
		fetch(url, {method: "POST", mode: "cors", body: data})
			.then(checkStatus)
			.then(JSON.parse)
			.then(setTheirCard)
			.catch(error);
	}

	// Updates the wether the user has decided to flee or not.
	// True when the flee button is clicked.
	function flee() {
		isfleeing = true;
		makesAMove();
	}

	// Update the pokemon data as well as the unique playerID and gameID
	// @param data, the data that is returned from a call from the server
	function setTheirCard(data) {
		gameID = data.guid;
		playerID = data.pid;
		updateTheirCard(data);
	}

	// Updates the opponents the card when the battle begins.
	// @param data, the data of a pokemon
	function updateTheirCard(data) {
		let pokemonData = data;
		qs("#their-card .name").innerText = pokemonData.p2.name;
		qs("#their-card .hp").innerText = pokemonData.p2.hp + "HP";
		qs("#their-card .info").innerText = pokemonData.p2.info.description;
		qs("#their-card .pokepic").setAttribute("src", endPoint + pokemonData.p2.images.photo);
		qs("#their-card .pokepic").setAttribute("alt", pokemonData.p2.name.toLowerCase());
		qs("#their-card .type").setAttribute("src", endPoint + pokemonData.p2.images.typeIcon);
		qs("#their-card .weakness").setAttribute("src", endPoint + pokemonData.p2.images.weaknessIcon);
		let moveSlot = qsa("#their-card .moves button");
		let moveSlotName = qsa("#their-card .moves .move");
		let moveSlotDmg = qsa("#their-card .moves .dp");
		let moveSlotImg = qsa("#their-card .moves img");
		let numberOfMoves = pokemonData.p2.moves.length;
		for (let i = 0; i < numberOfMoves; i++) {
			let pokemonMove = pokemonData.p2.moves[i];
			moveSlotName[i].innerText = pokemonMove.name;
			moveSlotImg[i].setAttribute("src", endPoint + "icons/" + pokemonMove.type + ".jpg");
			if (pokemonMove.hasOwnProperty("dp")){
				moveSlotDmg[i].innerText = pokemonMove.dp + " DP";
			} else {
				moveSlotDmg[i].innerText = "";
			}
			moveSlot[i].classList.remove("hidden");
		}
		for (let i = numberOfMoves; i < 4; i++) {
			moveSlot[i].classList.add("hidden");
		}
	}

	// When a move is made a data is fetched based on the move that is clicked. 
	// Clicking on the flee button also counts as a move.
	// Display a pikachu running while waiting for the fetch.
	function makesAMove() {
		let url = endPoint + "game.php";
		let data = new FormData();
		if (isfleeing){
			data.append("movename", "flee");
		} else {
			data.append("movename", this.children[0].innerText.replace(" ", "").toLowerCase());
		}
		data.append("guid", gameID);
		data.append("pid", playerID);
		$("loading").classList.remove("hidden");
		fetch(url, {method: "POST", mode: "cors", body: data})
			.then(checkStatus)
			.then(JSON.parse)
			.then(battleUpdates)
			.catch(error);
	}

	// This updates the hp value and the hp-bar of a card.
	// Will also announce a victory or lose if a particular pokemon reaches 0hp
	// If won adds defeated pokemon to the pokedex.
	// @param data, the pokemon data
	//        cardID, the ID of the card to differentiate my card and their card
	function updateHP(data, cardID) {
		let card = $(cardID);
		let currentHp = data["current-hp"];
		let maxHp = data["hp"];
		let percentage = parseInt((currentHp/maxHp) * 100);
		if (percentage < 20){
			qs(cardID + ".health-bar").classList.add("low-health");
		}
		qs(cardID + ".health-bar").style.width = percentage + "%";
		qs(cardID + ".hp").innerText = currentHp + "HP";
		if (percentage === 0){
			$("endgame").classList.remove("hidden");
			if (cardID === "#their-card "){
				let defeatedPokemon = $(data.name);
				$("title").innerText = "You won!";
				defeatedPokemon.classList.add("found");
				defeatedPokemon.addEventListener("click", helperToGetPokemonData);
			} else {
				$("title").innerText = "You lost!";
			}

			let buttons = qsa("#my-card .moves button");
			for (let i = 0; i < buttons.length; i++){
				buttons[i].disabled = true;
			}
			$("flee-btn").disabled = true;
		}
	}

	// This updates the buffs of a particular card
	// @param data, the pokemon data
	//        cardID, the ID of the card to differentiate my card and their card
	function updateBuffs(data, cardID) {
		let buffContainer = qs(cardID + ".buffs");
		let buffs = data.buffs;
		let debuffs = data.debuffs;
		while (buffContainer.hasChildNodes()) {
		    buffContainer.removeChild(buffContainer.lastChild);
		}
		for (let i = 0; i < buffs.length; i++) {
			let buff = document.createElement("div");
			buff.classList.add("buff");
			buff.classList.add(buffs[i]);
			buffContainer.appendChild(buff);
		}
		for (let i = 0; i < debuffs.length; i++) {
			let debuff = document.createElement("div");
			debuff.classList.add("debuff");
			debuff.classList.add(debuffs[i]);
			buffContainer.appendChild(debuff);
		}
	}

	// Updates the current state of the battle by updating the hp, buffs and display the results.
	// Hides the loading gif of pikachu.
	// @param data, the data of the battle status which contains both
	//				pokemons' battle state
	function battleUpdates(data) {
		$("loading").classList.add("hidden");
		$("p1-turn-results").innerText = "Player 1 played " + data.results["p1-move"] +
										  " and " + data.results["p1-result"] + "!";
		if (data.results["p2-move"] === null || data.results["p2-result"] === null){
			$("p2-turn-results").classList.add("hidden");
		} else {
			$("p2-turn-results").innerText = "Player 2 played " + data.results["p2-move"] +
										      " and " + data.results["p2-result"] + "!";
		}
		let p1Data = data.p1;
		let p2Data = data.p2;
		gameID = data.guid;
		updateBuffs(p1Data, "#my-card ");
		updateBuffs(p2Data, "#their-card ");
		updateHP(p1Data, "#my-card ");
		updateHP(p2Data, "#their-card ");
	}

	// Fetches data and parses it if it is a JSON text file
	// @param endOfUrl, the end of the url of the fetch
	//        method, the method to be called in a succesful fetch
	//        isJSON, a boolean which notes if data returned is expected to be a JSON object
	function getAjaxRequest(endOfUrl, method, isJSON) {
		let url = endPoint + endOfUrl;
		if (isJSON){
			fetch(url, {mode: "cors"})
			.then(checkStatus)
			.then(JSON.parse)
			.then(method)
			.catch(error);
		} else {
			fetch(url, {mode: "cors"})
			.then(checkStatus)
			.then(method)
			.catch(error);
		}
		
	}

	// Displays all the sprites of the pokemon in the pokedex.
	// Only the 3 starter pokemon can be seen while the rest are hidden until found.
	// @param names, names of all the pokemon
	function displayPokemonIcons(names) {
		let pokemonNamesPairs = names.split("\n");
		let view = $("pokedex-view");
		for (let i = 0; i < pokemonNamesPairs.length; i++) {
			let singlePokemonPair = pokemonNamesPairs[i].split(":");
			let pokemonName = singlePokemonPair[0];
			let pokemonImg = singlePokemonPair[1];
			let newImg = document.createElement("img");
			newImg.setAttribute("src", endPoint + "sprites/" + pokemonImg);
			newImg.setAttribute("alt", pokemonName);
			newImg.setAttribute("id", pokemonName);
			newImg.classList.add("sprite");
			if (starterPokemon.includes(pokemonName)){
				newImg.classList.add("found");
				newImg.addEventListener("click", helperToGetPokemonData);
			}
			view.appendChild(newImg);

		} 
	}

	// A helper function which will run when a pokemon sprite is clicked
	function helperToGetPokemonData() {
		getAjaxRequest("pokedex.php?pokemon=" + this.getAttribute("alt").toLowerCase(), 
						displayCardData, true);
		$("start-btn").classList.remove("hidden");
	}

	// Displays a pokemons data onto the card when its sprite has been clicked
	// @param data, a pokemon's data
	function displayCardData(data) {
		let pokemonData = data;
		myPokemonMaxHP = pokemonData.hp;
		qs("#my-card .name").innerText = pokemonData.name;
		qs("#my-card .hp").innerText = pokemonData.hp + "HP";
		qs("#my-card .info").innerText = pokemonData.info.description;
		qs("#my-card .pokepic").setAttribute("src", endPoint + pokemonData.images.photo);
		qs("#my-card .pokepic").setAttribute("alt", pokemonData.name.toLowerCase());
		qs("#my-card .type").setAttribute("src", endPoint + pokemonData.images.typeIcon);
		qs("#my-card .weakness").setAttribute("src", endPoint + pokemonData.images.weaknessIcon);

		let moveSlot = qsa("#my-card .moves button");
		let moveSlotName = qsa("#my-card .moves .move");
		let moveSlotDmg = qsa("#my-card .moves .dp");
		let moveSlotImg = qsa("#my-card .moves img");
		let numberOfMoves = pokemonData.moves.length;
		for (let i = 0; i < numberOfMoves; i++) {
			let pokemonMove = pokemonData.moves[i];
			moveSlotName[i].innerText = pokemonMove.name;
			moveSlotImg[i].setAttribute("src", endPoint + "icons/" + pokemonMove.type + ".jpg");
			if (pokemonMove.hasOwnProperty("dp")){
				moveSlotDmg[i].innerText = pokemonMove.dp + " DP";
			} else {
				moveSlotDmg[i].innerText = "";
			}
			moveSlot[i].classList.remove("hidden");
		}
		for (let i = numberOfMoves; i < 4; i++) {
			moveSlot[i].classList.add("hidden");
		}
	}

	// A helper function which helps get the element based on its id
	// @param id, the id in the html file
	// @return an element
	function $(id) {
		return document.getElementById(id);
	}

	// A helper function which helps get the first element based on its query
	// @param selector, the query for an element
	// @return an element
	function qs(selector) {
		return document.querySelector(selector);
	}

	// A helper function which helps get the all element based on its query
	// @param selector, the query for an element
	// @return an array of elements
	function qsa(selector) {
		return document.querySelectorAll(selector);
	}

	// checks the response
	// @param response, the repsonse returned from the server
	// @returns text 
	function checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response.text();
		} else {
			return Promise.reject(new Error(response.status + ": " + response.statusText));
		}
	}

	// Displays an error message when a fetch fails
	// @param message, the error message returned from a failed fetch
	function error(message) {
		console.log("There is an error: " + message);
	}
})();