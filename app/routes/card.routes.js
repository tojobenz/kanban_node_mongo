const { authJwt } = require("../middlewares");

module.exports = app => {
    const cards = require("../controllers/card.controller.js");
  
    var router = require("express").Router();
  
    // Create a new tache
    router.post("/", [authJwt.verifyToken], cards.create);
  
    // Retrieve all cards
    router.get("/", [authJwt.verifyToken], cards.findAll);
  
    // Retrieve all published cards
    router.get("/published", [authJwt.verifyToken], cards.findAllPublished);
  
    // Retrieve a single tache with id
    router.get("/:id", [authJwt.verifyToken], cards.findOne);
  
    // Update a tache with id
    router.put("/:id", [authJwt.verifyToken], cards.update);
  
    // Delete a tache with id
    router.delete("/:id", [authJwt.verifyToken], cards.delete);
  
    // Create a new tache
    router.delete("/", [authJwt.verifyToken], cards.deleteAll);
  
    app.use("/api/cards", router);
  };
  