require('dotenv').config();
const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");

const app = express();

var corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

// Connect to MongoDB only if not already connected
if (!global.mongooseConnection) {
  db.mongoose
    .connect(dbConfig.URI || `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("Successfully connect to MongoDB.");
      global.mongooseConnection = db.mongoose.connection;
      initial();
    })
    .catch(err => {
      console.error("Connection error", err);
      if (process.env.NODE_ENV !== 'production') {
        process.exit();
      }
    });
} else {
  initial();
}

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

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("User role créer");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("Admin role créer");
      });
    }
  });
}
