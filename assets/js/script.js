
let todaysDate = moment().format("DD-MM-YYYY");
let formatter = new Intl.NumberFormat('en-US');

let URL = "https://api.coingecko.com/api/v3/coins/";

// Array with cryptocoins
var coins = ["Bitcoin","Ethereum","Tether","BNB","USD Coin","XRP","Binance USD","Cardano","Dogecoin",
"Polygon","OKB","Lido Staked Ether","Solana","Polkadot","Shiba Inu","Litecoin","TRON","Avalanche","Dai",
"Uniswap","Cosmos Hub","Wrapped Bitcoin","Chainlink","Toncoin","LEO Token","Ethereum Classic","Monero",
"Bitcoin Cash","Hedera","Stellar","Aptos","Lido DAO","Filecoin","ApeCoin","Cronos","Quant","NEAR Protocol",
"Algorand","VeChain","Internet Computer","The Graph","The Sandbox","Fantom","Decentraland","Axie Infinity",
"EOS","Aave","MultiversX","Theta Network","Flow"];


function autocomplete(input, coins) {
	// function takes two arguments: text field element and cryptocoins array
	var currentFocus;
	// execute the function when text field is written in
	input.addEventListener("input", function(event) {
		// variable to store input value
		var val = this.value;

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
		for (let i = 0; i < coins.length; i++) {
			// compare substring (of length value) of the coin with the value (letters) entered
		  if (coins[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
			// create a div element for each matching element:
			let matchEl = document.createElement("div");
			// make the matching letters bold:
			matchEl.innerHTML = "<strong>" + coins[i].substr(0, val.length) + "</strong>";
			matchEl.innerHTML += coins[i].substr(val.length);
			// insert a input field that will hold the current array item's value:
			matchEl.innerHTML += "<input type='hidden' value='" + coins[i] + "'>";
			// execute a function when someone clicks on the item value (div element):
			matchEl.addEventListener("click", function(event) {
				// insert the value for the autocomplete text field:
				input.value = this.getElementsByTagName("input")[0].value;
				// close list of autocompleted values, (or any other open lists of autocompleted values)
				closeAutocompleteLists();
			});
			itemsEl.appendChild(matchEl);
		  }
		}
	});

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
    // Display 5 articles related to the cryptocoin of choice
    for (let i = 0; i < 5; i++) {
		// Variable to access the articles
        const article = data.response.docs[i];
		// Create list of articles
        let articleList = $("<ul>");
        $("#article-section").append(articleList);
        let articleListItem = $("<li>");
		// Create article headline, publication date, abstract and url link
        articleListItem.append("<h4> " + article.headline.main + "</h4>");
        articleListItem.append("<p> " + article.pub_date + "</p>");
        articleListItem.append("<p>" + article.abstract + "</p>");
        articleListItem.append("<a href='" + article.web_url + "'>" + article.web_url + "</a>");

        // Append the article to article list
        articleList.append(articleListItem);

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
    queryPrmts.q = result[0].name;

    // console.log API URL constructed for troubleshooting
    console.log("-------API URL--------\nURL: " + queryURL + $.param(queryPrmts) + "\n----------------------");
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
	let searchInput = $("#searchInput").val();

	console.log(searchInput);

	fetch(URL + "markets?vs_currency=usd&ids=" + searchInput + "&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h")
	.then((result) => {
	  return result.json();
	})
	.then((result) => {
	  console.log(result);
	  populateTable(result);
	  nyt(result);
	})
	.catch(function (error) {
	  console.log(error);
	});
};

function fetchGraphData() {
	const  searchInput = $("#searchInput").val();

	console.log(searchInput);

	const dateFrom = moment().subtract(7,'d').utc();
	const dateFromUnix = moment().subtract(7,'d').unix();
	console.log(dateFrom);
	console.log(dateFromUnix);
	const dateTo = moment().utc();
	const dateToUnix = moment().unix();
	console.log(dateTo);
	console.log(dateToUnix);

	
	fetch(URL + searchInput + "/market_chart/range?vs_currency=usd&from=" + dateFromUnix + "&to=" + dateToUnix)
	.then((result) => {
	  return result.json();
	})
	.then((result) => {
	  console.log(result.prices);
	})
	.catch(function (error) {
	  console.log(error);
	});
};


// Autocomplete as seen in   https://www.w3schools.com/howto/howto_js_autocomplete.asp
// Call autocomplete function before search button is clicked. Pass input and cryptocoin array as arguments.
autocomplete(document.getElementById("searchInput"), coins);


$("#searchButton").on("click", function(event) {
	event.preventDefault();

	fetchTableData();
	fetchGraphData();
	
	$("#searchInput").val("")
});


