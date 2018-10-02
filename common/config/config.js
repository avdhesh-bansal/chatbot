/**
 * NOTE: THIS FILE IS CURRENTLY NOT IN USE
 */
'use strict';

module.exports.get = function() {
		return {
			  "SERVICES_CONFIG":{
		    	"CLOUDANT":{
							"credentials": {
									"username": process.env.SERVICES_CONFIG_CLOUDANT_credentials_username,
								  "password": process.env.SERVICES_CONFIG_CLOUDANT_credentials_password,
								  "host": process.env.SERVICES_CONFIG_CLOUDANT_credentials_host,
								  "port": 443,
								  "url": process.env.SERVICES_CONFIG_CLOUDANT_credentials_url
							}
					},
					"CONVERSATION":{
						"credentials":{
								"url": process.env.SERVICES_CONFIG_CONVERSATION_credentials_url,
								"password": process.env.SERVICES_CONFIG_CONVERSATION_credentials_password,
								"username": process.env.SERVICES_CONFIG_CONVERSATION_credentials_username,
								"version_date": process.env.SERVICES_CONFIG_CONVERSATION_credentials_version_date,
								"version": process.env.SERVICES_CONFIG_CONVERSATION_credentials_version,
								"silent": process.env.SERVICES_CONFIG_CONVERSATION_credentials_silent
						},
					"workspace_id": process.env.SERVICES_CONFIG_CONVERSATION_worspace_id
				}
			}
		}

};
