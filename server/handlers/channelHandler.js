'use strict'

var request = require('request'),
    Botkit = require('botkit');

    var botSubscribed = false;

module.exports = function(app) {

  var methods = {};

  const conversationHandler = require('./conversationHandler')(app);
  const commonHandler = require('./commonHandler')();
  var bots = {"SLACK": {}, "MS_BOT": {}};

  methods.subscribeToResponse = function(){
    if(!botSubscribed){
      console.info("\n\nExternal Call Event Received in channelHandler, botSubscribed >> ", botSubscribed);
      botSubscribed = true;
      commonHandler.getEventEmitter().on('external_call', function(error, response) {
        if(!response || !response.context.channel){
          return false;
        }
        console.info("External Call Event Received in channelHandler for Channel: >> ", response.context.channel);
            if(response.context.channel == "WEB"){
              console.info("\n\nExternal Call Event Received in conversationHandler: >> ");
              conversationHandler.formatWatsonResponse(response)
              .then(conversationHandler.publishResponse)
              .catch(function(error) {
                console.log(error);
              });
            }else{
              var channelMsg;
              if(response && response.context){
                channelMsg = response.context.channelMsg
              }
              if(!channelMsg){
                channelMsg = response;
              }
              conversationHandler.formatWatsonResponse(response)
              .then((watsonResp) =>{
                var bot = bots[watsonResp.context.channel];
                if(watsonResp && watsonResp.output && watsonResp.output.text){
                  bot.reply(channelMsg, watsonResp.output.text.join('\n'));
                  console.log(watsonResp.context.channel, " BOT Replied: >>> ", watsonResp.output.text);
                }else{
                  bot.reply(channelMsg, "Sorry, I did not understand.");
                }
                // cb(null, watsonResp);
              }).catch(function(error) {
                console.log(error);
                var bot = bots[response.context.channel];
                bot.reply(channelMsg, "Sorry, there are technical problems.");
                // cb(error, null);
              });
            }
      });
    }
  };

  methods.initSlackChannel = function(){
        const slackController = Botkit.slackbot({
          json_file_store: './data/botkit'
        });
        var slackBot = slackController.spawn({
          token: process.env.SLACK_BOT_USER_TOKEN
        });

        slackController.hears(['.*'], ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
              slackController.log('\n\nSlack message received::>>>>> ', message);
              if(message && message.type == 'direct_message'){
                slackController.storage.users.get(message.user, function(err, userData) {
                     if(userData && userData.context){
                       message.context = userData.context;
                     }
                     if(message.text == "reset"){
                       message.context = {"initConversation": true, "locale": "en", "channel": "SLACK"};
                     }
                      bots.SLACK = bot;
                      postMessage("SLACK", message, function(err, watsonResp){
                          slackController.storage.users.save({id: message.user, context: watsonResp.context}, function(err) {
                            if(err){
                                console.error(err);
                            }
                          });
                      });
                });
              }
        });

        slackBot.startRTM(function(err, bot, payload) {
          if (err) {
            console.error(err);
          }
        });
  };

  methods.initMSBotChannel = function(){
        const msbotController = Botkit.botframeworkbot({
          json_file_store: './data/botkit',
          debug: true,
          webserver: app,
          port: process.env.PORT
        });

        var msBot = msbotController.spawn({
            appId: process.env.MS_BOT_APP_ID,
            appPassword: process.env.MS_BOT_APP_PASSWORD
        });

          msbotController.webserver = app;
          msbotController.createWebhookEndpoints(msbotController.webserver, msBot, function() {
              console.log('MS bot is online!!!');
          });

          msbotController.hears(['.*'], ['message_received', 'conversationUpdate'], function(bot, message) {
                // msbotController.log('MS Bot message received::>>>>> ', message);
                console.info('\n\nMS Bot message received::>>>>> ', message);
                if(message && message.type == 'message_received'){
                  msbotController.storage.users.get(message.user, function(err, userData) {
                       if(userData && userData.context){
                         message.context = userData.context;
                       }
                       if(message.text == "reset"){
                         message.context = {"initConversation": true, "locale": "en", "channel": "MS_BOT"};
                       }
                        bots.MS_BOT = bot;
                        postMessage("MS_BOT", message, function(err, watsonResp){
                            msbotController.storage.users.save({id: message.user, context: watsonResp.context}, function(err) {
                              if(err){
                                  console.error(err);
                              }
                            });
                        });
                  });
                }
          });

  };

  function postMessage(channel, message, cb){
    console.info("In channelHandler.postMessage: >>> channel: ", channel, ", text: ", message.text);
    var params = {
                      "input":{"text": message.text}
                 };

        if(message.context){
          params.context = message.context;
          params.context.channel = channel;
        }else{
          message.context = {};
          params.context = {"initConversation": true, "channel": channel};
        }

        conversationHandler.callVirtualAssistant(params).then((watsonResp) => {
            // console.log("WATSON RESPONSE: >>> ", watsonResp, "\n\n");
            cb(null, watsonResp);
            var bot = bots[watsonResp.context.channel];
            watsonResp.context.channelMsg = message;
            if(watsonResp && watsonResp.output && watsonResp.output.text){
              bot.reply(message, watsonResp.output.text.join('\n'));      // reply with Watson response
            }else{
              bot.reply(message, "Sorry, I did not understand.");
            }
        }).catch(function(error) {
          console.log(error);
          var bot = bots[params.context.channel];
          bot.reply(message, "Sorry, there are technical problems.");
          cb(error, null);
        });
  }

  return methods;

}
