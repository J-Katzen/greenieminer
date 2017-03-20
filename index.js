var express = require('express');
var app = express();
var _ = require('lodash');
var current = 'none';
var mostprofit = '';
var counter = 0;
var switchcoin = false;
var read = require('read-file');


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    var TableData;
    var request = require('request'),

        sys = require('util');

    request({
        uri: 'http://107.11.37.14:8000'
    }, function(error, response, body) {
        if (error && response.statusCode !== 200) {
            console.log('Error when contacting google.com')
        }

        // Print the google web page.

        var jsdom = require('jsdom');
        var fs = require('fs');
        var jquery = fs.readFileSync("./jquery-3.1.1.js").toString();

        var result;

        jsdom.env({
            html: body,
            src: [
                jquery
            ],
            done: function(errors, window) {
                var $ = window.jQuery;

                TableData = new Array();

                console.log($('table').html());
                $('table tr').each(function(row, tr) {
                    TableData[row] = {
                        "id": $(tr).find('td:eq(0)').text(),
                        "ip": $(tr).find('td:eq(1)').text(),
                        "uptime": $(tr).find('td:eq(2)').text(),
                        "ethhash": $(tr).find('td:eq(3)').text().split(',')[0].substr(0, 6),
                        "siastats": $(tr).find('td:eq(4)').text(),
                        "gputemps": $(tr).find('td:eq(5)').text(),
                        "pool": $(tr).find('td:eq(6)').text(),
                        "version": $(tr).find('td:eq(7)').text(),
                        "comments": $(tr).find('td:eq(8)').text()
                    }
                });
                TableData.shift();
                //TableData.shift();  // first row is the table header - so remove
                var result = TableData;
                var hash = 0;
                for (i = 0; i < result.length; i++) {
                    hash = parseFloat(hash) + parseFloat(TableData[i].ethhash);

                    console.log(hash.toFixed(2));
                }
                console.log(TableData);


            }

        });


    });


    result = TableData;
    response.render('pages/index', {
        result: result
    });


});





function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function profitabilityCheck() {

    etc = '{"id":0,"jsonrpc":"2.0","method":"miner_file","params":["config.txt","23205741524e494e47212052656d6f766520222322206368617261637465727320746f20656e61626c65206c696e65732c2077697468202223222074686579206172652064697361626c656420616e642077696c6c2062652069676e6f726564206279206d696e65722120436865636b20524541444d4520666f722064657461696c732e0d0a23205741524e494e4721204d696e6572206c6f616473206f7074696f6e732066726f6d20746869732066696c65206f6e6c7920696620746865726520617265206e6f7420616e79206f7074696f6e7320696e2074686520636f6d6d616e64206c696e65210d0a0d0a2d65706f6f6c207573312d6574632e65746865726d696e652e6f72673a343434340d0a2d6577616c203078393263343165393936643339623433313638626664356136393739623664626465343064643166652e475345230d0a2d6570737720780d0a2d6574686920370d0a"]}';
    eth = '{"id":0,"jsonrpc":"2.0","method":"miner_file","params":["config.txt","23205741524e494e47212052656d6f766520222322206368617261637465727320746f20656e61626c65206c696e65732c2077697468202223222074686579206172652064697361626c656420616e642077696c6c2062652069676e6f726564206279206d696e65722120436865636b20524541444d4520666f722064657461696c732e0d0a23205741524e494e4721204d696e6572206c6f616473206f7074696f6e732066726f6d20746869732066696c65206f6e6c7920696620746865726520617265206e6f7420616e79206f7074696f6e7320696e2074686520636f6d6d616e64206c696e65210d0a0d0a2d65706f6f6c207573312e65746865726d696e652e6f72673a343434340d0a2d6577616c203078383463616631646232636361346636366561636462626238346539623662313066373238393535642e475345230d0a2d6570737720780d0a2d6574686920360d0a"]}';
    etc_sc = '{"id":0,"jsonrpc":"2.0","method":"miner_file","params":["config.txt","23205741524e494e47212052656d6f766520222322206368617261637465727320746f20656e61626c65206c696e65732c2077697468202223222074686579206172652064697361626c656420616e642077696c6c2062652069676e6f726564206279206d696e65722120436865636b20524541444d4520666f722064657461696c732e0d0a23205741524e494e4721204d696e6572206c6f616473206f7074696f6e732066726f6d20746869732066696c65206f6e6c7920696620746865726520617265206e6f7420616e79206f7074696f6e7320696e2074686520636f6d6d616e64206c696e65210d0a0d0a2d65706f6f6c207573312d6574632e65746865726d696e652e6f72673a343434340d0a2d6577616c203078393263343165393936643339623433313638626664356136393739623664626465343064643166652e475345230d0a2d6570737720780d0a2d64636f696e2073630d0a2d64706f6f6c207374726174756d2b7463703a2f2f7369616d696e696e672e636f6d3a37373737200d0a2d6477616c20353666616533346335663631323031666534633535666137313931636333303437346130343064366239306135646433393236616461343537343037353062313833613537613135343064362e47534523200d0a2d64637269203138200d0a2d6574686920380d0a"]}';
    eth_sc = '{"id":0,"jsonrpc":"2.0","method":"miner_file","params":["config.txt","23205741524e494e47212052656d6f766520222322206368617261637465727320746f20656e61626c65206c696e65732c2077697468202223222074686579206172652064697361626c656420616e642077696c6c2062652069676e6f726564206279206d696e65722120436865636b20524541444d4520666f722064657461696c732e0d0a23205741524e494e4721204d696e6572206c6f616473206f7074696f6e732066726f6d20746869732066696c65206f6e6c7920696620746865726520617265206e6f7420616e79206f7074696f6e7320696e2074686520636f6d6d616e64206c696e65210d0a0d0a2d65706f6f6c207573312e65746865726d696e652e6f72673a343434340d0a2d6577616c203078383463616631646232636361346636366561636462626238346539623662313066373238393535642e475345230d0a2d6570737720780d0a2d64636f696e2073630d0a2d64706f6f6c207374726174756d2b7463703a2f2f7369616d696e696e672e636f6d3a37373737200d0a2d6477616c20353666616533346335663631323031666534633535666137313931636333303437346130343064366239306135646433393236616461343537343037353062313833613537613135343064362e47534523200d0a2d64637269203138200d0a2d6574686920380d0a"]}';
    eth_nicehash = '{"id":0,"jsonrpc":"2.0","method":"miner_file","params":["config.txt","23205741524e494e47212052656d6f766520222322206368617261637465727320746f20656e61626c65206c696e65732c2077697468202223222074686579206172652064697361626c656420616e642077696c6c2062652069676e6f726564206279206d696e65722120436865636b20524541444d4520666f722064657461696c732e0d0a23205741524e494e4721204d696e6572206c6f616473206f7074696f6e732066726f6d20746869732066696c65206f6e6c7920696620746865726520617265206e6f7420616e79206f7074696f6e7320696e2074686520636f6d6d616e64206c696e65210d0a0d0a2d65706f6f6c207374726174756d2b7463703a2f2f64616767657268617368696d6f746f2e7573612e6e696365686173682e636f6d3a333335330d0a2d6577616c2031374357354e574a5755546b70693241344a753354445348664e66797371426e466e2e475345230d0a2d6570737720780d0a2d65736d20330d0a2d616c6c706f6f6c7320310d0a2d657374616c6520300d0a2d6574686920360d0a"]}';
    eth_sc_nicehash = '{"id":0,"jsonrpc":"2.0","method":"miner_file","params":["config.txt","23205741524e494e47212052656d6f766520222322206368617261637465727320746f20656e61626c65206c696e65732c2077697468202223222074686579206172652064697361626c656420616e642077696c6c2062652069676e6f726564206279206d696e65722120436865636b20524541444d4520666f722064657461696c732e0d0a23205741524e494e4721204d696e6572206c6f616473206f7074696f6e732066726f6d20746869732066696c65206f6e6c7920696620746865726520617265206e6f7420616e79206f7074696f6e7320696e2074686520636f6d6d616e64206c696e65210d0a0d0a2d65706f6f6c207374726174756d2b7463703a2f2f64616767657268617368696d6f746f2e7573612e6e696365686173682e636f6d3a333335330d0a2d6577616c2031374357354e574a5755546b70693241344a753354445348664e66797371426e466e2e475345230d0a2d6570737720780d0a2d65736d20330d0a2d616c6c706f6f6c7320310d0a2d657374616c6520300d0a2d64636f696e2073630d0a2d64706f6f6c207374726174756d2b7463703a2f2f7369616d696e696e672e636f6d3a373737370d0a2d6477616c20353666616533346335663631323031666534633535666137313931636333303437346130343064366239306135646433393236616461343537343037353062313833613537613135343064362e475345230d0a2d646372692031380d0a2d6574686920380d0a"]}';

    restart = '{"id":0,"jsonrpc":"2.0","method":"miner_restart"}';
    reboot = '{"id":0,"jsonrpc":"2.0","method":"miner_reboot"}';
    stats = '{"id":0,"jsonrpc":"2.0","method":"miner_getstat1"}';

    etcpools = ['us1-etc.ethermine.org:4444', 'us1.epool.io:8008'];
    ethpools = ['daggerhashimoto.usa.nicehash.com:3353', 'us1.ethermine.org:4444'];
    zecpools = ['equihash.usa.nicehash.com:3357', 'us1-zcash.flypool.org'];


    //var check = _.includes(etcpools, "us1.epool.io:8008");


    //console.log(current);


 var buffer = read.sync(process.cwd() + '\\' + 'test.txt', 'utf8');
    buffer.toString('hex');
    const hex = Buffer.from(buffer, 'utf8');
  console.log(hex.toString('hex'));
  console.log(process.cwd());


var p = new Promise(function(resolve, reject) {


  // Do an async task async task and then...
    var Netcat = require('node-netcat');
    var client = Netcat.client(3333, 'localhost');


    client.on('open', function() {
        //console.log('connect');
        client.send(stats, true);
    });

    client.on('data', function(data) {
        var claymore = data.toString('ascii');
        var claymorejson = JSON.parse(claymore);
        result = claymorejson.result;
        if (claymorejson.result = true) {

            if (stats) {

                if (_.includes(etcpools, result[7].split(';')[0])) {
                    current = "ETC";
                    console.log("Currently mining ETC");
                    console.log("---------------------------------");
                    resolve('Success!');

                }

                if (_.includes(ethpools, result[7].split(';')[0])) {
                    current = "ETH";
                    console.log("Currently mining ETH");
                    console.log("---------------------------------");
                    resolve('Success!');

                }

                if (_.includes(zecpools, result[7].split(';')[0])) {
                    current = "ZEC";
                    console.log("Currently mining ZEC");
                    console.log("---------------------------------");
                    resolve('Success!');
                }

            }
            //console.log("Success!");
           //  console.log(result);
        }


    });

    client.on('error', function(err) {
        //console.log(err);

        if (current == "none") {
            console.log("Miner offline");
            console.log("---------------------------------");
            reject('Failure!');
            // current = "none";
        }
    });

    client.on('close', function() {
        //console.log('close');


    });
    client.start();

  if(current != 'none') {
   // resolve('Success!');
  }
  else {
   // reject('Failure!');
  }
});

p.then(function() {
  console.log("works");
  checkMostProfitable();
  /* do something with the result */
}).catch(function() {
  current = "launch";
  checkMostProfitable();
  console.log("error");
  /* error :( */
})

    if (current == 'none' || current == 'checking' || current == 'launching') {

        //console.log("Lets send API request to miners");
       // editConfig(stats);
    } else {


        console.log("Checking profitability");
        console.log("---------------------------------");
    //    checkMostProfitable();
    }

}


function checkMostProfitable() {

    request = require("request-json");
    var client = request.createClient('https://whattomine.com/');
    var eth_hr = '900';
    var equihash_hr = '7000';
    var maxValue = 0;
    var task = stats;
    client.get('coins/?eth=true&factor[eth_hr]=' + eth_hr + '&eq=true&factor[eq_hr]=' + equihash_hr, function(err, res, body) {
        //console.log(body.coins.Ethereum.profitability24);
        //console.log(body.coins.EthereumClassic.profitability24);
        // console.log(body.coins.Zcash.profitability24);
        body = body.coins;
        for (key in body) {
            if (body[key].profitability24 > maxValue) {
                maxValue = body[key];
            }
        }
        console.log(maxValue.tag + " is most profitable at " + maxValue.profitability24 + "% past 24 hours");
        console.log("---------------------------------");

        if (maxValue.tag == "ETC") {

            if (current != maxValue.tag) {
                task = etc_sc;
                console.log("Sending ETC+SC Configuration File");
                console.log("---------------------------------");
                counter++;
                switchcoin = true;
                editConfig(task);
            } else {
                console.log("Already on most profitable coin");
                console.log("---------------------------------");
            }
        }

        if (maxValue.tag == "ETH") {

            if (current != maxValue.tag) {
              console.log(current);
              console.log(counter);
                task = eth_sc;
                console.log("Sending ETH+SC Configuration File");
                console.log("---------------------------------");
                switchcoin = true;
                counter++;
                editConfig(task);
            } else {
                console.log("Already on most profitable coin");
                console.log("---------------------------------");
            }
        }

        if (maxValue.tag == "ZEC") {

            task = stats;
            counter++;
            switchcoin = true;
            console.log("Sending ZEC Configuration File");
            console.log("---------------------------------");
            editConfig(task);

        }
        //current = task;
        // console.log(task);


        if (current == "launch") {
            current = "launching";
            console.log("Launching Miner");
            console.log("---------------------------------");
            spawnMiner("zecminer");

        }
    });

}


function spawnMiner(coin) {


    ethminer = "\\miners\\eth\\claymore\\EthDcrMiner64.exe";
    zecminer = "\\miners\\equihash\\claymore\\ZecMiner64.exe";

    miner = ethminer;

    //fullpath = path.join(__dirname, miner);
 //   console.log(process.cwd());
    //console.log(path.dirname(process.argv[1]));
    //console.log(fullpath);

/*var pty = require('pty.js');

var term = pty.spawn('cmd.exe', [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env
});

term.on('data', function(data) {
  console.log(data);
});


term.write(process.cwd() + "\\miners\\eth\\claymore\\EthDcrMiner64.exe" + '\r');
term.resize(100, 40);
//term.write('cd c:/users/aznch/node/greenstroke/\r');

console.log(term.process);
*/
    const spawn = require('child_process').exec;
    //const bat = spawn(process.cwd() + miner, ['-epool', 'us1-etc.ethermine.org:4444', '-ewal', '0x92c41e996d39b43168bfd5a6979b6dbde40dd1fe.GSE#', '-epsw', 'x',[], {stdio: 'inherit'}]);

    const bat = spawn(process.cwd() + miner, [{stdio: 'inherit'}]);
    bat.stdout.setEncoding('utf8');

    //bat.stdout.resume();


    bat.stdout.on('data', (data) => {
        console.log(data);
        //console.log(bat.stdout);
    });

    bat.stderr.on('data', (data) => {
        console.log(data);
    });

    bat.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);
    });
    var concat = require('concat-stream');
    bat.stdout.pipe(concat(function(data) {
        // all your data ready to be used.
        console.log(data);
    }));
    // Do something after the sleep!
    current = "launching";
    // bat.unref();
    //bat.stdout.write();
}


function restartMiner() {

    var Netcat = require('node-netcat');
    var client = Netcat.client(3333, 'localhost');


    client.on('open', function() {
        //console.log('connect');
        client.send(restart, true);
    });

    client.on('data', function(data) {
        var claymore = data.toString('ascii');
        var claymorejson = JSON.parse(claymore);
        result = claymorejson.result;

    });

    client.on('error', function(err) {
        //console.log(err);

        if (current == "none") {
            console.log("Miner offline");
            console.log("---------------------------------");
            // current = "none";
        }
    });

    client.on('close', function() {

        switchcoin = false;
        current = "none";
        console.log('Restart');


    });
    client.start();
}

function sendConfig(config) {

    var Netcat = require('node-netcat');
    var client = Netcat.client(3333, 'localhost');


    client.on('open', function() {
        //console.log('connect');
        client.send(config, true);
    });

    client.on('data', function(data) {
        var claymore = data.toString('ascii');
        var claymorejson = JSON.parse(claymore);
        result = claymorejson.result;

    });

    client.on('error', function(err) {
        //console.log(err);

        if (current == "none") {
            console.log("Miner offline");
            console.log("---------------------------------");
            // current = "none";
        }
    });

    client.on('close', function() {

     //   restartMiner();
       // console.log('Restart');


    });
    client.start();
}



function editConfig(task) {

    var Netcat = require('node-netcat');
    var client = Netcat.client(3333, 'localhost');


    client.on('open', function() {
        //console.log('connect');
        client.send(task, true);
    });

    client.on('data', function(data) {
        var claymore = data.toString('ascii');
        var claymorejson = JSON.parse(claymore);
        result = claymorejson.result;
        if (claymorejson.result = true) {

            if (task == stats) {

                if (_.includes(etcpools, result[7].split(';')[0])) {
                    current = "ETC";
                    console.log("Currently mining ETC");
                    console.log("---------------------------------");

                }

                if (_.includes(ethpools, result[7].split(';')[0])) {
                    current = "ETH";
                    console.log("Currently mining ETH");
                    console.log("---------------------------------");

                }

                if (_.includes(zecpools, result[7].split(';')[0])) {
                    current = "ZEC";
                    console.log("Currently mining ZEC");
                    console.log("---------------------------------");
                }

            }
            //console.log("Success!");
           //  console.log(result);
        }


    });

    client.on('error', function(err) {
        //console.log(err);

        if (current == "none") {
            console.log("Miner offline");
            console.log("---------------------------------");
            // current = "none";
        }
    });

    client.on('close', function() {
        //console.log('close');

        if (current != "none") {



            if (current == "launching") {
                //   console.log(current);
                sleep(4000).then(() => {
                    console.log("Waiting");
                    console.log("---------------------------------");
                    // current = "checking";
                    // Do something after the sleep!
                    // console.log("rerun");
                    profitabilityCheck();
                });
            } else {

                if(counter != 3){

                   if(switchcoin == true){
                    console.log(switchcoin);
                  //switchcoin = false;
                  setTimeout(restartMiner, 10000);
                 // sendConfig(task);
                //  restartMiner();
                  }
                  profitabilityCheck();
                } else{
                  console.log("Tried 3 Times");
                  counter = 0;
                 // setTimeout(profitabilityCheck, 18000);
                }

            }

            if (task == stats) {
                // console.log("The task was API request.");
                // profitabilityCheck();
            } else {

            }

        }

        if (current == "none") {
            console.log("Let's launch miner");
            console.log("---------------------------------");
            current = "launch";
            profitabilityCheck();
        }





        if (task !== reboot || task !== restart || task !== stats) {
            // console.log("Rebooting");
        }
    });
    client.start();

}






app.listen(app.get('port'), function() {
    console.log("---------------------------------");
    console.log("Green Stroke Auto Switcher - Developed by Danny Chen");
    console.log("---------------------------------");
    // console.log('Node app is running on port', app.get('port'));
    profitabilityCheck();
    var schedule = require('node-schedule');

    schedule.scheduleJob('*/3 * * * *', function() {
        profitabilityCheck();
    });



});

app.on('listening', function() {
    // server ready to accept connections here
    console.log("start this function after start");
});
