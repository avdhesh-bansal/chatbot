'use strict';

module.exports = function(Conversation) {

	Conversation.remoteMethod('doconversation', {
		    	accepts: [
		            { arg: 'req', type: 'object', http: function(ctx) {
		              return ctx.req;
		            }
		          }],
		         http: {path: '/converse', verb: 'post'},
		         returns: {arg: 'conversation', type: 'object'}
	});

	Conversation.remoteMethod('publishToSocket', {
		    	accepts: [
		            { arg: 'req', type: 'object', http: function(ctx) {
		              return ctx.req;
		            }
		          }],
		         http: {path: '/publish', verb: 'post'},
		         returns: {arg: 'response', type: 'object'}
	});

	Conversation.remoteMethod('getLogs', {
		    	accepts: [
		            { arg: 'req', type: 'object', http: function(ctx) {
		              return ctx.req;
		            }
		          }],
		         http: {path: '/logs', verb: 'post'},
		         returns: {arg: 'logs', type: 'object'}
	});

	Conversation.doconversation = function(req, next) {
			console.log("\n\n\nIn Conversation.doconversation : >>>> ", req.body);
			var conversationHandler = require('../../server/handlers/conversationHandler')(Conversation.app);
			var reqPayload = req.body;

			conversationHandler.callVirtualAssistant(reqPayload.params).then((responseJson) => {
		      // console.log("IBM WATSON RESPONSE: >>> ", responseJson);
					next(null, responseJson);
		    }).catch(function(error) {
			      next(error, null);
			  });
	};

	Conversation.publishToSocket = function(req, next){
		var conversationHandler = require('../../server/handlers/conversationHandler')(Conversation.app);
		var reqPayload = req.body;
		conversationHandler.publishData(reqPayload).then((responseJson) => {
				next(null, responseJson);
			}).catch(function(error) {
					next(error, null);
			});
	};

	Conversation.getLogs = function(req, next) {
			console.log("\n\n\nIn Conversation.getLogs : >>>> ", req.body);
			var conversationHandler = require('../../server/handlers/conversationHandler')(Conversation.app);
			var reqPayload = req.body;

			conversationHandler.getLogs(reqPayload).then((responseJson) => {
		      next(null, responseJson);
		    }).catch(function(error) {
			      next(error, null);
			  });
	};


};
