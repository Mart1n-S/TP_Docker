const express = require("express");
const fs = require("fs");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = process.env.BACKEND_PORT || 3000;

// Lire directement la variable d'environnement ALLOWED_ORIGINS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",") // Si plusieurs origines, les séparer
  : ["http://localhost:5173"]; // Valeur par défaut si non définie

console.log("allowedOrigins:", allowedOrigins);

// Configurer CORS pour autoriser les requêtes depuis les origines autorisées
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Lecture des identifiants de connexion à la base de données depuis les secrets Docker
const dbUser = fs.readFileSync("/run/secrets/mysql_user", "utf8").trim();
const dbPassword = fs
  .readFileSync("/run/secrets/mysql_user_password", "utf8")
  .trim();
const dbName = fs.readFileSync("/run/secrets/mysql_database", "utf8").trim();
const dbHost = process.env.DB_HOST || "localhost";

// Configuration et connexion à la base de données
let db;

const connectToDatabase = () => {
  db = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName,
  });

  db.connect((err) => {
    if (err) {
      console.error("Erreur de connexion à la base de données:", err);
      setTimeout(connectToDatabase, 5000);
    } else {
      console.log("Connexion à la base de données réussie");
      // Lancer le serveur après la connexion réussie à la base de données
      app.listen(port, () => {
        console.log(
          `Le serveur back-end est à l'écoute sur http://localhost:${port}`
        );
      });
    }
  });
};

// Tentative de connexion à la base de données
connectToDatabase();

// Route pour vérifier l'état du serveur
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
