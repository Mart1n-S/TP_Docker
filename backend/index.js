const express = require("express");
const mysql = require("mysql2");
const cors = require("cors"); // Importer CORS

const app = express();
const port = 3000;

// Utiliser CORS pour autoriser les requêtes depuis le front-end
app.use(
  cors({
    origin: "http://localhost:5173", // Permettre les requêtes depuis le front-end
    methods: ["GET", "POST"], // Autoriser les méthodes GET et POST
    allowedHeaders: ["Content-Type"], // Autoriser les headers nécessaires
  })
);

// Configurer la connexion à la base de données
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "test_db",
});

// Vérifier la connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données:", err);
    return;
  }
  console.log("Connexion à la base de données réussie");
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
