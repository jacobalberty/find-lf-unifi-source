const request = require("request").defaults({jar: true})
    , fs = require("fs")
    , ini = require("ini");


var config = ini.parse(fs.readFileSync("config.ini", "utf-8"));

var iVar;

var baseOptions = {
    rejectUnauthorized: false
}
var loginOptions = {
    uri: `${config.unifi.url}/api/login`,
    method: "POST",
    json: {
        'username': config.unifi.username,
        'password': config.unifi.password
    }
}
var statOptions = {
    uri: `${config.unifi.url}/api/s/${config.unifi.site}/stat/sta`
}

function getStats() {
    request(Object.assign({}, baseOptions, statOptions), function(error, response, body) {
        var data = JSON.parse(body).data;
        var payloads = { };
        var timestamp = Date.now();
        data.forEach(function(client) {
            if (!client.is_wired) {
                if (payloads[client.ap_mac] == undefined) {
                    payloads[client.ap_mac] = {
                        node: client.ap_mac,
                        signals: [ ],
                        timestamp: timestamp,
                        group: config.findlf.group
                    }
                }
                payloads[client.ap_mac].signals.push(
                    {
                        mac: client.mac,
                        rssi: client.rssi
                    }
                );
            }
        });
        Object.keys(payloads).forEach(function(node) {
            request(
                {
                    method: 'POST',
                    url: config.findlf.url,
                    json: payloads[node]
                 }, function(error, response, body) {
                    if (error) {
                        console.log(`error: ${error}`);
                        clearInterval(iVar);
                    }
                    console.log(`sent data: ${node}`);

                });
        });
    });
}

request(Object.assign({}, baseOptions, loginOptions), function(error, response, body) {
    getStats();
    iVar = setInterval(getStats, config.other.interval*1000);
});
