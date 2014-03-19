var gapi = require('../lib/gapi');
var Q = require ('q');
var async = require('async')
var models = require('../models/account'),
    GoogleUser = models.GoogleUser,
    Account = models.Account,
    Shipment = models.Shipment;

// exports.getUserToken_async = function(code) {
//   gapi.client.getToken(code, function(err, tokens) {
//     gapi.client.credentials = tokens;
//   });
// };

// exports.findUserToken_async = function(user_id) {
//   GoogleUser.findOne({'_id': user_id}, function (err, user) {
//     gapi.client.credentials = user.tokens;
//   });
// };

// exports.getUserData_async = function(tokens) {
//   gapi.oauth.userinfo.get().withAuthClient(gapi.client).execute(function(err, results) {
//       results.tokens = tokens;
//   })
// };

// exports.saveToDB = function(user) {
//     var deferred = Q.defer();
//     GoogleUser.findOrCreate({'email': user.email}, {'first_name': user.given_name, 'last_name': user.family_name, 'googID': user.id, 'tokens': user.tokens}, function (err, user, created) {
//         if (created) {
//           console.log("A new user '%s' was added", user.email);
//         }
//         else {
//           console.log("User '%s' already exists", user.email);
//         }
//         deferred.resolve(user);
//       }
//     );
//     return deferred.promise;
// };

// exports.retrieveShipments = function (user) {
//   var deferred = Q.defer();
//   Account.findById(user_id, 'username', function (err, user) {
//     Shipment.find({ 'user': user.username}, function (err, orders_arr) {
//       console.log("rShips: ", orders_arr);
//       if(err) {
//         deferred.reject(err);
//       } else {
//         deferred.resolve(orders_arr);
//       }
//     });
//   });
//   return deferred.promise;
// };


// exports.getCalData = function() {
//   gapi.cal.calendarList.list().withAuthClient(gapi.client).execute(function(err, results){
//     for (var i = results.items.length - 1; i >= 0; i--) {
//       my_calendars.push(results.items[i].summary);
//     }
//     console.log("getCalData: ", my_calendars);
//   });
// };

// exports.addGYSTCal = function() {
//   var deferred = Q.defer();
//   gapi.cal.calendars.insert({'summary': 'TestGYSTCal3'}).withAuthClient(gapi.client).execute(function (err, results) {
//       if (err) {
//         deferred.reject(new Error(err));
//       } else {
//         console.log("Cal added: ", results);
//         deferred.resolve(results.id);
//       }
//     });
//   return deferred.promise;
// }

// exports.addGYSTOrders = function(id) {
//   console.log(id);
//   // var deferred = Q.defer();
//   // gapi.cal.calendars.insert({'summary': 'TestGYSTCal3'}).withAuthClient(gapi.client).execute(function (err, results) {
//   //     if (err) {
//   //       deferred.reject(new Error(err));
//   //     } else {
//   //       console.log("Cal added: ", results);
//   //       deferred.resolve(results.id);
//   //     }
//   //   });
//   // return deferred.promise;
// }




// *******************************************
// *******************************************
// *******************************************
// *******************************************

exports.getUserToken = function(code) {
  var deferred = Q.defer();
  gapi.client.getToken(code, function(err, tokens){
    if(err) {
      deferred.reject(err);
    } else {
      gapi.client.credentials = tokens;
      deferred.resolve(tokens);
    }
  });
  return deferred.promise;
};

exports.findUserToken = function(user_id) {
  GoogleUser.findOne({'_id': user_id}, function (err, user) {
    gapi.client.credentials = user.tokens;
  });
};

exports.getUserData = function(tokens) {
  var deferred = Q.defer();
  gapi.oauth.userinfo.get().withAuthClient(gapi.client).execute(function(err, results){
    if (err) {
      deferred.reject(new Error(err));
    } else {
      results.tokens = tokens;
      deferred.resolve(results);
    }
  });
  return deferred.promise;
};

exports.saveToDB = function(user) {
    var deferred = Q.defer();
    GoogleUser.findOrCreate({'email': user.email}, {'first_name': user.given_name, 'last_name': user.family_name, 'googID': user.id, 'tokens': user.tokens}, function (err, user, created) {
        if (created) {
          console.log("A new user '%s' was added", user.email);
        }
        else {
          console.log("User '%s' already exists", user.email);
        }
        deferred.resolve(user);
      }
    );
    return deferred.promise;
};

exports.retrieveShipments = function (user) {
  var deferred = Q.defer();
  console.log('retShpments running -- user email: ', user.email);
  Shipment.find({ 'user': user.email }, function (err, orders_arr) {
    if(err) {
      deferred.reject(err);
    } else {
      deferred.resolve(orders_arr);
    }
  });
  return deferred.promise;
};


exports.getCalData = function() {
  var my_calendars = [];
  gapi.cal.calendarList.list().withAuthClient(gapi.client).execute(function(err, results){
    for (var i = results.items.length - 1; i >= 0; i--) {
      my_calendars.push(results.items[i].summary);
    }
    console.log("getCalData: ", my_calendars);
  });
};

exports.addGYSTCal = function(shipments) {
  // do a check if googleuser has a calendar_id, if so then just run the event adder;
  var deferred = Q.defer();
  var cal_name = "GYST Calendar: "+shipments[0].user;
  var shipments = shipments;
  async.waterfall([
    // waterfall 1
    function(callback) {
      gapi.cal.calendars.insert({'summary': cal_name}).withAuthClient(gapi.client).execute(function (err, results) {
          // Get specfic calendar to show;
          var cal_id = results.id;
          callback(null, cal_id, shipments);
      });
    },
    // waterfall 2
    function(cal_id, shipments, callback) {
      // async loop
      async.each(shipments, function (shipment, innercallback) {
        var date_match = shipment.delivery_date.match(/(.*?\s\d{4})/);
        var dateGen = function (date_str) {
            var date_val = new Date(date_str[0]);
            var day = date_val.getDate();
            var month = date_val.getMonth()+1;
            if (month < 9) month = "0"+month;
            var year = date_val.getFullYear();
            return year+"-"+month+"-"+day;
        };
        var date = dateGen(date_match);
        var tracking_number = shipment.tracking_number;
        var orderID = shipment.orderID;
        var products = shipment.product_list;
        var description = ['tracking number: '+tracking_number, 'orderID: '+ orderID, 'products: '+products.join('; ')].join('\n');
        var requestBody = {
          'end': {
              'date': date
          },
          'start': {
              'date': date
          },
          "description":  description,
          "transparency": "transparent",
          "summary": "GYST: Your Delivery!! ("+tracking_number+")",
          "reminders": {
          "overrides":
            [
              { "method": "email", "minutes": 2880},
              { "method": "email", "minutes": 1440},
              { "method": "popup","minutes": 0}
            ],
            "useDefault": false // must be set to false to add custom reminders to event
          }
        };
        console.log("cal_id from async.each: ", cal_id);
        gapi.cal.events.insert({'calendarId': cal_id, 'sendNotifications': true}, requestBody)
        .withAuthClient(gapi.client)
        .execute(function (err, cal_event) {
          if (err) {
            console.log("err with cal: ",err);
            innercallback(err);
          } else {
            console.log("this is the cal", cal_event);
            innercallback();
          }
          // Upon completing one of the each shipment applications
        });
      }, function (err) {
        // if any of the calendar adds produced an error, err would equal that error
          if( err ) {
            // One of the iterations produced an error.
            // All processing will now stop.
            console.log('A file failed to process');
          } else {
            console.log('All files have been processed successfully');
          }
          // Upon completeing the async.each loop for all shipments
          callback(null, cal_id);
      });
    }
  ], function (err, result) {
      // console.log("Cal ID Please: ", result);
      deferred.resolve(result);
  });
  return deferred.promise;
};

exports.addGYSTevent = function() {
  var requestBody = {
  "end":
  {
    "date": "2014-03-19"
  },
  "start":
  {
    "date": "2014-03-19"
  },
  "summary": "TESTING 4-5-6"
};
  gapi.cal.events.insert({'calendarId': 'omari.wallace@gmail.com'}, requestBody)
  .withAuthClient(gapi.client)
  .execute(function (err, cal_event) {
    if (err) {
      console.log("err with cal: ",err);
    } else {
      console.log("this is the cal", cal_event);
    }
  });
};

exports.addGYSTOrders = function(id) {
  console.log(id);
  // var deferred = Q.defer();
  // gapi.cal.calendars.insert({'summary': 'TestGYSTCal3'}).withAuthClient(gapi.client).execute(function (err, results) {
  //     if (err) {
  //       deferred.reject(new Error(err));
  //     } else {
  //       console.log("Cal added: ", results);
  //       deferred.resolve(results.id);
  //     }
  //   });
  // return deferred.promise;
}

/**
          'calendarID': 'omari.wallace@gmail.com',
          'sendNotifications': true,
          'Request body': {
            'end': {
              'date': '2014-03-18'
            },
            'start': {
              'date': '2014-03-18'
            },
            "description":  'test description',
            "transparency": "transparent",
            "summary": "GYST: Your Delivery!! (123124)",
            "reminders": {
              "overrides":
              [
                { "method": "email", "minutes": "2880"},
                { "method": "email", "minutes": "1440"},
                { "method": "popup","minutes": "0"}
              ],
              "useDefault": false // must be set to false to add custom reminders to event
**/

// { access_token: 'ya29.1.AADtN_UNRsQXViaF_mpcE9Ezm3M50zvOZwjBMfhUxvVJc2ZtGNLtE-K9Su0z7OY',
//   token_type: 'Bearer',
//   expires_in: 3600,
//   id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjM2MjM5MTAzYzA4Y2UyMDcwODJiNzIxZGZiYzgwYmM4ZDgwMGJmZjIifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXVkIjoiNzE3NDI3NzY2NTcwLWZkbXVhYzQxODU2YWdlN21tZXU1bGVndHVkYjQybGlwLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwidG9rZW5faGFzaCI6IjNTZVlLY2ZlcFVPU3NEU3FZQWF6SEEiLCJhdF9oYXNoIjoiM1NlWUtjZmVwVU9Tc0RTcVlBYXpIQSIsImVtYWlsIjoid2UuZ3lzdEBnbWFpbC5jb20iLCJpZCI6IjExMDY4ODU5ODQyMTAyMTI0OTEwMyIsInN1YiI6IjExMDY4ODU5ODQyMTAyMTI0OTEwMyIsImNpZCI6IjcxNzQyNzc2NjU3MC1mZG11YWM0MTg1NmFnZTdtbWV1NWxlZ3R1ZGI0MmxpcC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF6cCI6IjcxNzQyNzc2NjU3MC1mZG11YWM0MTg1NmFnZTdtbWV1NWxlZ3R1ZGI0MmxpcC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInZlcmlmaWVkX2VtYWlsIjoidHJ1ZSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImlhdCI6MTM5NTAzNjQzOCwiZXhwIjoxMzk1MDQwMzM4fQ.hSCMPlgNKlyY8bgAR7W5tQQE7F5Q02jOrdgiLov6-YoGO9fOzRgkD0QkkOEaCE9wEXnfD9e5jfwYK_cyg7MUBqj9UIUpi4r8EhVFmUjnFkaI0Om-VK8PB5Q5737g0LFKAKBpmG_H1qwwJllI2fZ_6ncf-5YFaDAQAUynsz4IJ08',
//   refresh_token: '1/VoAFPuz1KFIdE8SqMc5JujpnrVFw_QiegeAKIf2vrSs' }