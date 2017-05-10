# greenieminer

A nodejs script that will monitor [whattomine.com](http://whattomine.com/coins/) for the most profitable coin. It can launch and autoswap Claymore's Ethash, Equihash, and CryptoNight miners.

Claymore Dual ETH/SC/DCR/PASC Miner - [google drive link](https://drive.google.com/open?id=0B69wv2iqszefdFZUV2toUG5HdlU)

Claymore Zcash Miner - [google drive link](https://drive.google.com/drive/folders/0B69wv2iqszefdmJickl5MF9BOEE?usp=sharing)

Put miners into miners/ seperated by algo.

eth miner goes into miners/eth/claymore
zec miner goes into miners/equihash/claymore

# To Do:

1. ~Make application servers run mining software and detach (bash for windows?)~
2. ~Get status and change to most profitable coin every X minutes~
3. ~Create configuration options~
  - ~Wallet payout addresses (type of wallet, address string)~
  - ~mining pool addresses (type of pool, address string)~
  - optional: handle hard setting a % of servers to a certain pool/coin
4. Record miner statuses every minute, hour, day, week, month and aggregate (table of stats)
5. Display stats per miner
6. Display miner status up or down and last ping time (table of pings)

Manual Deployment:

- Nodejs >= v7
- Install [Yarn](https://yarnpkg.com/lang/en/docs/install/)
- Run `yarn` to install nodejs packages
