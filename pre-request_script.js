/**
  * This is Postman pre-request script for automatic request signing
  */

// setup known hosts values
var prefix = {
    "api.example.com" : "prod",
    "api.demo.example.com" : "demo",
    "api.staging.example.com" : "staging"
};
var key = {
    "prod" : "U8rqhvB3i01h0X74TmJq1EgJKiHFec2EU8rqhvB3i01h0X74TmJq1EgJKiHFec2E",
    "demo" : "6H86502GQC2eLdSky276oT9jPL8DxuPx6H86502GQC2eLdSky276oT9jPL8DxuPx",
    "staging" : "XgW7GEkQau71G21j2NjlOT2Zl1tq099yXgW7GEkQau71G21j2NjlOT2Zl1tq099y"
};
var secret = {
    "prod" : "947uyd18sVT4y7D5s8XS976Yz769YDkD947uyd18sVT4y7D5s8XS976Yz769YDkD",
    "demo" : "j6nbb2EyxXP1Jq80sIsO25vL0GDdM4nhj6nbb2EyxXP1Jq80sIsO25vL0GDdM4nh",
    "staging" : "sLZ3sKA32Ov9lm43jLRLH0qh82M91xClsLZ3sKA32Ov9lm43jLRLH0qh82M91xCl"
};

// clear previous key and sign values to avoid conflicts
postman.clearGlobalVariable("key");
postman.clearGlobalVariable("sign");

// get request host (i.e: [https://]github.com[/])
var u = document.createElement("a");
u.href = request.url;
var host = u.hostname;

// get last path (i.e: [github.com/]ximik3[/]) and init values
var lastpath = u.pathname.split('/').last();
var apiKey;
var apiSecret;
var currPrefix = prefix[host];

// check last request path
// if one of "sign" requests ['signin', 'login', 'signup'] use static credential 
// otherwise dynamic credentials from last "sign" response
var signPaths = ["signin", "login", "signup"];
if (signPaths.indexOf(lastpath) > -1) {
    // predefined static credentials
    apiKey = key[currPrefix];
    apiSecret = secret[currPrefix];
} else {
    // dynamic credentials
    apiKey = globals[prefix[host] + "_key"];
    apiSecret = globals[prefix[host] + "_secret"];
}

// ENCRYPTING Region
// build string to encrypt(se): url + params
var se = request.url + '?';

// encode all key/value pairs and join to url if exist
if (Object.keys(request.data).length > 0) {
    for (var key in request.data) {
        se += key + '=' +
              request.data[key] + '&';
    }
    se = se.slice(0, -1); // remove last & symbol
}

// generate sign
var sign = CryptoJS.HmacSHA256(se, apiSecret).toString();

// export key and sign to use in headers
postman.setGlobalVariable("key", apiKey);
postman.setGlobalVariable("sign", sign);
