module.exports = {
  "db": {
    "name": "db",
    "connector": "memory"
  },
  "transient": {
    "name": "transient",
    "connector": "transient"
  },
  "accounts": {
    "url": JSON.parse(process.env.VCAP_SERVICES).cloudantNoSQLDB[0].credentials.url,
    "database": "accounts",
    "name": "accounts",
    "connector": "cloudant"
  },
  "identities": {
    "url": JSON.parse(process.env.VCAP_SERVICES).cloudantNoSQLDB[0].credentials.url,
    "database": "identities",
    "name": "identities",
    "connector": "cloudant"
  },
  "roles": {
    "url": JSON.parse(process.env.VCAP_SERVICES).cloudantNoSQLDB[0].credentials.url,
    "database": "roles",
    "name": "roles",
    "connector": "cloudant"
  },
  "rolemappings": {
    "url": JSON.parse(process.env.VCAP_SERVICES).cloudantNoSQLDB[0].credentials.url,
    "database": "rolemappings",
    "name": "rolemappings",
    "connector": "cloudant"
  },
  "conversations": {
    "url": JSON.parse(process.env.VCAP_SERVICES).cloudantNoSQLDB[0].credentials.url,
    "database": "conversations",
    "name": "conversations",
    "connector": "cloudant"
  },
  "mappings": {
    "url": JSON.parse(process.env.VCAP_SERVICES).cloudantNoSQLDB[0].credentials.url,
    "database": "mappings",
    "name": "mappings",	
    "connector": "cloudant"
  },
  "containers": {
    "username": JSON.parse(process.env.VCAP_SERVICES)["cloud-object-storage"][0].credentials.username,
    "password": JSON.parse(process.env.VCAP_SERVICES)["cloud-object-storage"][0].credentials.password,
    "name": "containers",
    "connector": "loopback-component-storage",
    "provider": "openstack",
    "authUrl": "https://identity.open.softlayer.com",
    "useServiceCatalog": true,
    "useInternal": false,
    "keystoneAuthVersion": "v3",
    "tenantId": JSON.parse(process.env.VCAP_SERVICES)["cloud-object-storage"][0].credentials.projectId,
    "domainId": JSON.parse(process.env.VCAP_SERVICES)["cloud-object-storage"][0].credentials.domainId,
    "region": "dallas"
  }
};
