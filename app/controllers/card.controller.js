const db = require("../models/card");
const Card = db.cards;
const dbUser = require("../models");
const User = dbUser.user;
const mongoose = require("mongoose");

// Create and Save a new Card/Column
exports.create = async (req, res) => {
  console.log('Début création carte - req.body:', req.body);
  console.log('req.userId:', req.userId);
  
  if (!req.body.name || req.body.name.trim() === "") {
    res.status(400).send({ message: "Le nom de la carte est obligatoire" });
    return;
  }

  if (!req.userId) {
    res.status(401).send({ message: "Utilisateur non authentifié" });
    return;
  }

  let cardOwner = req.userId;

  // if the connected user is not don't have autorisation
  if (req.body.owner && req.body.owner !== req.userId) {
    if (mongoose.Types.ObjectId.isValid(req.body.owner)) {
      try {
        const ownerUser = await User.findById(req.body.owner);
        if (ownerUser && ownerUser.collaborators.some(id => id.toString() === req.userId)) {
          cardOwner = req.body.owner;
        } else {
          return res.status(403).send({ message: "Vous n'êtes pas autorisé à créer une carte sur ce Kanban." });
        }
      } catch (err) {
        return res.status(500).send({ message: "Erreur de vérification des droits." });
      }
    }
  }

  const card = new Card({
    name: req.body.name,
    headerColor: req.body.headerColor || "#607d8b",
    items: [],
    owner: cardOwner,
    collaborators: []
  });

  card
    .save(card)
    .then(data => {
      console.log('Carte créée avec succès:', data);
      res.send(data);
    })
    .catch(err => {
      console.error('Erreur lors de la création de la carte:', err);
      res.status(500).send({
        message: err.message || "Erreur lors de la création de la carte."
      });
    });
};

// Retrieve all Cards from the database (filtered by owner or current user)
exports.findAll = async (req, res) => {
  const userId = req.userId;
  const targetOwner = req.query.owner;
  
  if (!userId) {
    return res.send([]);
  }

  let ownerToQuery = userId;

  if (targetOwner && targetOwner !== userId) {
    if (!mongoose.Types.ObjectId.isValid(targetOwner)) {
      return res.status(400).send({ message: "ID propriétaire invalide" });
    }

    try {
      const ownerUser = await User.findById(targetOwner);
      if (ownerUser && ownerUser.collaborators.some(id => id.toString() === userId)) {
        ownerToQuery = targetOwner;
      } else {
        return res.status(403).send({ message: "Vous n'êtes pas autorisé à voir le Kanban de cet utilisateur" });
      }
    } catch (err) {
      return res.status(500).send({ message: err.message || "Erreur serveur" });
    }
  }

  const condition = { owner: ownerToQuery };

  Card.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.error('findAll - erreur:', err);
      res.status(500).send({
        message: err.message || "Erreur lors de la récupération des cartes."
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Card.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Card with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Card with id=" + id });
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

  Card.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Card with id=${id}. Maybe Card was not found!`
        });
      } else res.send({ message: "Card was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Card with id=" + id
      });
    });
};

// Delete a Card with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Card.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Card with id=${id}. Maybe Card was not found!`
        });
      } else {
        res.send({
          message: "Card was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Card with id=" + id
      });
    });
};

// Delete all cards from the database.
exports.deleteAll = (req, res) => {
  Card.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} cards were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all cards."
      });
    });
};

// Find all published cards
exports.findAllPublished = (req, res) => {
  Card.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cards."
      });
    });
};
