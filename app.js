// @j-katzen
// Main app
//
// config .env
require("dotenv").config();

const ClaymoreMinerHandler = require("./lib/ClaymoreMinerHandler");
const ProfitChecker = require("./lib/ProfitChecker");

// var minerHandle = new MinerHandler();

// setup hashes for algo map
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
var checker = new ProfitChecker(algoHashes, process.env.COINS.split(","));

// log out the max coin
checker.getCoinProfitability().then((maxProfitCoin) => {
  console.log("=========================================");
  console.log("GOT MOST PROFITABLE COIN BASED ON CONFIG");
  console.log("=========================================");
  console.log(maxProfitCoin);
});

// log out all the coins associated with this algorithm
setTimeout(() => {
  checker.getCoinsByAlgo("equihash").then((matchingCoins) => {
    console.log("=========================================");
    console.log("GOT COINS BY ALGORITHM");
    console.log("=========================================");
    console.log(matchingCoins);
  });
}, 1000);

// Try spawning miner and in new cmd.exe window
// var miner = new ClaymoreMinerHandler("ethash");

// test parse stats for miner using jsonrpc command
// setTimeout(() => miner.parseMinerStats().then((data) => {
//   console.log(data);
// }).catch((err) => {
//   console.error(err);
// }), 20000);

// test swapping miner to new algo
// miner.swapMiner("equihash");
