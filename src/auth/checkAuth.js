"use strict";

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const { findById } = require("../services/apikey.service");

const apikey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: " Forbidden error",
      });
    }
    // check objkey
    const objkey = await findById(key);

    if (!objkey) {
      return res.status(403).json({
        message: "Forbidden error",
      });
    }

    req.objkey = objkey;
    next();
  } catch (error) {
    console.error("Error in apikey middleware:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const permissions = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.objkey.permissions) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }
    const validPermissions =
      req.objkey.permissions.includes(requiredPermissions);
    if (!validPermissions) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }
    next();
  };
};


module.exports = {
  apikey,
  permissions,
};
