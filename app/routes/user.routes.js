const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.post("/api/user/collaborators", [authJwt.verifyToken], controller.addCollaborator);
  app.get("/api/user/collaborators", [authJwt.verifyToken], controller.getCollaborators);
  app.get("/api/user/inviters", [authJwt.verifyToken], controller.getInviters);
  app.delete("/api/user/collaborators/:collaboratorId", [authJwt.verifyToken], controller.removeCollaborator);
};
