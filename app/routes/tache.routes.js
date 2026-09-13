module.exports = app => {
  const taches = require("../controllers/tache.controller.js");

  var router = require("express").Router();

  // Create a new tache
  router.post("/", taches.create);

  // Retrieve all taches
  router.get("/", taches.findAll);

  // Retrieve all published taches
  router.get("/published", taches.findAllPublished);

  // Retrieve a single tache with id
  router.get("/:id", taches.findOne);

  // Update a tache with id
  router.put("/:id", taches.update);

  router.put("/update-card/:card", taches.updateCard);

  // Delete a tache with id
  router.delete("/:id", taches.delete);

  // Create a new tache
  router.delete("/", taches.deleteAll);

  app.use("/api/taches", router);
};
