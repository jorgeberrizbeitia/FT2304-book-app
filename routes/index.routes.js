const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const bookRouter = require("./book.routes.js")
router.use("/book", bookRouter)

const authorRouter = require("./author.routes.js")
router.use("/author", authorRouter)

module.exports = router;
