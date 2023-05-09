const mongoose = require("mongoose")

const authorSchema = new mongoose.Schema({
  name: String,
  country: String,
  yearBorn: Number
})

const Author = mongoose.model("Author", authorSchema)

module.exports = Author