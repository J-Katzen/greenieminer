const publicIp = require('public-ip');
const rpc = require('jayson');
const spawn = require('child_process').spawn;
const path = require('path');
const process = require('process');
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

// setup miner command constant
const handlerCommands = {
  CONFIG: 'miner_file',
  RESTART: 'miner_restart',
  REBOOT: 'miner_reboot',
  STATS: 'miner_getstat1'
};

const MINERS = {
  ETHMINER: path.normalize(`${__dirname}/../miners/eth/EthDcrMiner64.exe`),
  EQUIHASH: path.normalize(`${__dirname}/../miners/equihash/ZecMiner64.exe`)
}

class ClaymoreMinerHandler {

  // instantiate the netcat client and identify the miner
  constructor(minerToSpawn, minerHost = null, minerPort = null) {
    // this.netcatClient = netcat.client(3333, 'localhost');
    this.identifyMiner();
    this.chosenMiner = minerToSpawn;
    // this.minerProcess = this.spawnMiner(MINERS[minerToSpawn]);
    this.rpcClient = rpc.client.tcp({
      port: minerPort || 3333,
      host: minerHost || 'localhost'
    });
  }

  // identify the miner by its ip address
  identifyMiner() {
    Promise.all([publicIp.v4(), publicIp.v6()]).then(ips => {
      console.log(`ipv4: ${ips[0]}`);
      console.log(`ipv6: ${ips[1]}`);
    });
  }

  spawnMiner(pathToMiner) {
    // temp for now; just testin
    let minerArgs = ['-epool', 'us-1-etc.ethermine.org:4444', '-ewal',
      '0x92c41e996d39b43168bfd5a6979b6dbde40dd1fe.GSE#', '-epsw', 'x'
    ];

    // spawn the process in its own detached window
    const processOptions = { detached: true, shell: true };

    return spawn(pathToMiner, minerArgs, processOptions);
  }

  getMinerStats() {
    return new Promise((resolve, reject) => {
      this.rpcClient.request(handlerCommands.STATS, [], (err, res) => {
        return err ? reject(err) : resolve(res);
      });
    })
  }
}

module.exports = ClaymoreMinerHandler;
