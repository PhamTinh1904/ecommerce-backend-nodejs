const _ = require("lodash");
const { Types } = require("mongoose");
const crypto = require("crypto");
const convertToObjectIdMongodb = (id) => new Types.ObjectId(id);

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

// ['a', 'b'] => {a: 1, b: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    // == kiểm tra bằng null hoặc undefined, === chỉ kiểm tra null
    if (obj[k] == null) {
      delete obj[k];
    }
  });

  return obj;
};

/* Chuyển object 
const a = {
    c: {
        d: 1,
        e: 2,
    }
}
thành dạng
db.collection.updateOne({
    "c.d": 1,
    "c.e": 2
})

- Mục đích: để khi từ front-end truyền dữ liệu dạng:
const a = {
    c: {
        d: 2,
    }
}
thì ta sẽ chỉ update giá trị c.d = 2 còn e = 2 vẫn giữ nguyên mà không bị mất

db.collection.updateOne({
    "c.d": 2,
})
- Update thành
const a = {
    c: {
        d: 2,
        e: 2,
    }
- Nếu không chuyển đổi thì dữ liệu sẽ update thành 
const a = {
    c: {
        d: 2,
    }
*/

const updateNestedObjectParser = (obj) => {
  console.log(`1::`, obj);
  const final = {};

  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  console.log(`2::`, final);

  return final;
};

const randomImageName = () => crypto.randomBytes(16).toString("hex");

const replacePlacehoder = (template, params) => {
  Object.keys(params).forEach((key) => {
    const placeHolder = `{{${key}}}`;
    template = template.replace(new RegExp(placeHolder, "g"), params[key]);
  });

  return template;
};

const randomProductId = ()=>{
  return Math.floor(Math.random()*899999+100000)
}

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
  randomImageName,
  replacePlacehoder,
  randomProductId
};
