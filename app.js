var MinerHandler = require('./lib/MinerHandler');
var ProfitChecker = require('./lib/ProfitChecker');

// var minerHandle = new MinerHandler();

const algoHashes = {
  eth: 900,
  equihash: 7000,
  bk14: 4350
};

var checker = new ProfitChecker(algoHashes, ['ETC', 'ETH', 'ZEC', 'UBQ', 'DCR', 'EXP']);

checker.getCoinProfitability().then(function(maxProfitCoin) {
  console.log(maxProfitCoin);
});

