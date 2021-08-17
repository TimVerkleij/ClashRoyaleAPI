const request = require('request');

function clanData(callback) {
    request('https://api.clashroyale.com/v1/clans/%23VQ0G020', {
        'auth': {
          'bearer': process.env.API_KEY
        }
      }, function (error, response, body) {
        callback(body)
      });
}

function warData(callback) {
    request('https://api.clashroyale.com/v1/clans/%23VQ0G020/riverracelog', {
        'auth': {
          'bearer': process.env.API_KEY
        }
      }, function (error, response, body) {
        callback(body)
      });
}

function memberData(callback) {
  request('https://api.clashroyale.com/v1/clans/%23VQ0G020/members', {
      'auth': {
        'bearer': process.env.API_KEY
      }
    }, function (error, response, body) {
      callback(body)
    });
}

module.exports = {clanData, warData, memberData}