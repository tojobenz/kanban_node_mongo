const db = require("../models/historic");
const Historic = db.historics;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.titre) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Tutorial
  const historic = new Historic({
    titre: req.body.titre,
    utilisateur: req.body.utilisateur,
    type: req.body.type,
  });

  // Save Tutorial in the database
  historic
    .save(historic)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Historic."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const titre = req.query.titre;
  var condition = titre ? { titre: { $regex: new RegExp(titre), $options: "i" } } : {};

  Historic.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Historics."
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Historic.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Historic with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Historic with id=" + id });
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

  Historic.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Historic with id=${id}. Maybe Historic was not found!`
        });
      } else res.send({ message: "Historic was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Historic with id=" + id
      });
    });
};


// Delete a Historic with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Historic.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Historic with id=${id}. Maybe Historic was not found!`
        });
      } else {
        res.send({
          message: "Historic was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Historic with id=" + id
      });
    });
};

// Delete all Historics from the database.
exports.deleteAll = (req, res) => {
  Historic.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Historics were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Historics."
      });
    });
};

// Find all published Historics
exports.findAllPublished = (req, res) => {
  Historic.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Historics."
      });
    });
};
