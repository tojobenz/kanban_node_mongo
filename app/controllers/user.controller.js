const db = require("../models");
const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

// Add colab for user
exports.addCollaborator = (req, res) => {
  const userId = req.userId;
  const collaboratorEmail = req.body.email;

  console.log('addCollaborator - userId:', userId, 'collaboratorEmail:', collaboratorEmail);

  // find colab by email
  User.findOne({ email: collaboratorEmail })
    .then(collaborator => {
      if (!collaborator) {
        return res.status(404).send({ message: "Utilisateur non trouvé avec cet email" });
      }

      if (collaborator._id.toString() === userId) {
        return res.status(400).send({ message: "Vous ne pouvez pas vous ajouter vous-même comme collaborateur" });
      }

      //add colab in user
      User.findByIdAndUpdate(
        userId,
        { $addToSet: { collaborators: collaborator._id } },
        { new: true }
      )
      .populate('collaborators', 'username email')
      .then(updatedUser => {
        res.send(updatedUser.collaborators);
      })
      .catch(err => {
        res.status(500).send({ message: err.message || "Erreur lors de l'ajout du collaborateur" });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Erreur lors de la recherche de l'utilisateur" });
    });
};

// get the colab user
exports.getCollaborators = (req, res) => {
  const userId = req.userId;

  User.findById(userId)
    .populate('collaborators', 'username email')
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Utilisateur non trouvé" });
      }
      res.send(user.collaborators || []);
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Erreur lors de la récupération des collaborateurs" });
    });
};

// delete colab
exports.removeCollaborator = (req, res) => {
  const userId = req.userId;
  const collaboratorId = req.params.collaboratorId;

  if (!collaboratorId || collaboratorId === 'undefined' || !db.mongoose.Types.ObjectId.isValid(collaboratorId)) {
    return res.status(400).send({ message: "ID collaborateur invalide" });
  }

  User.findByIdAndUpdate(
    userId,
    { $pull: { collaborators: collaboratorId } },
    { new: true }
  )
  .populate('collaborators', 'username email')
  .then(updatedUser => {
    if (!updatedUser) {
      return res.status(404).send({ message: "Utilisateur non trouvé" });
    }
    res.send(updatedUser.collaborators || []);
  })
  .catch(err => {
    res.status(500).send({ message: err.message || "Erreur lors de la suppression du collaborateur" });
  });
};

// get user connected
exports.getInviters = (req, res) => {
  const userId = req.userId;

  User.find({ collaborators: userId }, 'username email')
    .then(users => {
      res.send(users || []);
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Erreur lors de la récupération des utilisateurs invitants" });
    });
};
