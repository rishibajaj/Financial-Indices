let todaysDate = moment().format("DD-MM-YYYY");
let formatter = new Intl.NumberFormat('en-US');
let articleSection = $("#article-section");

//START of code for stablecoin index////
//Darwin - Need to use this custom array because stablecoins are not properly categorized
//stablecoins split into two arrays, this should allow indepth analysis as a nice-to-have feature

var assetBackedCoin = [
	'equilibrium-eosdt',
	"stableusd",
	"tether",
	"binance-usd",
	"usd-coin",
	"true-usd",
	"usdk",
	"reserve-rights-token",
	"stasis-eurs",
	"pax-gold",
	"husd",
	"paxos-standard",
	"tether-gold",
	"tether-eurt",
	"gemini-dollar",
	"xsgd",
	"rupiah-token",
	"reflexer-ungovernance-token",
	"standard-protocol",
	"vai",
	"xaurum",
	"digix-gold",
	"digixdao",
	"perth-mint-gold-token"
];

var peggedCoin = [
	"dai",
	"steem-dollars",
	"frax",
	"magic-internet-money",
	"fei-usd",
	"tribe-2",
	"neutrino",
	"nusd",
	"liquity-usd",
	"alchemix-usd",
	"tor",
	"straitsx-indonesia-rupiah",
	"celo-dollar",
	"bilira",
	"yusd-stablecoin",
	"usdx",
	"reserve",
	"celo-euro",
	"origin-dollar",
	"musd",
	"basis-cash",
	"empty-set-dollar",
	"cryptofranc",
	"brcp-token"
];

//globalcap 24H volume needs to be modified by adding the volume of these two coins. Otherwise the 24H volume data is not AS accurate
var globalCapModifer = [
	"bitcoin",
	"ethereum"
];

//counters begin
var stablecoinVol = 0
var globalCapMod = 0

//join 2 stablecoin arrays because they all fall under the stablecoin umbrella
var stablecoinArr = assetBackedCoin.concat(peggedCoin);
console.log("stablecoinArr: ", stablecoinArr);
var joinedStablecoinArr = stablecoinArr.join();
console.log("joinedStablecoinArr: ", joinedStablecoinArr);
var joinedGlobalCapModifer = globalCapModifer.join();

let coinURL = "https://api.coingecko.com/api/v3/coins/";

// Array with cryptocoins
//let coins = [];

function fetchCoins() {
	fetch(coinURL)
		.then((respose) => respose.json())
		.then((data) => {
			coins = document.createElement("coins");
			coins.text = data.map((x) => x.name);
			coins.value = data.map((x) => x.id);
		});
}
//pull data from API
fetchCoins();

let input = document.getElementById("searchInput");

//Execute function on keyup
input.addEventListener("keyup", (e) => {
	//loop through above array
	//Initially remove all elements
	removeElements();
	for (let i of coins.value) {
		//convert input to lowercase and compare with each string

		if (
			i.toLowerCase().startsWith(input.value.toLowerCase()) &&
			input.value != ""
		) {
			//create li element
			let listItem = document.createElement("li");
			//One common class name
			listItem.classList.add("list-items");
			listItem.style.cursor = "pointer";
			listItem.setAttribute("onclick", "displayNames('" + i + "')");
			//Display matched part in bold
			let word = "<b>" + i.substr(0, input.value.length) + "</b>";
			word += i.substr(input.value.length);
			//display the value in array
			listItem.innerHTML = word;
			document.querySelector(".list").appendChild(listItem);
		}
	}
});

function displayNames(value) {
	input.value = value;
	removeElements();
}

function removeElements() {
	//clear all the item
	let items = document.querySelectorAll(".list-items");
	items.forEach((item) => {
		item.remove();
	});
}


//fetch modifier to the Global Market Volume
function fetchglobalmod() {
	$.getJSON("https://api.coingecko.com/api/v3/simple/price?ids=" + joinedGlobalCapModifer + "&vs_currencies=usd&include_24hr_vol=true", function (response2) {
		globalCapModifer.forEach(element => {
			globalCapMod += response2[element].usd_24h_vol;
		});
		console.log("global cap mod", globalCapMod)
		return globalCapMod
	})
	return globalCapMod
}


//Fetch Global Market Volume - response.data.total_volume.usd
function indexExe() {
	$.getJSON("https://api.coingecko.com/api/v3/global", function (response) {
		console.log("global cap mod outside function", globalCapMod) //used to measure how long it took to return fetchglobalmod()
		let globalCap = response.data.total_volume.usd + globalCapMod;
		fetchStablecoinTable(globalCap)
	});
};

//fetch stablecoin table data then craft Index
function fetchStablecoinTable(globalCap) {
	fetch("https://api.coingecko.com/api/v3/simple/price?ids=" + joinedStablecoinArr + "&vs_currencies=usd&include_24hr_vol=true")
		.then((result) => {
			let stablecoinVol = 0
			console.log(result);
			return result.json();
		})
		//need to add up 24H volume of individual coins using a forloop then attach total to var=stablecoinVol
		.then((result) => {
			stablecoinArr.forEach(element => {
				stablecoinVol += result[element].usd_24h_vol;
				return
			});
			//now craft index
			console.log("stablecoin Volume Total", stablecoinVol)
			console.log("global volume", globalCap)
			let num = stablecoinVol / globalCap
			let n = num.toFixed(2)
			//attach stats to HTML
			let bigStatistic = $(".display-4")
				.text(("Stablecoin Index: " + n));
		})

};


async function index() {
	fetchglobalmod()
	await new Promise(resolve => setTimeout(resolve, 80)); //Darwin - fetchglobalmod() takes about ~20 milliseconds to return result. this is a temp fix. 3 API calls are being made currently but can be reduced to 2 with further refinement.
	indexExe();
}

index(); ////uncomment to activate, 
////END of code for stablecoin index////


function searchHistory(result) {
	let coinHis = result[0].id;
	console.log("-----history------: ", coinHis);
	// Check if there is any information in storage
	coinInStore = JSON.parse(localStorage.getItem('coinStored'));

	if (coinInStore === null) {
		coinInStore = [];
	}

	// Adding city searched to array if it is not already in it
	if (coinHis !== null && coinHis !== undefined) {
		if (!coinInStore.includes(coinHis)) {
			coinInStore.push(coinHis);
			if (coinInStore.length > 5) {
				coinInStore.shift();
			}
			// Stringify and store it
			localStorage.setItem('coinStored', JSON.stringify(coinInStore));
		}
	}
}

// Displaying list of cryptocoins in history
function renderCoinHistory(coinInStore) {

	// Deleting the cities list prior to adding new ones not to have repeated buttons
	$("#history").empty();

	// Looping through the array of cities
	for (var i = 0; i < coinInStore.length; i++) {
		// If ther is any null do not render it
		if (coinInStore[i] === null) {
			continue;
		}
		// Dynamicaly generating buttons for each city in the array
		var btn = $("<button>");
		// Add class of city-btn to our button
		btn.addClass("coin-btn");
		// Add data-attribute to each button
		btn.attr("data-name", coinInStore[i]);
		// Provides the initial button text
		btn.text(coinInStore[i]);
		// Add button to the #history div
		$("#history").prepend(btn);
	}
}


function autocomplete(input, stablecoinArr) {
	// function takes two arguments: text field element and cryptocoins array
	// Current focus on the autocomplete suggestion list
	var currentFocus;
	// execute the function when text field is written in
	input.addEventListener("input", function (event) {
		// variable to store input value
		var val = this.value;
		console.log("Autocomplete: ", val);

		//close any already open lists of autocompleted values
		closeAutocompleteLists();

		// if the input field is empty
		if (!val) {
			return false;
		}
		currentFocus = -1;
		//create div element that will contain the items (values)
		let itemsEl = document.createElement("div");
		itemsEl.setAttribute("id", this.id + "autocomplete-list");
		itemsEl.setAttribute("class", "autocomplete-items");
		// append the div element as a child of the autocomplete container
		this.parentNode.appendChild(itemsEl);
		// for each item in array, check if item starts with the same letters as the text field value
		for (let i = 0; i < stablecoinArr.length; i++) {
			// compare substring (of length value) of the coin with the value (letters) entered
			if (stablecoinArr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				// create a div element for each matching element:
				let matchEl = document.createElement("div");
				// make the matching letters bold:
				matchEl.innerHTML = "<strong>" + stablecoinArr[i].substr(0, val.length) + "</strong>";
				matchEl.innerHTML += stablecoinArr[i].substr(val.length);
				// execute a function when someone clicks on the item value (div element):
				// insert a input field that will hold the current array item's value:
				matchEl.innerHTML += "<input type='hidden' value='" + stablecoinArr[i] + "'>";
				matchEl.addEventListener("click", function (event) {
					// insert the value for the autocomplete text field:
					input.value = this.getElementsByTagName("input")[0].value;
					// close list of autocompleted values, (or any other open lists of autocompleted values)
					closeAutocompleteLists();
				});
				itemsEl.appendChild(matchEl);
			}
		}
	});

	// function to select autocomplete suggestions with keyboard:
	input.addEventListener("keydown", function (event) {
		var item = document.getElementById(this.id + "autocomplete-list");
		if (item) {
			item = item.getElementsByTagName("div");
		}
		if (event.keyCode == 40) {
			// If the arrow DOWN key is pressed, increase the currentFocus variable:
			currentFocus++;
			// and make the current item more visible:
			addActive(item);
		} else if (event.keyCode == 38) { //up
			// If the arrow UP key is pressed, decrease the currentFocus variable:
			currentFocus--;
			// and and make the current item more visible:
			addActive(item);
		} else if (event.keyCode == 13) {
			// If the ENTER key is pressed, prevent the form from being submitted,
			event.preventDefault();
			if (currentFocus > -1) {
				// and simulate a click on the "active" item:
				if (item) item[currentFocus].click();
			}
		}
	});

	function addActive(item) {
		// a function to classify an item as "active":
		if (!item) return false;
		// start by removing the "active" class on all items:
		removeActive(item);
		if (currentFocus >= item.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = (item.length - 1);
		// add class "autocomplete-active":
		item[currentFocus].classList.add("autocomplete-active");
	}

	function removeActive(item) {
		// a function to remove the "active" class from all autocomplete items:
		for (let i = 0; i < item.length; i++) {
			item[i].classList.remove("autocomplete-active");
		}
	}

	function closeAutocompleteLists(elmnt) {
		// close all autocomplete lists, except the one passed as an argument
		var item = document.getElementsByClassName("autocomplete-items");
		for (let i = 0; i < item.length; i++) {
			if (elmnt != item[i] && elmnt != input) {
				item[i].parentNode.removeChild(item[i]);
			}
		}
	}
	// execute the function when someone clicks in the document:
	document.addEventListener("click", function (event) {
		closeAutocompleteLists(event.target);

	});
}


function displayArticles(data) {
	articleSection.empty();
	// Display 5 articles related to the cryptocoin of choice
	for (let i = 0; i < 5; i++) {
		// Variable to access the articles
		const article = data.response.docs[i];

		console.log("Article: ", article);
		// Create list of articles
		let articleList = $("<ul>");
		articleSection.append(articleList);
		let articleListItem = $("<li>");
		if (article === undefined) {
			if (i === 0) {
				articleListItem.append("<h4>NYT does not contain any article related to the cryptocoin searched<h4>");
				// Append the article to article list
				articleList.append(articleListItem);
				break;
			} else {
				articleListItem.append("<h4>NYT does not contain any more articles related to the cryptocoin searched<h4>");
				// Append the article to article list
				articleList.append(articleListItem);
				break;
			}

		} else {
			// Create article headline, publication date, abstract and url link
			articleListItem.append("<h4> " + article.headline.main + "</h4>");
			articleListItem.append("<p> " + article.pub_date + "</p>");
			articleListItem.append("<p>" + article.abstract + "</p>");
			articleListItem.append("<a href='" + article.web_url + "'>" + article.web_url + "</a>");
			// Append the article to article list
			articleList.append(articleListItem);
		}




	}
}


// In the construction of the buildQueryURL I have follow procedure used in class to construct the NYT search app.
function buildQueryURL(result) {
	// constructiong queryURL (URL of API)
	var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";

	// Make an object containing API with the parameters to query: api-key, q (search term), begin_date,
	// end_date, ... (we willnot be using begin or end date)
	var queryPrmts = { "api-key": "R1a31F4tBjCUaM2ho8GtIFsrSdtXt30M" };

	// Get the search input and add to the object being constructed
	queryPrmts.q = result[0].id;

	// console.log API URL constructed for troubleshooting
	console.log("-------NYT API URL--------\nURL: " + queryURL + $.param(queryPrmts) + "\n----------------------");
	// Return the URL of the query
	var query = queryURL + $.param(queryPrmts);
	return query;
}

function nyt(result) {
	// Obtain the NYT url calling the build function
	var queryURL = buildQueryURL(result);
	// Creating an AJAX call for the NYT API
	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function (response) {
		console.log("response nyt: ", response);
		displayArticles(response);
	});
}

function populateTable(result) {
	let response = result[0];

	let assetName = $(".assetName")
		.text(response.name);
	let priceUSD = parseInt(response.current_price);
	let price = $(".price")
		.text("$" + formatter.format(priceUSD));
	let changePercentage = (response.price_change_percentage_24h).toFixed(2);
	let priceChange = $(".priceChange")
		.text(changePercentage + "%");
	let volumeUSD = parseInt(response.total_volume);
	let totalVolume = $(".totalVolume")
		.text("$" + formatter.format(volumeUSD));
	let marketCapUSD = parseInt(response.market_cap);
	let marketCap = $(".marketCap")
		.text("$" + formatter.format(marketCapUSD));
};

function fetchTableData() {
	const searchInput = $("#searchInput").val();

	console.log(searchInput);

	const tableURL = coinURL + "markets?vs_currency=usd&ids=" + searchInput + "&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h";
	fetch(tableURL)
		.then((result) => {
			return result.json();
		})
		.then((result) => {
			console.log("-------Table URL--------\nURL: " + tableURL + "\n----------------------");
			console.log(result);
			populateTable(result);
			nyt(result);
			searchHistory(result);
			renderCoinHistory(coinInStore);
		})
		.catch(function (error) {
			console.log(error);
		});
};

function createGraph(graphData) {
	let graphArray = [];

	for (let i = 0; i < graphData.length; i++) {
		let object = { x: i, y: graphData[i][1] }
		graphArray.push(object);
	};

	JSC.Chart("chartDiv", {
		series: [
			{
				points: graphArray
			}
		]
	});
};

function fetchGraphData() {
	const searchInput = $("#searchInput").val().toLowerCase();

	console.log(searchInput);

	const dateFrom = moment().subtract(7, 'd').utc();
	const dateFromUnix = moment().subtract(7, 'd').unix();
	console.log(dateFrom);
	console.log(dateFromUnix);
	const dateTo = moment().utc();
	const dateToUnix = moment().unix();
	console.log(dateTo);
	console.log(dateToUnix);

	const graphURL = coinURL + searchInput + "/market_chart/range?vs_currency=usd&from=" + dateFromUnix + "&to=" + dateToUnix;
	fetch(graphURL)
		.then((result) => {
			return result.json();
		})
		.then((result) => {
			console.log("-------Graph URL--------\nURL: " + graphURL + "\n----------------------");
			let graphData = result.prices
			console.log(graphData);
			createGraph(graphData);
		})
		.catch(function (error) {
			console.log(error);
		});
};


// Autocomplete as seen in   https://www.w3schools.com/howto/howto_js_autocomplete.asp
// Call autocomplete function before search button is clicked. Pass input and cryptocoin array as arguments.
//autocomplete(document.getElementById("searchInput"), stablecoinArr);
//searchHistory(result);
//renderCoinHistory();

$("#searchButton").on("click", function (event) {
	event.preventDefault();

	$("#index-display").addClass("displayFlex");
	$(".show").removeClass("hide");

	articleSection.empty();
	fetchTableData();
	fetchGraphData();

	$("#searchInput").val("")
});

// Adding a click event listener to all elements with a class of "coin-btn"
$(document).on("click", ".coin-btn", function (event) {
	event.preventDefault();

	$("#index-display").addClass("displayFlex");
	$(".show").removeClass("hide");

	console.log("StoredCoinBtn: ", event.target.innerText);
	let coin = event.target.innerText.trim();
	// Calling function to workout geolocation
	$("#searchInput").val(coin);
	fetchTableData();
	fetchGraphData();
});

//click event listener on search field to clear it when performing new search
$("#searchInput").on("click", function (event) {
	event.preventDefault();

	$("#searchInput").val("")
});

//render search history to the page on start up
function init() {
	let coinInStore = JSON.parse(localStorage.getItem('coinStored'));
	if (coinInStore !== null) {
		renderCoinHistory(coinInStore);
	}
}

init();

