"use strict";
const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");
const reasonPhrases = require("../utils/reasonPhrases");
class SuccessRespone {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metaData = {},
  }) {
    ((this.message = message ? message : reasonStatusCode),
      (this.status = statusCode),
      (this.metaData = metaData));
  }

  send(res, header = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessRespone {
  constructor({ message, metaData }) {
    super({ message, metaData });
  }
}

class CREATE extends SuccessRespone {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metaData = {},
  }) {
    super({ message, statusCode, reasonStatusCode, metaData });
  }
}

module.exports = {
  OK,
  CREATE,
  SuccessRespone,
};
