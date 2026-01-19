const AccessService = require("../services/access.service");

class AccessController {
  signUp = async(req, res, next) => {
      return res.status(201).json(await AccessService.singUp(req.body));
  }
}

module.exports = new AccessController();
