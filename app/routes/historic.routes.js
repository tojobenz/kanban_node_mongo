module.exports = app => {
  const historics = require("../controllers/historic.controller.js");

  var router = require("express").Router();

  // Create a new tache
  router.post("/", historics.create);

  // Retrieve all historics
  router.get("/", historics.findAll);

  // Retrieve all published historics
  router.get("/published", historics.findAllPublished);

  // Retrieve a single tache with id
  router.get("/:id", historics.findOne);

  // Update a tache with id
  router.put("/:id", historics.update);


  // Delete a tache with id
  router.delete("/:id", historics.delete);

  // Create a new tache
  router.delete("/", historics.deleteAll);

  app.use("/api/historics", router);
};
