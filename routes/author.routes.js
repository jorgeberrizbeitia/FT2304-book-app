const express = require('express');
const router = express.Router();

const Author = require("../models/Author.model.js")

// ... aqui nuestras rutas de autores (CRUD)

// Create!

// GET "/author/create" => renderizar un formulario para crear autores
router.get("/create", (req, res, next) => {

  res.render("author/create-form.hbs")

})

// POST "/author/create" => coje la info del formulario y crear el documento en la BD
router.post("/create", (req, res, next) => {
  // console.log(req.body)
  Author.create({
    name: req.body.name,
    country: req.body.country,
    yearBorn: req.body.yearBorn
  })
  .then(() => {
    console.log("autor creado")
    res.redirect("/author/list") 
  })
  .catch((err) => {
    next(err)
  })

})


// Read!
// GET "/author/list" => renderizar listado de todos los autores
router.get("/list", (req, res, next) => {

  Author.find()
  .then((allAuthors) => {
    res.render("author/list.hbs", {
      allAuthors: allAuthors
    })
  })
  .catch((err) => {
    next(err)
  })

})



module.exports = router