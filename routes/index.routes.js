const express = require('express');
const router = express.Router();

const Book = require("../models/Book.model.js")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// GET "/book" => renderiza todos los titulos de los libros
router.get("/book", (req, res, next) => {

  Book.find()
  .select({ title: 1 })
  .then((allBooks) => {
    console.log(allBooks)
    // todo
    res.render("book/list.hbs", {
      allBooks // esto indica que la propieda tiene el mismo nombre que la variable de donde viene el valor
    })
  })
  .catch((err) => {
    next(err)
  })
})

// GET "/book/:bookId/details" => renderiza los detalles de un libro por su id
router.get("/book/:bookId/details", (req, res, next) => {

  // req.params para acceder al ID
  console.log( "patata", req.params.bookId )

  Book.findById(req.params.bookId)
  .then((bookDetails) => {
    res.render("book/details.hbs", {
      bookDetails: bookDetails
    })
  })
  .catch((err) => {
    next(err)
  })


})

// GET "/book/create" => renderizar un formulario de creación de libro
router.get("/book/create", (req, res, next) => {

  res.render("book/create-form.hbs")

})

// POST "/book/create-one-book" => recibir info de un libro y lo va a crear en la BD
router.post("/book/create-one-book", (req, res, next) => {

  console.log("el body de la llamada", req.body)

  Book.create({
    title: req.body.title,
    description: req.body.description,
    author: req.body.author
  })
  .then(() => {
    console.log("Libro creado")

    // redireccionar al usuario a otro lugar
    // a diferencia de render, NO le indicamos una vista
    // le indicamos un URL a donde navegar
    res.redirect("/book")
  })
  .catch((err) => {
    next(err)
  })

})

module.exports = router;
