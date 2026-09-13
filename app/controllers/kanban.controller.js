const db = require("../models/card");
const Card = db.cards;
const dbUser = require("../models");
const User = dbUser.user;

console.log('Card model:', Card);
console.log('User model:', User);

// Create new card
exports.create = (req, res) => {
  if (!req.body.name || req.body.name.trim() === "") {
    res.status(400).send({ message: "Le nom du kanban est obligatoire" });
    return;
  }

  const card = new Card({
    name: req.body.name,
    headerColor: req.body.headerColor || "#607d8b",
    items: [],
    owner: req.userId, // user connected is the owner 
    collaborators: []
  });

  card.save(card)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Erreur lors de la création du kanban."
      });
    });
};

// get all kanban user
exports.getUserKanbans = (req, res) => {
  const userId = req.userId;
  
  Card.find({
    $or: [
      { owner: userId },
      { collaborators: userId }
    ]
  })
  .populate('owner', 'username email')
  .populate('collaborators', 'username email')
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || "Erreur lors de la récupération des kanban."
    });
  });
};

// get all the cart of the user 
exports.getOwnedKanbans = (req, res) => {
  const userId = req.userId;
  
  Card.find({ owner: userId })
  .populate('owner', 'username email')
  .populate('collaborators', 'username email')
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || "Erreur lors de la récupération des kanban possédés."
    });
  });
};

// get the shared kanban colab
exports.getSharedKanbans = (req, res) => {
  const userId = req.userId;
  
  console.log('getSharedKanbans - userId:', userId);
  
  const mongoose = require('mongoose');
  const userObjectId = mongoose.Types.ObjectId(userId);
  
  Card.find({ 
    collaborators: userObjectId,
    owner: { $ne: userObjectId }
  })
  .populate('owner', 'username email')
  .populate('collaborators', 'username email')
  .then(data => {
    console.log('Kanban partagés trouvés:', data);
    res.send(data);
  })
  .catch(err => {
    console.error('Erreur getSharedKanbans:', err);
    res.status(500).send({
      message: err.message || "Erreur lors de la récupération des kanban partagés."
    });
  });
};

// Récupérer un kanban spécifique
exports.findOne = (req, res) => {
  const id = req.params.id;

  Card.findById(id)
    .populate('owner', 'username email')
    .populate('collaborators', 'username email')
    .then(data => {
      if (!data) {
        res.status(404).send({ message: "Kanban non trouvé avec l'id " + id });
      } else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la récupération du kanban avec id=" + id
      });
    });
};

// update kanban
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Les données à mettre à jour ne peuvent pas être vides!"
    });
  }

  const id = req.params.id;

  Card.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de mettre à jour le kanban avec id=${id}.`
        });
      } else {
        res.send({ message: "Kanban mis à jour avec succès." });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la mise à jour du kanban avec id=" + id
      });
    });
};

// delete kanban
exports.delete = (req, res) => {
  const id = req.params.id;

  Card.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de supprimer le kanban avec id=${id}.`
        });
      } else {
        res.send({
          message: "Kanban supprimé avec succès!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Impossible de supprimer le kanban avec id=" + id
      });
    });
};

// Add colab
exports.addCollaborator = (req, res) => {
  const kanbanId = req.params.id;
  const userId = req.body.userId;

  console.log('=== addCollaborator ===');
  console.log('kanbanId:', kanbanId);
  console.log('userId:', userId);
  console.log('req.body:', req.body);

  Card.findById(kanbanId)
    .then(kanban => {
      if (!kanban) {
        console.log('Kanban non trouvé');
        res.status(404).send({ message: "Kanban non trouvé" });
        return;
      }

      console.log('Kanban trouvé:', kanban);
      console.log('Collaborateurs actuels:', kanban.collaborators);

      // check if the user exist
      User.findById(userId)
        .then(user => {
          if (!user) {
            console.log('Utilisateur non trouvé');
            res.status(404).send({ message: "Utilisateur non trouvé" });
            return;
          }

          console.log('Utilisateur trouvé:', user);

          // check if the user is already added
          const isAlreadyCollaborator = kanban.collaborators.some(collabId => collabId.toString() === userId);
          console.log('Est déjà collaborateur:', isAlreadyCollaborator);
          
          if (isAlreadyCollaborator) {
            res.status(400).send({ message: "Cet utilisateur est déjà collaborateur" });
            return;
          }

          // check if the user is the owner
          if (kanban.owner.toString() === userId) {
            console.log('L\'utilisateur est le propriétaire');
            res.status(400).send({ message: "Le propriétaire ne peut pas être ajouté comme collaborateur" });
            return;
          }

          // Convert userid to objectid
          const mongoose = require('mongoose');
          const userObjectId = mongoose.Types.ObjectId(userId);
          console.log('ObjectId créé:', userObjectId);
          
          kanban.collaborators.push(userObjectId);
          console.log('Collaborateurs avant sauvegarde:', kanban.collaborators);
          
          kanban.save()
            .then(updatedKanban => {
              console.log('Collaborateur ajouté avec succès:', updatedKanban);
              console.log('Collaborateurs après sauvegarde:', updatedKanban.collaborators);
              res.send(updatedKanban);
            })
            .catch(err => {
              console.error('Erreur lors de la sauvegarde:', err);
              res.status(500).send({ message: "Erreur lors de l'ajout du collaborateur" });
            });
        })
        .catch(err => {
          console.error('Erreur lors de la recherche de l\'utilisateur:', err);
          res.status(500).send({ message: "Erreur lors de la recherche de l'utilisateur" });
        });
    })
    .catch(err => {
      console.error('Erreur lors de la recherche du kanban:', err);
      res.status(500).send({ message: "Erreur lors de la recherche du kanban" });
    });
};

// delete an colab for a kaban
exports.removeCollaborator = (req, res) => {
  const kanbanId = req.params.id;
  const userId = req.params.userId;

  console.log('=== removeCollaborator ===');
  console.log('kanbanId:', kanbanId);
  console.log('userId:', userId);

  const mongoose = require('mongoose');

  if (!userId || userId === 'undefined' || !mongoose.Types.ObjectId.isValid(userId)) {
    console.log('ID collaborateur invalide');
    res.status(400).send({ message: "ID collaborateur invalide" });
    return;
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  Card.findById(kanbanId)
    .then(kanban => {
      if (!kanban) {
        console.log('Kanban non trouvé');
        res.status(404).send({ message: "Kanban non trouvé" });
        return;
      }

      console.log('Kanban trouvé:', kanban);
      console.log('Collaborateurs actuels:', kanban.collaborators);

      const collaboratorIndex = kanban.collaborators.findIndex(collabId => collabId.toString() === userId);
      console.log('Index du collaborateur:', collaboratorIndex);
      
      if (collaboratorIndex === -1) {
        console.log('Collaborateur non trouvé dans ce kanban');
        res.status(404).send({ message: "Collaborateur non trouvé dans ce kanban" });
        return;
      }

      kanban.collaborators.splice(collaboratorIndex, 1);
      console.log('Collaborateurs après suppression:', kanban.collaborators);
      
      kanban.save()
        .then(updatedKanban => {
          console.log('Collaborateur supprimé avec succès:', updatedKanban);
          res.send(updatedKanban);
        })
        .catch(err => {
          console.error('Erreur lors de la sauvegarde:', err);
          res.status(500).send({ message: "Erreur lors de la suppression du collaborateur" });
        });
    })
    .catch(err => {
      console.error('Erreur lors de la recherche du kanban:', err);
      res.status(500).send({ message: "Erreur lors de la recherche du kanban" });
    });
};

// get colab kanban
exports.getCollaborators = (req, res) => {
  const kanbanId = req.params.id;

  Card.findById(kanbanId)
    .populate('collaborators', 'username email')
    .then(kanban => {
      if (!kanban) {
        res.status(404).send({ message: "Kanban non trouvé" });
        return;
      }

      res.send(kanban.collaborators);
    })
    .catch(err => {
      res.status(500).send({ message: "Erreur lors de la récupération des collaborateurs" });
    });
};

// search an user by name or email
exports.searchUsers = (req, res) => {
  const query = req.query.q;
  
  if (!query || query.length < 2) {
    res.status(400).send({ message: "La requête doit contenir au moins 2 caractères" });
    return;
  }

  User.find({
    $or: [
      { username: { $regex: new RegExp(query, 'i') } },
      { email: { $regex: new RegExp(query, 'i') } }
    ]
  })
  .select('username email')
  .then(users => {
    res.send(users);
  })
  .catch(err => {
    res.status(500).send({ message: "Erreur lors de la recherche d'utilisateurs" });
  });
};
