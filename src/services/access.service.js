const ShopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, ConflictRequestError } = require("../core/error.response");
const RoleShop = {
  SHOP: "shop",
  ADMIN: "admin",
  EDITOR: "editor",
  VIEWER: "viewer",
  WRITE: "write",
};

class AccessService {
  static singUp = async ({ name, email, password, role }) => {
    // try {
      // step 1: check email exist
      const holderShop = await ShopModel.findOne({ email }).lean();

      if (holderShop) {
        throw new ConflictRequestError('Shop already registered')
      }
      // step 2: hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // step 3: create shop
      const newShop = await ShopModel.create({
        name,
        email,
        password: hashedPassword,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // create privateKey and publicKey
        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: "xxxx",
            message: "Create keyStore error",
          };
        }

        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );
        console.log(`create token success::`, tokens);
        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };

  };
}
module.exports = AccessService;
