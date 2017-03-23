// config .env
require('dotenv').config();

const ClaymoreMinerHandler = require('./lib/ClaymoreMinerHandler');
const ProfitChecker = require('./lib/ProfitChecker');

// var minerHandle = new MinerHandler();

// setup hashes based on their uri for whattomine; will eventually
// create a map to auto-translate from cointags
const algoHashes = {
  ethash: process.env.ETHASH,
  equihash: process.env.EQUIHASH,
  blake14r: process.env.BLAKE14R,
  blake2b: process.env.BLAKE2B,
  lbry: process.env.LBRY,
  pascal: process.env.PASCAL,
  cryptonight: process.env.CRYPTONIGHT
};

// pass algoHashes object and array of cointags to pick from. omitted ETH as good test
// var checker = new ProfitChecker(algoHashes, process.env.COINS);

// log out the max coin
// checker.getCoinProfitability().then(function(maxProfitCoin) {
//   console.log(maxProfitCoin);
// });

// log out all the coins associated with this algorithm
// checker.getCoinsByAlgo('cryptonight').then(function(matchingCoins) {
//   console.log(matchingCoins);
// });

// Try spawning miner and in new cmd.exe window
// var miner = new ClaymoreMinerHandler('ethash');

// test parse stats for miner using jsonrpc command
// setTimeout(() => miner.parseMinerStats().then((data) => {
//   console.log(data);
// }).catch((err) => {
//   console.error(err);
// }), 20000);

// test swapping miner to new algo
// miner.swapMiner('equihash');
