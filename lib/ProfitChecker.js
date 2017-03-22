var request = require('request-promise');
var encodeQueryData = require('../utils/encodeQueryData');
var _ = require('lodash');

/**
 * ProfitabilityChecker
 *
 * This manages the checking of profitability on a schedule
 * for the miner.
 *
 */


// NOTES:
// whattomine url query params to algo mappings

// Ethash => eth
// Groestl => gro
// X11Gost => x11g
// CryptoNight => cn
// Equihash => eq
// Lyra2REv2 => lre=true, factor[lrev2_*]
// NeoScrypt => ns
// LBRY => lbry
// Blake (2b) => bk2b
// Blake (14r) => bk14
// Blake (XVC) => bkv
// Pascal => pas

// factor suffix defs
// _hr => hashrate (Mh/s) for Ethash, Groestl, X11Gost, LBRY, Blake (2b), Blake (14r), Pascal
//                 (h/s) for CryptoNight, Equihash
//                 (kh/s) for Lyra2REv2, NeoScrypt
// _p => power (watts)

// extra params
// factor[cost]=0.11 (ex. 11 cents)
// volume=0_1 (ex. > 0.1, default: volume=0) [0, 0_1, 0_5, 1, 5, 10, 50, 100]
// revenue=24h [current, 24h, 3d, 7d]
// factor[exchanges][]: bittrex, bleutrade, btc_e, bter, c_cex, cryptopia, poloniex, yobit

// Full URL
// http://whattomine.com/coins?utf8=✓&eth=true&factor[eth_hr]=3525.0&factor[eth_p]=15000.0&grof=true&factor[gro_hr]=2125.0&factor[gro_p]=15625.0&x11gf=true&factor[x11g_hr]=662.5&factor[x11g_p]=15625.0&cn=true&factor[cn_hr]=82500.0&factor[cn_p]=12500.0&eq=true&factor[eq_hr]=35000.0&factor[eq_p]=13750.0&lre=true&factor[lrev2_hr]=550000.0&factor[lrev2_p]=15000.0&ns=true&factor[ns_hr]=0.0&factor[ns_p]=0.0&lbry=true&factor[lbry_hr]=10000.0&factor[lbry_p]=17500.0&bk2bf=true&factor[bk2b_hr]=117500.0&factor[bk2b_p]=20625.0&bk14=true&factor[bk14_hr]=200000.0&factor[bk14_p]=20625.0&pas=true&factor[pas_hr]=70000.0&factor[pas_p]=15000.0&bkv=true&factor[bkv_hr]=350000.0&factor[bkv_p]=21250.0&factor[cost]=0.11&sort=Profitability24&volume=0&revenue=24h&factor[exchanges][]=&factor[exchanges][]=bittrex&factor[exchanges][]=bleutrade&factor[exchanges][]=btc_e&factor[exchanges][]=bter&factor[exchanges][]=c_cex&factor[exchanges][]=cryptopia&factor[exchanges][]=poloniex&factor[exchanges][]=yobit&dataset=Main

"use strict";

const wtmQueryParamMap = {
  ethash: { name: 'Ethash', qp: 'eth' },
  groestl: { name: 'Groestl', qp: 'gro' },
  x11gost: { name: 'X11Gost', qp: 'x11g' },
  cryptonight: { name: 'CryptoNight', qp: 'cn' },
  equihash: { name: 'Equihash', qp: 'eq' },
  lyra2rev2: { name: 'Lyra2REv2', qp: 'lre', factorPrefix: 'lrev2' },
  neoscrypt: { name: 'NeoScrypt', qp: 'ns' },
  lbry: { name: 'LBRY', qp: 'lbry' },
  blake2b: { name: 'Blake (2b)', qp: 'bk2b' },
  blake14r: { name: 'Blake (14r)', qp: 'bk14' },
  blakexvc: { name: 'Blake (XVC)', qp: 'bkv' },
  pascal: { name: 'Pascal', qp: 'pas' }
};

class ProfitChecker {

  // preps the profitability checker
  constructor(algoHashes = {}, enabledCoinTags = []) {
    this.baseProfitUrl = 'https://whattomine.com/coins.json';
    this.algoHashes = algoHashes;
    this.enabledCoinTags = enabledCoinTags;
  }

  createWTMRequset(fullUrl = false) {
    const profitUrl = fullUrl ? this.buildFullUrl() : this.buildProfitUrl();
    const requestOptions = {
      uri: profitUrl,
      json: true
    };

    return request(requestOptions);
  }

  getCoinProfitability() {
    return this.createWTMRequset().then((res) => this.determineMostProfit(res))
      .catch((err) => {
        console.log(err);
        console.error('failed to get a response...');
      });
  }

  getCoinsByAlgo(algo) {
    return this.createWTMRequset(true).then((coinResponse) => {
      return _.filter(coinResponse.coins, (coin) =>
        wtmQueryParamMap[algo].name === coin.algorithm
      );
    });
  }

  determineMostProfit(coinResponse) {
    const coins = coinResponse.coins;
    let maxProfit = -1;
    let maxProfitCoin = null;

    for (let coinName in coins) {
      const isEnabledCoin = this.enabledCoinTags.indexOf(coins[coinName].tag) > -1;
      if (isEnabledCoin && coins[coinName].profitability24 > maxProfit) {
        maxProfit = coins[coinName].profitability24;
        maxProfitCoin = coins[coinName];
      }
    }

    return maxProfitCoin;
  }

  // creates the rest of the profit url
  buildProfitUrl() {
    let queryMap = {};
    for (let key in this.algoHashes) {
      queryMap[wtmQueryParamMap[key].qp] = true;
      if (this.algoHashes.hasOwnProperty(key)) {
        let factorKey = wtmQueryParamMap[key].factorPrefix || wtmQueryParamMap[key].qp;

        queryMap[`factor[${factorKey}_hr]`] = this.algoHashes[key];
      }
    }
    const queryParamString = encodeQueryData(queryMap);

    return `${this.baseProfitUrl}?${queryParamString}`;
  }

  buildFullUrl() {
    let queryMap = {};
    _.forEach(wtmQueryParamMap, (algo) => queryMap[algo.qp] = true);
    const queryParamString = encodeQueryData(queryMap);

    return `${this.baseProfitUrl}?${queryParamString}`;
  }
}

module.exports = ProfitChecker;

