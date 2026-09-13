module.exports = {
  // MongoDB Atlas 
  URI: process.env.MONGODB_URI || "mongodb+srv://<username>:<password>@cluster.mongodb.net/kanban?retryWrites=true&w=majority"
};