const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "x-rtoken-id",
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
  
  // Remove "Bearer " prefix if present
  const token = accessToken.startsWith('Bearer ') ? accessToken.slice(7) : accessToken;
  
  try {
    const decodeUser = JWT.verify(token, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid Request!");
    }
    req.keyStore = keyStore;
    req.user = decodeUser;
    console.log("check authentication success", keyStore);
    next();
  } catch (error) {
    // Handle JWT verification errors
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError' || error.name === 'NotBeforeError') {
      throw new AuthFailureError(error.message || "Invalid token!");
    }
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
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

  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      const decodeUser = await JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) {
        throw new AuthFailureError("Invalid Request!");
      }
      req.keyStore = keyStore;
      req.refreshToken = refreshToken;
      req.user = decodeUser;
      console.log("check authentication success", keyStore);
      return next();
    } catch (error) {
      // Handle JWT verification errors for refresh token
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError' || error.name === 'NotBeforeError') {
        throw new AuthFailureError(error.message || "Invalid refresh token!");
      }
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request!");
  
  // Remove "Bearer " prefix if present
  const token = accessToken.startsWith('Bearer ') ? accessToken.slice(7) : accessToken;
  
  try {
    const decodeUser = JWT.verify(token, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid Request!");
    }
    req.keyStore = keyStore;
    req.user = decodeUser;
    console.log("check authentication success", keyStore);
    next();
  } catch (error) {
    // Handle JWT verification errors
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError' || error.name === 'NotBeforeError') {
      throw new AuthFailureError(error.message || "Invalid token!");
    }
    throw error;
  }
});

module.exports = {
  createTokenPair,
  authentication,
  authenticationV2,
};
