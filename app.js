var MinerHandler = require('./lib/MinerHandler');
var ProfitChecker = require('./lib/ProfitChecker');

// var minerHandle = new MinerHandler();

// setup hashes based on their uri for whattomine; will eventually
// create a map to auto-translate from cointags
const algoHashes = {
  ethash: 900.0,
  equihash: 7000.0,
  blake14r: 4350.0,
  lyra2rev2: 2000
};

// pass algoHashes object and array of cointags to pick from. omitted ETH as good test
var checker = new ProfitChecker(algoHashes, ['UBQ', 'DCR', 'ZEC', 'ETH', 'ETC', 'VTC']);

// log out the max coin
// checker.getCoinProfitability().then(function(maxProfitCoin) {
//   console.log(maxProfitCoin);
// });

checker.getCoinsByAlgo('blakexvc').then(function(matchingCoins) {
  console.log(matchingCoins);
});
