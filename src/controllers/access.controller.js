const AccessService = require("../services/access.service");

class AccessController {
  async signUp(req, res, next) {
    try {
      console.log(`[P]::signUp::`, req.body);

      return res.status(201).json(await AccessService.singUp(req.body));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AccessController();
