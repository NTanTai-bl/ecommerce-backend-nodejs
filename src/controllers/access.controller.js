const { CREATE, SuccessRespone } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  logout = async (req, res, next) => {
    new SuccessRespone({
      message: "LogOut success!",
      metaData: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessRespone({
      metaData: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATE({
      message: "Regiserted OK!",
      metaData: await AccessService.singUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
