const express = require("express");
const { apikey, permissions } = require("../auth/checkAuth");
const router = express.Router();

//check apikey
router.use(apikey);
//check permissions
router.use(permissions("0000"));
router.use("/api/v1", require("./access"));
router.use("/api/v1/product", require("./product"));

module.exports = router;
