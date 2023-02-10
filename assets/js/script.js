
let todaysDate = moment().format("DD-MM-YYYY");
let formatter = new Intl.NumberFormat('en-US');

let URL = "https://api.coingecko.com/api/v3/coins/"


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


