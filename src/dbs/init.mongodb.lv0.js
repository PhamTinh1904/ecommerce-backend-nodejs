const mongoose = require( "mongoose");

const connectString = `mongodb://localhost:27017/shopDEV`;
mongoose
  .connect(connectString.then((_) => console.log(`Connectd mongodb Success`)))
  .catch((err) => console.log(`Error Connect`));
