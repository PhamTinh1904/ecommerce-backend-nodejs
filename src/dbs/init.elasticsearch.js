"use strict";
const { Client } = require("@elastic/elasticsearch");

let clients = {}; // multiple connections

const instanceEvenListener = async (elasticsearch) => {
  try {
    await elasticsearch.ping();
    console.log(`Successfully connected to elasticsearch`);
  } catch (error) {
    console.error(`Elasticsearch cluster is down! ${error}`);
  }
};
const init = ({
  ELASTICSEARCH_IS_ENABLED,
  ELASTICSEARCH_HOSTS = "http://localhost:9200",
}) => {
  if (ELASTICSEARCH_IS_ENABLED) {
    const elasticClient = new Client({
      node: ELASTICSEARCH_HOSTS,
    });
    clients.elasticClient = elasticClient;
    instanceEvenListener(elasticClient);
  }
};

const getClients = () => clients;

const closeConnections = () => {};

module.exports = {
  init,
  getClients,
  closeConnections,
};
