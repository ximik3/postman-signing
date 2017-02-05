# postman-signing
Postman request signing tool

## Overview

### API
In our case some API (`api.exaple.com`) requires additional security headers to be passed along with every request:
`Security-Key` which is special *session key* and `Security-Sign` which is request checksum - special sign generated from request url and request params using *session secret* key. This security feature guaranties that your request is not modified on it's way to server. For authorization signin/signup requests we use predefined *key* and *secret* which only server and we know about. After successful authorization we receive *session key* and *session secret*, which whould be used for other requests.

### Signing algorythm
1. To sign our request we build string in the following way - *request_url*\[?*get_params*\]\[?*post_params*\]:

  ```
  https://api.example.com/request?get_param1=1&...&get_paramN=N?post_param1=1&...&post_paramM=M
  ```

1. Encode it:
  
  ```
  https%3A%2F%2Fapi.example.com%2Frequest%3Fget_param1%3D1%26...%26get_paramN%3DN%3Fpost_param1%3D1%26...%26post_paramM%3DM
  ```

1. Then we use HMAC SHA-1 algorythm to sign that string with *secret key*.

  ```
  3e853457dfc05c3792c5c736c190b2c683f9dfc6
  ```

### Postman
Postman https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop is a great tool for testing APIs, hovewer it became really hard to test described API manually. Every time you change any parameter or url path you need to regenerate sign. 
Hours later you will probably think about writing your own Postman...

... and here comes...
 
### Postman Scripts
Postman allows you to write javascript code which runs before request and after response. They are called **Pre-request Script** and **Tests** accordingly. There is also an ability to set global variables and use them between requests as `{{var_name}}` ([docs](https://www.getpostman.com/docs/environments)).

## Solution

For explanation see [Solution](#script-details)

### Setup

- Open Postman
- Copy code from `tests.js` into **Tests** tab
- Copy code from `pre-request_script.js` into **Pre-request scripts** tab
- Link known API hosts (*hosts* map in `pre-request_script.js` and `tests.js` files) to flavours (eg. *demo*, *production*)
- Setup default credencials (key, secret) for every API flavor (*key* and *secret* maps in `pre-request_script.js` file)
- Select requests where predefined keys are used (eg. *signin*, *login*)
- Set headers for *key* and *sign* variables in **Headers** tab (eg. `Security-Sign: {{sign}}`)
- Fill request data (*url*, *params*)
- Enjoy!

### Script Details

Let's assume we have one production host (```api.example.com```) and two test hosts (```api.staging.example.com```, ```api.demo.example.com```). 

*Pre-request script* will look for current API host and pick appropriate flavour.
Then pick last path of url to check if it is authorization request. For authorization requests it will use predefined key and secret for other requests it will try to use session keys. Key is exported into global variable `key`, sign into global variable `sign`
Postman will use that variables in `Security-Key` and `Security-Sign` headers. 

After successful response *tests* script will also pick host flavour and check request path but in case of authorization request it will try to extract *key* and *secret* values and store them to `{flavour}\_key` and `{flavour}\_secret` variables (eg. `demo_key`) to use in future requests.

## Advanced Topics

### Debugging
There two option how to enable debugging and see console logs on Chrome extension apps.

1. Type ```chrome://inspect/#apps``` in address line and click _inspect_ near the target app.

1. *(Less safe)* Type ```chrome://flags/#debug-packed-apps```, search for *"packed"* or try to find the *"Enable debugging for packed apps"* setting, enable it and restart Chrome. After that context menu item *"Inspect element"* will be available ([docs](https://www.getpostman.com/docs/errors)).

### Libraries
In previous versions of Postman some encryption algorythms in CryptoJS were not available. To add missing algorythm file (eg. *hmac-sha256.js*) or some custom javascript library you can use [gijswijs](https://github.com/gijswijs)'s answer from https://github.com/postmanlabs/postman-app-support/issues/734
