const request = require("request").defaults({jar: true});;

var username="admin"
var password="changeme"
var baseurl="https://unifi:8443"
var site = 'default';

findlf_addr="https://lf.internalpositioning.com/reversefingerprint";
group_name="";

var interval = 5;

var iVar;

var baseOptions = {
    rejectUnauthorized: false
}
var loginOptions = {
    uri: `${baseurl}/api/login`,
    method: "POST",
    json: {
        'username': username,
        'password': password
    }
}
var statOptions = {
    uri: `${baseurl}/api/s/${site}/stat/sta`
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
                        group: group_name
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
                    url: findlf_addr,
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
    iVar = setInterval(getStats, interval*1000);
});
