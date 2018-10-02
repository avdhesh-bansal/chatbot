'use strict';

/*
  This file helps to perform operations that needs to be performed
  at server startup
*/

var debug = require('debug');
// debug.enable('*');
var error = debug('app:error');
var logger = debug('app:log');
// set this namespace to log via console.log
logger.log = console.log.bind(console);

var moment = require('moment'),
    request = require('request'),
    format = require('util').format,
    fs = require('fs');

module.exports = function(app) {

  // var Conversation = app.models.Conversation;

    // testDates();

    // uploadBulkDataToCloudant();

  /**
   * This method can be used to upload Master data to Cloudant on server startup
   * @param  {[type]} dataToUpload [description]
   * @param  {[type]} dbName       [description]
   * @return {[type]}              [description]
   */
  function uploadBulkDataToCloudant(dataToUpload, dbName){
    debug("IN uploadBulkDataToCloudant: >> ", dataToUpload.docs.length);

    let CLOUDANT_URL = process.env.SERVICES_CONFIG_CLOUDANT_credentials_url +dbName+"/_bulk_docs";

    try{
      var apiOptions = {
        url: CLOUDANT_URL,
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      };
      apiOptions.json = dataToUpload;
      request(apiOptions, function (err, resp, data) {
          if (err) {
              console.log("ERROR in Posting Bulk Data to Cloudant: >> ", err);
              return false;
          }
          if (resp.statusCode == 200) {
            console.log("Data uploaded successfully to Cloudant: >> ", dataToUpload.length);
          }
       });
    }catch(err){
      console.log("Error in Posting Data to Cloudant: >> ", err);
    }
  }

  function testDates(){
    // var now = moment(new Date()).add(1, 'days');
    var departureDate = moment(new Date()).add(1, 'days').format("YYYY-MM-DD");
    console.log("IN testDates, departureDate: >>> ", departureDate);

  }


};
