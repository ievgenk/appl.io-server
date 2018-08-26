let express = require("express");
let router = express.Router();

router.get("/", (req, res) => {
  res.json({ ok: true });
});

module.exports = router;
