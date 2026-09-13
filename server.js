require('dotenv').config();
const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");

const app = express();

var corsOptions = {
  origin: process.env.FRONTEND_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://kanban-vue-front.vercel.app' 
      : 'http://localhost:8081')
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

// Middleware pour assurer la connexion MongoDB pour serverless
app.use(async (req, res, next) => {
  try {
    if (!global.mongooseConnection || global.mongooseConnection.readyState !== 1) {
      await db.mongoose.connect(dbConfig.URI || `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
      });
      console.log("Successfully connect to MongoDB.");
      global.mongooseConnection = db.mongoose.connection;
      
      if (!global.rolesInitialized) {
        await initial();
        global.rolesInitialized = true;
      }
    }
    next();
  } catch (err) {
    console.error("Connection error", err);
    return res.status(500).json({ message: "Database connection error", error: err.message });
  }
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "test kanban by Tojosoa" });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/tache.routes")(app);
require("./app/routes/card.routes")(app);
require("./app/routes/historic.routes")(app);
require("./app/routes/kanban.routes")(app);

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 8082;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

// Export for Vercel
module.exports = app;

async function initial() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      await new Role({ name: "user" }).save();
      console.log("User role créer");

      await new Role({ name: "admin" }).save();
      console.log("Admin role créer");
    }
  } catch (err) {
    console.log("error", err);
  }
}
