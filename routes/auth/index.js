var request = require('request');
var querystring = require('querystring');

var keydata = require('./key').keydata;
var appkey = keydata.appkey;
var appsecret = keydata.appsecret;

var urls = require('../urls').urls;
var authUrl = urls.authUrl;
var tokenUrl = urls.tokenUrl;
var localBaseUrl = urls.localBaseUrl;
var localUrl = localBaseUrl + '/auth';

var getToken = function(code, req, res) {
  var params = {
    'client_id': appkey,
    'client_secret': appsecret,
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': localUrl
  };
  request.post({
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    uri: tokenUrl,
    body: querystring.stringify(params)
  }, function(error, response, body) {
    if (error) {
      res.render('simple', {
        'cont': error
      });
    }
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      req.session.token = body.access_token;
      console.log('token:' + req.session.token);
      res.redirect(localBaseUrl);
    }
  });
};

exports.index = function(req, res) {
  var code = req.query.code;
  if (req.query.error) {
    res.render('simple', {
      'cont': req.query.error_description
    });
  }

  if (!code) {
    var str = authUrl + '?response_type=code&client_id=' + keydata.appkey + '&redirect_uri=' + localUrl;
    res.redirect(str);
  } else {
    console.log('code:' + code);
    getToken(code, req, res);
  }
};