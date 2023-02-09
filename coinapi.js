var assetbackedcoin = [
    "equilibrium-eosdt",
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
]

var peggedcoin = [
    Italian Lira
    USDQ
    Qcash
    TerraUSD
    Dai
    Steem Dollars
    Frax
    Magic Internet Money
    Fei USD
    Tribe
    Neutrino USD
    sUSD
    Liquity USD
    Alchemix USD
    TOR
    XIDR
    Celo Dollar
    BiLira
    bitCNY
    YUSD Stablecoin
    USDX [Kava]
    Reserve
    Celo Euro
    Origin Dollar
    mStable USD
    Basis Cash
    Empty Set Dollar
    TerraKRW
    CryptoFranc
    NuBits
    BRCP TOKEN
]



$("button").on("click", function() {
    var button = $(this).attr("data-test");
    var queryURL = "https://pro-api.coingecko.com/api/v3/" +
      "ping";
  
    //coin ID can be obtained from https://www.coingecko.com/en/coins/bitcoin
    $.getJSON("https://api.coingecko.com/api/v3/simple/price?ids="+"bitcoin"+"&vs_currencies=usd&include_24hr_vol=true", function(response){
        console.log(response);
    });

  });