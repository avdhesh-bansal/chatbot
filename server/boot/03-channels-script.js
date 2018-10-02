'use strict';

/*
  This file helps to setup external Channels like Slack, Facebook etc.
  at server startup
*/

var log = require('debug')('boot:03-channels-script');

const Botkit = require('botkit');
var ENABLE_SLACK = false;
var ENABLE_MS_BOT = false;

  if(process.env.ENABLE_SLACK){
    ENABLE_SLACK = (process.env.ENABLE_SLACK.toLowerCase() === 'true');
  }

  if(process.env.ENABLE_MS_BOT){
    ENABLE_MS_BOT = (process.env.ENABLE_MS_BOT.toLowerCase() === 'true');
  }

module.exports = function(app) {

  const channelHandler = require('../handlers/channelHandler')(app);

  if(ENABLE_SLACK && process.env.SLACK_BOT_USER_TOKEN){
      channelHandler.initSlackChannel();
  }

  if(ENABLE_MS_BOT && process.env.MS_BOT_APP_ID && process.env.MS_BOT_APP_PASSWORD){
      channelHandler.initMSBotChannel();
  }

  channelHandler.subscribeToResponse();


};
