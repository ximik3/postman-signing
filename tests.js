/**
  * Postman post-request (test) script for saving session sign credentials
  */

// setup known hosts prefixes
var prefix = {
  "api.example.com" : "prod",
  "api.demo.example.com" : "demo",
  "api.staging.example.com" : "staging"
};

// get request host
var l = document.createElement("a");
l.href = request.url;
var host = l.hostname;

// get last path
var lastpath = l.pathname.split('/').last();
var apiKey;
var apiSecret;

// check last request path
// if one of "sign" requests ('signin', 'login', 'signup') we should
// save received credencials
var signPaths = ["signin", "login", "signup"];
if (signPaths.indexOf(lastpath) > -1) {
    // clear previous variables
    postman.clearGlobalVariable(prefix[host] + "_key");
    postman.clearGlobalVariable(prefix[host] + "_secret");

    // get response user attributes
    var attrs = JSON.parse(responseBody).data.attributes;

    // export received credentials
    postman.setGlobalVariable(prefix[host] + "_key", attrs.api_key);
    postman.setGlobalVariable(prefix[host] + "_secret", attrs.api_secret);
}
