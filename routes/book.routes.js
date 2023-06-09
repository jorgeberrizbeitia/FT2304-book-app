// cada vez que creamos un nuevo archivo de rutas
// NECESITAMOS 2 cosas
// 1. usar express para crear el objeto de router
// 2. exportar nuestro objeto de router

const express = require('express');
const router = express.Router();

const Book = require("../models/Book.model.js")
const Author = require("../models/Author.model.js")

const uploader = require("../middlewares/uploader.js")

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
  // console.log( "patata", req.params.bookId )

  Book.findById(req.params.bookId)
  .populate("author") // Instruction: en este documento hay un id de una relación, buscar ese documento y dame toda la información
  .then((bookDetails) => {
    console.log(bookDetails)

    // populate hace todo el mismo efecto de abajo
    // .populate(elNombreDeLaPropiedaded) // NO el nombre del modelo

    // Author.findById(bookDetails.author)
    // .then((authorDetails) => {
    //   console.log(authorDetails)
    //   res.render("book/details.hbs", {
    //     bookDetails: bookDetails
    //   })
    // })

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
  // al introducir relaciones, necesitamos un listado con todos los autores para que el usuario selecciones
  Author.find()
  .then((allAuthors) => {
    res.render("book/create-form.hbs", {
      allAuthors: allAuthors
    })
  })
  .catch((err) => {
    next(err)
  })
})

// POST "/book/create" => recibir info de un libro y lo va a crear en la BD
router.post("/create",  uploader.single("coverImage") , (req, res, next) => {

  console.log("el body de la llamada", req.body)
  console.log(req.file)

  // ejemplo que algun caso en donde la imagen no se haya recibido
  if (req.file === undefined) {
    next("No hay imagen")
    return // deten la ejecución de la ruta
  }


  // antes de crear un libro, vamos a tener que cojer el archivo de image...
  // ... y lo vamos a enviar a cloudinary
  // cloudinary nos devolverá un URL

  Book.create({
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    coverImage: req.file.path // aqui es donde cloudinary nos devuelve el URL de la imagen
    // todo agregar el coverImage
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
// router.get("/:bookId/edit", (req, res, next) => {

//   let bookDetails;
//   // buscamos los detalles del libro por su id
//   Book.findById(req.params.bookId)
//   .then((response) => {
//     // console.log(bookDetails)
//     bookDetails = response;
//     return Author.find()
//   })
//   .then((allAuthors) => {
//     res.render("book/edit-form.hbs", {
//       bookDetails: bookDetails,
//       allAuthors: allAuthors
//     })
//   })
//   .catch((err) => { 
//     next(err)
//   })
//   // los pasamos a la vista
// })

router.get("/:bookId/edit", async (req, res, next) => {

  try {
    
    const bookDetails = await Book.findById(req.params.bookId)
    console.log(bookDetails)
    
    
    const allAuthors = await Author.find()

    // abajo la funcionalidad para poder ver los campos preseleccionados
    const cloneAuthors = JSON.parse( JSON.stringify(allAuthors) )
    // hay que clonar el array para poder modificar data que viene de mongo
    
    cloneAuthors.forEach((eachAuthor) => {
      // pasamos por cada elemento del array que muestra las opciones y agregamos una nueva propiedad
      // NO modificamos la BD, solo agregamos una propiedad temporal al array
      if ( bookDetails.author.includes(eachAuthor._id) ) {
        eachAuthor.isSelected = true
      } else {
        eachAuthor.isSelected = false
      }
    })
    console.log(cloneAuthors)

    res.render("book/edit-form.hbs", {
      bookDetails: bookDetails,
      allAuthors: cloneAuthors
    })

  } catch (error) {
    next(error)
  }
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