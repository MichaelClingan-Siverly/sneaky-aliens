const express = require('express');
const router = express.Router();

/* I'm stil getting used to the arrow functions. This means the same as:
 * app.get('/', function (req, res) { ... });
 *
 */
router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

module.exports = router;
