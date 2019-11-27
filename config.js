"use strict";
var host = 'http://192.168.1.10:8080/';
var config = {
  host,
  loginUrl: host + 'api/v1/mini/login',
  sessionUrl: host + 'api/v1/mini/session',
  decryptUrl: host + 'api/v1/mini/decrypt',
  tipUrl: host + 'api/v1/mini/tip',
}

module.exports = config;