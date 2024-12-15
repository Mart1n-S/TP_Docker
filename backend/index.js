const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS;

// Utiliser CORS pour autoriser les requêtes depuis le front-end
app.use(
  cors({
    origin: allowedOrigins.split(","),
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Configurer la connexion à la base de données
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Vérifier la connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données:", err);
    return;
  }
  console.log("Connexion à la base de données réussie");
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Route pour recevoir les requêtes du front
app.post("/save", (req, res) => {
  const query = 'INSERT INTO users (name) VALUES ("Test User")';
  db.query(query, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion:", err);
      res.status(500).send("Erreur lors de l'insertion");
      return;
    }
    res.send("Données insérées avec succès");
  });
});

// Lancer le serveur
app.listen(port, () => {
  console.log(
    `Le serveur back-end est à l'écoute sur http://localhost:${port}`
  );
});
