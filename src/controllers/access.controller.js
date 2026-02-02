const { CREATE, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "LogOut success!",
      metaData: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      metaData: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CREATE({
      message: "Registered OK!",
      metaData: await AccessService.singUp(req.body),
    }).send(res);
  };

  handleRefreshToken = async(req, res, next) => {
    new SuccessResponse({
      message: 'Get token success!',
      metaData: await AccessService.handleRefreshToken(req.body.refreshToken),
    }).send(res)
  }
}

module.exports = new AccessController();
