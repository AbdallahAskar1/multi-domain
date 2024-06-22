// script for edit configuration of the nginx server when adding a new domain

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var async = require('async');

var domain = process.argv[2];
var configFile = path.join(__dirname, 'config', domain + '.json');

if (!domain) {
  console.log('Usage: node script.js <domain>');
  process.exit(1);
}

fs.readFile(configFile, 'utf8', function(err, data) {
  if (err) {
    console.log('Error reading ' + configFile);
    process.exit(1);
  }

  var config = JSON.parse(data);
  var nginxConfig = config.nginx;
  var serverName = config.serverName;

  async.series([
    function(callback) {
      exec('sudo rm -rf ' + nginxConfig.path, callback);
    },
    function(callback) {
      exec('sudo mkdir -p ' + nginxConfig.path, callback);
    },
    function(callback) {
      exec('sudo chown -R www-data:www-data ' + nginxConfig.path, callback);
    },
    function(callback) {
      fs.writeFile(nginxConfig.path + '/index.html', nginxConfig.index, callback);
    },
    function(callback) {
      //
      // add the domain to the list of domains
      //
      if (serverName) {
        var domains = config.domains;
        domains.push(serverName);
        config.domains = domains;
        fs.writeFile(configFile, JSON.stringify(config, null, 2), callback);
      } else {
        callback();
      }
    }
  ], function(err) {
    if (err) {
      console.log('Error: ' + err);
      process.exit(1);
    }

    console.log('Done');
  });
});
