// cada vez que creamos un nuevo archivo de rutas
// NECESITAMOS 2 cosas
// 1. usar express para crear el objeto de router
// 2. exportar nuestro objeto de router

const express = require('express');
const router = express.Router();

const Book = require("../models/Book.model.js")

// ... todas nuestras de rutas de libros

// GET "/book" => renderiza todos los titulos de los libros
router.get("/", (req, res, next) => {

  Book.find()
  .select({ title: 1 })
  .then((allBooks) => {
    // console.log(allBooks)
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
router.get("/:bookId/details", (req, res, next) => {

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
router.get("/create", (req, res, next) => {
  res.render("book/create-form.hbs")
})

// POST "/book/create-one-book" => recibir info de un libro y lo va a crear en la BD
router.post("/create", (req, res, next) => {

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

// GET "/book/:bookId/edit" => renderizar un formulario de edit (con los valores actuales del libro)
router.get("/:bookId/edit", (req, res, next) => {

  // buscamos los detalles del libro por su id
  Book.findById(req.params.bookId)
  .then((bookDetails) => {
    console.log(bookDetails)
    res.render("book/edit-form.hbs", {
      bookDetails: bookDetails
    })
  })
  .catch((err) => { 
    next(err)
  })
  // los pasamos a la vista

})

// POST "/book/:bookId/edit" => recibir la info a editar del libro y lo actualizará en la BD
router.post("/:bookId/edit", async (req, res, next) => {

  try {

    // console.log(req.params)
    // console.log(req.body)

    // const response = await Book.findByIdAndUpdate(req.params.bookId, {
    //   title: req.body.title,
    //   description: req.body.description,
    //   author: req.body.author
    // })

    const { title, description, author } = req.body

    const response = await Book.findByIdAndUpdate(req.params.bookId, {
      title,
      description,
      author
    }, { new: true })

    console.log(response) // el libro, ANTES de la actualización
    // podemos forzar a mongoose a darnos de vuelta la info DESPUES de la actualización
    // agregando un 3er argumento { new: true }

    res.redirect("/book")
    
  } catch (error) {
    next(error)
  }
})

// POST "/book/:bookId/delete" => borrar un libro por su id
router.post("/:bookId/delete", (req, res, next) => {

  console.log(req.params)
  Book.findByIdAndDelete(req.params.bookId)
  .then((response) => {
    res.redirect("/book")
  })
  .catch((error) => {
    next(error)
  })

})

module.exports = router