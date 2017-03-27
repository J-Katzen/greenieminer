// @j-katzen
// Main app
//
// config .env
require("dotenv").config();

const schedule = require("node-schedule");
const ClaymoreMinerHandler = require("./lib/ClaymoreMinerHandler");
const ProfitChecker = require("./lib/ProfitChecker");
const createConfigMap = require("./utils/createConfigMap");

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
// const checker = new ProfitChecker(algoHashes, process.env.COINS.split(","), process.env.COST);
// const minerHandler = new ClaymoreMinerHandler()

const checkCronSchedule = process.env.PERIOD === "HOURLY"
  // every hour "* */1 * * *"
  ? "* */1 * * *"
  // every day "* * */1 * *"
  : "* * */1 * *";


const coins = process.env.COINS.split(",");
const config = createConfigMap(coins);

const miner = new ClaymoreMinerHandler(config['ETH'].miner, config['ETH'].minerArgs);
const profitChecker = new ProfitChecker(algoHashes, coins);

schedule.scheduleJob(checkCronSchedule, () => {
  console.log("======= RUNNING AUTOSWAP =========");
  profitChecker.getCoinProfitability().then((maxProfitCoin) => {
    console.log(`======= AUTOSWAPPING TO ${maxProfitCoin.tag} =========`);
    miner.swapMiner(config[`${maxProfitCoin.tag}`].miner, config[`${maxProfitCoin.tag}`].minerArgs, maxProfitCoin.tag);
  });
});

// log out the max coin
// checker.getCoinProfitability().then((maxProfitCoin) => {
//   console.log("=========================================");
//   console.log("GOT MOST PROFITABLE COIN BASED ON CONFIG");
//   console.log("=========================================");
//   console.log(maxProfitCoin);
// });

// log out all the coins associated with this algorithm
// setTimeout(() => {
// checker.getCoinsByAlgo("ethash").then((matchingCoins) => {
//   console.log("=========================================");
//   console.log("GOT COINS BY ALGORITHM");
//   console.log("=========================================");
//   console.log(matchingCoins);
// });
// }, 1000);

// Try spawning miner and in new cmd.exe window
// var miner = new ClaymoreMinerHandler();

// test parse stats for miner using jsonrpc command
// setTimeout(() => miner.parseMinerStats().then((data) => {
//   console.log(data);
// }).catch((err) => {
//   console.error(err);
// }), 20000);

// test swapping miner to new algo
// miner.swapMiner("equihash");

// setup hashes for algo map
// const algoHashes = {
//   ethash: process.env.ETHASH,
//   equihash: process.env.EQUIHASH,
//   blake14r: process.env.BLAKE14R,
//   blake2b: process.env.BLAKE2B,
//   lbry: process.env.LBRY,
//   pascal: process.env.PASCAL,
//   cryptonight: process.env.CRYPTONIGHT
// };

// const coins = process.env.COINS.split(",");
// const config = createConfigMap(coins);

// const miner = new ClaymoreMinerHandler(config['ETC'].miner, config['ETC'].minerArgs);
// const profitChecker = new ProfitChecker(algoHashes, coins);
// while (typeof x === "undefined") {
  // console.log("============== MINER SWAP TEST ================");
  // console.log("...spawning initial miner on ETC");
  // setTimeout(() => {
  //   console.log("miner processes?");
  //   // miner.hardKillMiner();
  //   miner.findWindowsMinerProcesses()
  //     .then((res) => {
  //       console.log('found');
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log('err');
  //       console.log(err);
  //     });


  // }, 1000);

  // console.log(`Checking most profitable coin from [whattomine.com]: ${coins}`);
  // setTimeout(() => {
  //   profitChecker.getCoinProfitability()
  //     .then((profitableCoin) => {
  //       console.log(`Most Profit: ${profitableCoin.tag}`);
  //       console.log(`...swapping miner to ${profitableCoin.tag}`);
  //       miner.swapMiner(config[`${profitableCoin.tag}`].miner, config[`${profitableCoin.tag}`].minerArgs);
  //       console.log("...sleeping for 10 seconds before swapping miner to ZEC manually");
  //       setTimeout(() => {
  //         console.log("...swapping miner to ZEC");
  //         miner.swapMiner(config['ZEC'].miner, config['ZEC'].minerArgs);
  //       }, 10000);
  //     });
  // }, 3000);


// for (;;) {
// }
// }
