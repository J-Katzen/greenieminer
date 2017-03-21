var publicIp = require('public-ip');
var netcat = require('node-netcat');
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

  // instantiate the netcat client and identify the miner
  constructor() {
    this.netcatClient = netcat.client(3333, 'localhost');
    this.identifyMiner();
  }

  // identify the miner by its ip address
  identifyMiner() {
    Promise.all([publicIp.v4(), publicIp.v6()]).then(ips => {
      console.log(`ipv4: ${ips[0]}`);
      console.log(`ipv6: ${ips[1]}`);
    });
  }
}

module.exports = MinerHandler;
