var publicIp = require('public-ip');
/**
 * MinerHandler
 *
 * This manages and monitors the various miners. Is responsible
 * for swapping and reporting the miner status.
 *
 * It will also be what will handle sending and receiving data from
 * the DB.
 *
 */


"use strict";

class MinerHandler {
  constructor() {
    this.identifyMiner();
  }

  identifyMiner() {
    Promise.all([publicIp.v4(), publicIp.v6()]).then(ips => {
      console.log(`ipv4: ${ips[0]}`);
      console.log(`ipv6: ${ips[1]}`);
    });
  }
}

module.exports = MinerHandler;
