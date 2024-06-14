const { model } = require("mongoose");
const { getClients, init } = require("../../dbs/init.elasticsearch");

init({
  ELASTICSEARCH_IS_ENABLED: true,
});

const esClient = getClients().elasticClient;

const searchDocument = async (idxName, docType, payload) => {
  const result = await esClient.search({
    index: idxName,
    type: docType,
    body: payload,
  });

  console.log(`Search: `, result?.body?.hits?.hits);
};

const addDocument = async ({ idxName, id, docType, payload }) => {
  try {
    const newDoc = await esClient.index({
      index: idxName,
      id,
      type: docType,

      body: payload,
    });

    console.log(`add new: `, newDoc);
    return newDoc;
  } catch (error) {
    console.error(`Error: `, error);
  }
};

// addDocument({
//   idxName: "product_v002",
//   id: "111334",
//   docType: "product",
//   payload: {
//     title: "Iphone 14 1312",
//     price: 133333,
//     images: "..",
//     category: "mobile",
//   },
// }).then((res) => console.log(res));

searchDocument("product_v002", "product").then();

model.exports = {
  searchDocument,
};
