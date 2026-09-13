const db = require("../models/tache");
const Tache = db.taches;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.titre) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Tutorial
  const tache = new Tache({
    titre: req.body.titre,
    date: req.body.date,
    description: req.body.description,
    actif: req.body.actif ? req.body.actif : false,
    utilisateur: req.body.utilisateur,
    card: req.body.card,
    status: req.body.status,
  });

  // Save Tutorial in the database
  tache
    .save(tache)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the tache."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const titre = req.query.titre;
  var condition = titre ? { titre: { $regex: new RegExp(titre), $options: "i" } } : {};

  Tache.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Taches."
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tache.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Tache with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Tache with id=" + id });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Tache.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tache with id=${id}. Maybe Tache was not found!`
        });
      } else res.send({ message: "Tache was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tache with id=" + id
      });
    });
};

exports.updateCard = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const card = req.params.card;

  Tache.update({card: card}, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tache with card=${card}. Maybe Tache was not found!`
        });
      } else res.send({ message: "Tache was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tache with card=" + card
      });
    });
};

// Delete a Tache with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tache.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tache with id=${id}. Maybe Tache was not found!`
        });
      } else {
        res.send({
          message: "Tache was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tache with id=" + id
      });
    });
};

// Delete all Taches from the database.
exports.deleteAll = (req, res) => {
  Tache.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Taches were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Taches."
      });
    });
};

// Find all published Taches
exports.findAllPublished = (req, res) => {
  Tache.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Taches."
      });
    });
};
