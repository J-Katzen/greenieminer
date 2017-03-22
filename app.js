const ClaymoreMinerHandler = require('./lib/ClaymoreMinerHandler');
const ProfitChecker = require('./lib/ProfitChecker');

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

// log out all the coins associated with this algorithm
// checker.getCoinsByAlgo('blakexvc').then(function(matchingCoins) {
//   console.log(matchingCoins);
// });

// Try spawning miner and logging out its io
var miner = new ClaymoreMinerHandler('ETHMINER', '72.193.192.26');

// miner.minerProcess.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });

// miner.minerProcess.stderr.on('data', (data) => {
//   console.log(`stderr: ${data}`);
// });

miner.getMinerStats().then((data) => {
  console.log(data.result);
}).catch((err) => {
  console.error(err);
});
