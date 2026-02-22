const dns = require('dns');

console.log("Testing DNS resolution for _mongodb._tcp.sbfoods.mv1zcux.mongodb.net");

dns.resolveSrv('_mongodb._tcp.sbfoods.mv1zcux.mongodb.net', (err, addresses) => {
    if (err) {
        console.error("DNS Resolution Error:", err);
    } else {
        console.log("SRV Records found:", addresses);
    }
});
