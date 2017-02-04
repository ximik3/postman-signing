# postman-signing
Postman script for automatic secure request signing. This script can be used to automaticly sign your secure request with postman.

## Overview

### Postman scripts
Postman gives us ability to write javascript pieces of code and run them before request call and after response was received. That features are called *Pre-request scripts* and *Tests*. 

### General approach
Some secure APIs (banking, paying systems) has an extra secure feature and require checksum (calculated from your request parameters) to be passed along with your request. This is done usually by adding security header with checksum to be sure nothing was changed (e.g. recipient, amount). When you try to test such API's in Postman manually it became hell.

