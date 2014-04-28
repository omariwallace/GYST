var googleapis = require('googleapis'),
    OAuth2Client = googleapis.OAuth2Client,
    client = '717427766570-fdmuac41856age7mmeu5legtudb42lip.apps.googleusercontent.com',
    secret = 'k395f6ICzs5FEl_y0jzsTeHA',
    redirect = "http://localhost:3000/oauth2callback",
    oauth2Client = new OAuth2Client(client, secret, redirect),
    calendar_auth_url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar'
    });

var callback = function(clients) {
  exports.cal = clients.calendar;
  exports.oauth = clients.oauth2;
  exports.client = oauth2Client; // this is my account
  exports.url = calendar_auth_url;
};

googleapis
  .discover('calendar', 'v3')
  .discover('oauth2', 'v2')
  .execute(function(err, client){
    if(!err)
      callback(client);
  });
