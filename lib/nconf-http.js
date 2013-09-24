/**
 *  joola.io
 *
 *  Copyright Joola Smart Solutions, Ltd. <info@joo.la>
 *
 *  Licensed under GNU General Public License 3.0 or later.
 *  Some rights reserved. See LICENSE, AUTHORS.
 *
 *  @license GPL-3.0+ <http://spdx.org/licenses/GPL-3.0+>
 */


var async = require('async'),
  http = require('http'),
  https = require('https'),
  url = require('url'),
  util = require('util'),
  nconf = require('nconf');

//
// ### function Http (options)
// #### @options {Object} Options for this instance
// Constructor function for the Http nconf store
//
var Http = exports.Http = function (options) {
  var self = this;

  options = options || {};
  this.type = 'http';
  this.namespace = options.namespace || 'nconf';
  this.url = options.url;
  this.callback = options.callback;

  this.loadSync = function () {
    var data = '';
    var parsed = url.parse(this.url);

    var options = {
      host: parsed.hostname,
      port: parsed.port,
      path: parsed.path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    var client;
    if (parsed.protocol.indexOf('https') > -1)
      client = https;
    else
      client = http;

    try {
      client.request(options,function (res) {
        if (res.statusCode != 200) {
          return self.callback(new Error("Error fetching url from: [" + self.web + '"], statusCode: ["' + res.statusCode + '"].'));
        }
        res.on('data', function (chunk) {
          data += chunk;
        });
        res.on('end', function (err) {
          if (err)
            return self.callback(new Error("Error fetching url from: [" + self.web + '"], error: ["' + err + '"].'));

          try {
            self.store = JSON.parse(data).conf;
          }
          catch (ex) {
            return self.callback(new Error("Error parsing your JSON configuration file: [" + self.web + '].'));
          }

          return self.callback(null, self.store);
        })
      }).on('error',function (err) {
          return self.callback(new Error("Error fetching url from: [" + self.web + '"], error: ["' + err + '"].'));
        }).end();
    }
    catch (ex) {
      console.log('e', ex);
    }
  }
};


//
// Define a getter so that `nconf.Http`
// is available and thus backwards compatible.
//
nconf.Http = Http;

util.inherits(Http, nconf.Memory);