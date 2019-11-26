"use strict";
var host = 'http://localhost:8080/';
var config = {
  host,
  loginUrl: host + 'api/v1/mini/login',
  sessionUrl: host + 'api/v1/mini/session',
  decryptUrl: host + 'api/v1/mini/decrypt',
}

module.exports = config;