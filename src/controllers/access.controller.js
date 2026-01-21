const { CREATE } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async(req, res, next) => {
    new CREATE({
      message: 'Regiserted OK!',
      metaData: await AccessService.singUp(req.body)
    }).send(res)
  }
}

module.exports = new AccessController();
