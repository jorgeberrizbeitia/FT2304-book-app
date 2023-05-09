const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({

  title: String,
  description: String,
  // author: String // esto ya no será un String, aqui queremos hacer la relación con un documento de la colección de Autores
  // author: {
  //   type: mongoose.Schema.Types.ObjectId, // define un tipo de data ID para relaciones
  //   ref: "Author" // el nombre del modelo de la colección donde buscará el id
  // }
  author: [
    {
      type: mongoose.Schema.Types.ObjectId, // define un tipo de data ID para relaciones
      ref: "Author" // el nombre del modelo de la colección donde buscará el id
    }
  ],
  coverImage: String

})

const Book = mongoose.model("Book", bookSchema)

module.exports = Book