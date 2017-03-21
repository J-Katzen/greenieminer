var MinerHandler = require('./lib/MinerHandler');
var ProfitChecker = require('./lib/ProfitChecker');

// var minerHandle = new MinerHandler();

// setup hashes based on their uri for whattomine; will eventually
// create a map to auto-translate from cointags
const algoHashes = {
  eth: 900,
  equihash: 7000,
  bk14: 4350
};

// pass algoHashes object and array of cointags to pick from. omitted ETH as good test
var checker = new ProfitChecker(algoHashes, ['ETC', 'ZEC', 'UBQ', 'DCR', 'EXP']);

// log out the max coin
checker.getCoinProfitability().then(function(maxProfitCoin) {
  console.log(maxProfitCoin);
});

