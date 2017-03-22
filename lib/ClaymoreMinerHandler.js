const _ = require('lodash');
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

  parseMinerStats() {
    return this.getMinerStats()
      .then((minerStats) => {
        let parsedStats = {};
        _.forEach(minerStats.result, (stat, idx) => {
          switch (idx) {
            case 0:
              parsedStats.minerVersion = stat;
              break;
            case 1:
              parsedStats.uptime = Number(stat);
              break;
            case 2:
              let splitHashShares0 = stat.split(';');
              parsedStats.totalHash_0 = Number(splitHashShares0[0]);
              parsedStats.totalShares_0 = Number(splitHashShares0[1]);
              parsedStats.rejectedShares_0 = Number(splitHashShares0[2]);
              break;
            case 3:
              let splitGPUHashes0 = stat.split(';');
              _.forEach(splitGPUHashes0, (hash, gpuIdx) =>
                parsedStats[`GPU${gpuIdx}_0`] = Number(hash) || hash
              );
              break;
            case 4:
              let splitHashShares1 = stat.split(';');
              parsedStats.totalHash_1 = Number(splitHashShares1[0]);
              parsedStats.totalShares_1 = Number(splitHashShares1[1]);
              parsedStats.rejectedShares_1 = Number(splitHashShares1[2]);
              break;
            case 5:
              let splitGPUHashes1 = stat.split(';');
              _.forEach(splitGPUHashes1, (hash, gpuIdx) =>
                parsedStats[`GPU${gpuIdx}_1`] = Number(hash) || hash
              );
              break;
            case 6:
              let splitTempFans = stat.split(';');
              _.forEach(splitTempFans, (tempFan, idx) => {
                if (idx % 2 === 0) {
                  parsedStats[`GPU${idx / 2}_temp`] = Number(tempFan) || tempFan;
                } else {
                  parsedStats[`GPU${((idx+1)/2)-1}_fan`] = Number(tempFan) || tempFan;
                }
              });
              break;
            case 7:
              parsedStats.minePool = stat;
              break;
          }
        });

        return parsedStats;
      })
      .catch((error) => {
        // reboot miner
        console.error(error);
    });
  }

  // RESPONSE:
  // miner version,
  // uptime minutes
  // followed by total hash (kh - eth, verify for others)/stale/invalid shares
  // hashrate of each card (kh)
  // total hash/stale/invalid of dual mined coin
  // then dual mining hash -- 'off' if single mining
  // then temp0;fanspeed0;temp1;fanspeed1;...
  // mining pool
  // #;#;#;# ???
  getMinerStats() {
    return new Promise((resolve, reject) => {
      this.rpcClient.request(handlerCommands.STATS, [], (err, res) => {
        return err ? reject(err) : resolve(res);
      });
    })
  }
}

module.exports = ClaymoreMinerHandler;
