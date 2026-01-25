const ShopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, ConflictRequestError, AuthFailureError } = require("../core/error.response");
const shopModel = require("../models/shop.model");
const { findByEmail } = require("./shop.service");
const RoleShop = {
  SHOP: "shop",
  ADMIN: "admin",
  EDITOR: "editor",
  VIEWER: "viewer",
  WRITE: "write",
};

class AccessService {

  /*
  login
  1. check email exit
  2. check password
  3. Create AT, RT and save
  4. Generate tokens
  5. get data return login
  */
  static login = async ({email, password, refreshToken = null}) => {
     // 1. check email exits in db
    const foundShop = await findByEmail({email})
    if (!foundShop){
      throw new BadRequestError('Shop not registered!')
    }
    // 2. check password 
    const match = await bcrypt.compare(password, foundShop.password)
    if (!match) {
      throw new AuthFailureError('Email or Password is incorrect!')
    }
    // 3. create AT, RT
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");
    const userId = foundShop._id

    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );
    
    await KeyTokenService.createKeyToken({
      userId, 
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    })

    return {
        shop: getInfoData({
            fields: ['_id', 'name', 'email'],
            object: foundShop
        }),
        tokens
    }
  }
  
  static singUp = async ({ name, email, password, role }) => {

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
        role: [RoleShop.SHOP],
      });
      console.log('newshop', newShop)

      if (newShop) {
        console.log('code dang o day')
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

  static logout = async(keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    return delKey
  }
}
module.exports = AccessService;
