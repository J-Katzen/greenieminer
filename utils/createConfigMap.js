// @j-katzen
const _ = require("lodash");

function createConfigMap(coins = []) {
  let coinMinerCommands = {};
  _.forEach(coins, (coin) => {
    let minerCommands = [];
    let minerToUse = "";
    switch (coin) {
      case "ETH":
      case "ETC":
      case "EXP":
      case "UBQ":
        minerToUse = "ethash";
        minerCommands = ["-epool", "-ewal", "-epsw"];
        break;
      case "DCR":
      case "SC":
      case "LBRY":
      case "PASC":
        // not really, but they all use the ethash claymore miner
        minerToUse = "ethash";
        minerCommands = ["-dpool", "-dwal", "-dpsw"];
        break;
      case "ZEC":
      case "ZCL":
      case "ZDASH":
        minerToUse = "equihash";
        minerCommands = ["-zpool", "-zwal", "-zpsw"];
        break;
      case "XMR":
      case "KRB":
      case "BIP":
      case "XDN":
        minerToUse = "cryptonight";
        minerCommands = ["-o", "-u", "-p"];
        break;
    }

    coinMinerCommands[coin] = {
      miner: minerToUse,
      minerArgs: [
        minerCommands[0], process.env[`${coin}_POOL`], minerCommands[1],
        process.env[`${coin}_WAL`], minerCommands[2], process.env[`${coin}_PSW`],
        process.env[`${coin}_CUSTOM`]
      ]
    };
  });

  return coinMinerCommands;
}

module.exports = createConfigMap;
