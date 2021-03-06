'use strict'

const assert = require('assert');
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
const discovery = new DiscoveryV1({ version: '2017-09-01'});

module.exports = function() {

var methods = {};

	methods.callDiscovery = function(params) {
		console.info("IN discoveryHandler.callDiscovery: >>> ", params);
    return new Promise(function(resolve, reject){
      assert(params, 'params cannot be null');
      assert(params.input, 'params.input cannot be null');

      const environmentId = process.env.WATSON_DISCOVERY_ENVIRONMENT_ID || '<environment-id>';
      const collectionId = process.env.WATSON_DISCOVERY_COLLECTION_ID || '<collection-id>';
      if (!environmentId || environmentId === '<environment-id>') {
        return reject(new Error('The app has not been configured with a <b>ENVIRONMENT_ID</b> environment variable for Discovery service.'));
      }

      if (!collectionId || collectionId === '<collection-id>') {
        return reject(new Error('The app has not been configured with a <b>COLLECTION_ID</b> environment variable for Discovery service.'));
      }

      var payload = {
        environment_id: environmentId,
        collection_id: collectionId,
        query: params.input.text
      };

      discovery.query(payload, function(err, data) {
        if (err) {
          return reject(err);
        }
        var i = 0;
        var discoveryResults = [];
        while (data.results[i] && i < 3 ) {
          let body = data.results[i].contentHtml;
          discoveryResults[i] = {
            body: body,
            bodySnippet: (body.length < 144 ? body : (body.substring(0,144) + '...')).replace(/<\/?[a-zA-Z]+>/g, ''),
            confidence: data.results[i].score,
            id: data.results[i].id,
            sourceUrl: data.results[i].sourceUrl,
            title: data.results[i].title
          };
          i++;
        }

        // params.output.discoveryResults = discoveryResults;
        // var conversationWithData = params;
        // delete conversationWithData.username;
        // delete conversationWithData.password;
        // return resolve(conversationWithData);

				return resolve(discoveryResults);


      });

    });

	};

    return methods;

}
