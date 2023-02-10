
let todaysDate = moment().format("DD-MM-YYYY");
let formatter = new Intl.NumberFormat('en-US');

let URL = "https://api.coingecko.com/api/v3/coins/"


// In the construction of the buildQueryURL I have follow procedure used in class to construct the NYT search app.
function buildQueryURL(result) {
    // constructiong queryURL (URL of API)
    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";

    // Make an object containing API with the parameters to query: api-key, q (search term), begin_date,
    // end_date, ... (we willnot be using begin or end date)
    var queryPrmts = { "api-key": "R1a31F4tBjCUaM2ho8GtIFsrSdtXt30M" };

    // Get the search input and add to the object being constructed
    queryPrmts.q = result[0];

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
		console.log("NYT response:", response);
        //displayArticles(response);
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

$("#searchButton").on("click", function(event) {
	event.preventDefault();

	fetchTableData();
	
	$("#searchInput").val("")
});


