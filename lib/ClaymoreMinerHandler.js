const _ = require("lodash");
const publicIp = require("public-ip");
const rpc = require("jayson");
const spawn = require("child_process").spawn;
const exec = require("child_process").exec;
const path = require("path");
const schedule = require("node-schedule");
const os = require("os");

/**
 * @j-katzen
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
  CONFIG: "miner_file",
  RESTART: "miner_restart",
  REBOOT: "miner_reboot",
  STATS: "miner_getstat1"
};

const MINERS = {
  ethash: path.normalize(`${__dirname}/../miners/ethash/EthDcrMiner64.exe`),
  equihash: path.normalize(`${__dirname}/../miners/equihash/ZecMiner64.exe`),
  cryptonight: path.normalize(`${__dirname}/../miners/cryptonight/NsGpuCNMiner.exe`)
}

class ClaymoreMinerHandler {

  // instantiate the tcp rpcjson client and identify the miner by its ip
  constructor(minerToSpawn, minerArgs, minerHost = "localhost", minerPort = 3333) {
    this.identifyMiner();
    this.minerProcess = this.swapMiner(minerToSpawn, minerArgs);
    this.rpcClient = rpc.client.tcp({ port: minerPort, host: minerHost });

    // wait for first ping when spawning miner ping
    this.schedule = this.setupPingSchedule();
  }

  ping() {
    // identify miner by ip first
    return Promise.all([this.identifyMiner(), this.parseMinerStats()])
      .then((minerIdentity) => {
        console.log("pong!");
        this.ips = minerIdentity[0];
        this.stats = minerIdentity[1];
        return minerIdentity;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // setup miner pings to ping once a minute
  setupPingSchedule() {
    return schedule.scheduleJob("* * * * *", () => {
      console.log("ping!");
      return this.ping();
    });
  }

  // identify the miner by its ip address
  identifyMiner() {
    return Promise.all([publicIp.v4(), publicIp.v6()]).then(ips => {
      const minerIps = {
        ipv4: ips[0],
        ipv6: ips[1]
      };
      this.ips = minerIps;
      return minerIps;
    });
  }

  // spawn the cmd line process that runs the miner
  // and return the stdio
  spawnMiner(pathToMiner, minerArgs) {
    // spawn the process in its own detached window
    const processOptions = { detached: true, shell: true };

    return spawn(pathToMiner, minerArgs, processOptions);
  }

  // sends kill signal and spawns new miner with new args
  swapMiner(minerToSpawn, minerArgs) {
    // bail if we aren"t actually changing miners
    // if (this.chosenMiner === minerToSpawn) return this.minerProcess;

    this.killMiner();
    this.chosenMiner = minerToSpawn;

    this.minerProcess = this.spawnMiner(MINERS[minerToSpawn], minerArgs);

    return this.minerProcess;
  }

  killMiner() {
    if (!this.minerProcess) return true;

    // if windows, send taskkill signal through exec
    if (os.platform() === "win32") {
      exec(`taskkill /pid ${this.minerProcess.pid} /T /F`);
    // otherwise just use normal SIGTERM signal
    } else {
      this.minerProcess.kill();
    }
  }

  swapMiningArgs(minerArgs) {
    // send rpcjson miner_file
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
              let splitHashShares0 = stat.split(";");
              parsedStats.totalHash_0 = Number(splitHashShares0[0]);
              parsedStats.totalShares_0 = Number(splitHashShares0[1]);
              parsedStats.rejectedShares_0 = Number(splitHashShares0[2]);
              break;
            case 3:
              let splitGPUHashes0 = stat.split(";");
              _.forEach(splitGPUHashes0, (hash, gpuIdx) =>
                parsedStats[`GPU${gpuIdx}_0`] = Number(hash) || hash
              );
              break;
            case 4:
              let splitHashShares1 = stat.split(";");
              parsedStats.totalHash_1 = Number(splitHashShares1[0]);
              parsedStats.totalShares_1 = Number(splitHashShares1[1]);
              parsedStats.rejectedShares_1 = Number(splitHashShares1[2]);
              break;
            case 5:
              let splitGPUHashes1 = stat.split(";");
              _.forEach(splitGPUHashes1, (hash, gpuIdx) =>
                parsedStats[`GPU${gpuIdx}_1`] = Number(hash) || hash
              );
              break;
            case 6:
              let splitTempFans = stat.split(";");
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
  // then dual mining hash -- "off" if single mining
  // then temp0;fanspeed0;temp1;fanspeed1;...
  // mining pool
  // #;#;#;# ???
  getMinerStats() {
    return this.sendMinerCommand('STATS');
  }

  sendMinerFile() {
    return this.sendMinerCommand('CONFIG', ["config.txt", ``]);
  }

  sendMinerCommand(command, args = []) {
    return new Promise((resolve, reject) => {
      this.rpcClient.request(handlerCommands[command], args, (err, res) => {
        return err ? reject(err) : resolve(res);
      });
    });
  }
}

module.exports = ClaymoreMinerHandler;
