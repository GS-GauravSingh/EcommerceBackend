const router = require("express").Router();

router.use("/admin", require("./admin"));
router.use("/", require("./user"));

module.exports = router;
