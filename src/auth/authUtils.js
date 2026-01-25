const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error("error verify", err);
      } else {
        console.log("decode verify", decode);
      }
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    return error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
   1. check userId
   2. get accessToken
   3. verify token
   4. check userId in dbs
   5. check keyToken with userID
   6. ok all -> return next()
  */
  console.log("check authentication");
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid Request!");
  }
  console.log("check userId", userId);

  const keyStore = await findByUserId(userId);
  console.log("check keyStore", keyStore);
  if (!keyStore) {
    throw new NotFoundError("Not found KeyStore!");
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request!");
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid Request!");
    }
    req.keyStore = keyStore;
    console.log("check authentication success", keyStore);
    next();
  } catch (error) {
    throw error;
  }
});

module.exports = {
  createTokenPair,
  authentication,
};
