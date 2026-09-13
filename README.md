## Node.js

To run the backend:

Open a terminal in the `kanban/backend_node` folder and run:

```bash
npm install
npm start
```

---

## MongoDB Atlas

MongoDB Atlas can be used as the online database.

### Setup

1. Create an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free cluster.
3. Configure **Network Access** and allow `0.0.0.0/0`.
4. Create a database user with a username and password.
5. Go to **Database → Connect → Connect your application** and copy the connection string.

### Project configuration

Install `dotenv`:

```bash
npm install dotenv
```

Create a `.env` file inside the `backend_node` folder:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/kanban?retryWrites=true&w=majority
PORT=8082
```

Replace:

* `YOUR_USERNAME` with your MongoDB username
* `YOUR_PASSWORD` with your MongoDB password
* `YOUR_CLUSTER` with your MongoDB cluster address

Then start the server:

```bash
node server.js
```

> Do not share or commit your `.env` file. It contains your database credentials.

---

## MongoDB Local

MongoDB can also be used locally instead of MongoDB Atlas.

1. Install MongoDB.
2. Start MongoDB on `localhost:27017`.
3. Create a database named `kanban`.
4. Update your `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/kanban
```

Then start the backend:

```bash
node server.js
```
