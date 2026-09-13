const { authJwt } = require("../middlewares");
const controller = require("../controllers/kanban.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/kanban/user/kanbans", [authJwt.verifyToken], controller.getUserKanbans);
  app.get("/api/kanban/user/owned", [authJwt.verifyToken], controller.getOwnedKanbans);
  app.get("/api/kanban/user/shared", [authJwt.verifyToken], controller.getSharedKanbans);
  app.get("/api/kanban/:id", [authJwt.verifyToken], controller.findOne);
  app.post("/api/kanban", [authJwt.verifyToken], controller.create);
  app.put("/api/kanban/:id", [authJwt.verifyToken], controller.update);
  app.delete("/api/kanban/:id", [authJwt.verifyToken], controller.delete);
  
  app.post("/api/kanban/:id/collaborators", [authJwt.verifyToken], controller.addCollaborator);
  app.delete("/api/kanban/:id/collaborators/:userId", [authJwt.verifyToken], controller.removeCollaborator);
  app.get("/api/kanban/:id/collaborators", [authJwt.verifyToken], controller.getCollaborators);
  
  app.get("/api/kanban/users/search", [authJwt.verifyToken], controller.searchUsers);
};
