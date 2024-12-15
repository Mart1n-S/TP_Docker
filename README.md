# Suivi du TP - Docker et Kubernetes

## Rendu
- [ ] **Dépôt Git contenant :**
  - [ ] Le code front et son Dockerfile
  - [ ] Le code back et son Dockerfile
  - [ ] Un `docker-compose` à la racine
  - [ ] Un rapport au format MD/doc/pdf décrivant ce que vous avez fait, vos galères, etc.

---

## Attentes

### Fonctionnalités minimales
- [ ] **Bouton dans le front envoie une requête au back :**
  - [ ] Le back écrit en BDD
  - [ ] Le back répond au front que tout s'est bien passé

---

### Stack et déploiement
- [ ] **Stack lancée dans Docker Swarm**
  - [ ] Bonus : Lancée via des manifestes Kubernetes

---

### Conteneurs
- [ ] **Conteneur front :**
  - [ ] Healthcheck implémenté
  - [ ] Lancé avec un utilisateur non-root (explications incluses)

- [ ] **Conteneur back :**
  - [x] Healthcheck implémenté
  - [ ] Lancé avec un utilisateur non-root (explications incluses)

---

### Configuration
- [ ] **Back configuré par variables d'environnement :**
  - [ ] Allowed origin pour le front
  - [ ] Autres variables configurées

- [ ] **Front :**
  - [ ] API URL configurable par variables d'environnement
  - [ ] Script exécuté au démarrage du conteneur pour produire un fichier `settings.json` qui sera fetché par le front

---

### Réseaux
- [ ] **Réseaux :**
  - [ ] Front et back accessibles dans un réseau public depuis l'extérieur
  - [ ] Back et BDD dans un réseau privé non exposé à l'extérieur
  - [ ] Bonus : Réseaux (overlay) chiffrés

---

### Déploiements additionnels
- [ ] **Uptime Kuma :**
  - [ ] Sonde HTTP backend
  - [ ] Sonde HTTP frontend
  - [ ] Sonde sur le conteneur BDD

- [ ] **Portainer :**
  - [ ] Déployé pour accéder et administrer le cluster

- [ ] **Client Web BDD :**
  - [ ] Déployé (PHPMyAdmin, Adminer, PgAdmin, etc.)
  - [ ] Bonus : Service scale à 0 au lancement de la stack et passe à 1 lorsque nécessaire

---

### Sécurité et optimisation
- [ ] **Sécurisation :**
  - [ ] Infos de connexion à la BDD stockées sous forme de secrets

- [ ] **Exposition des ports :**
  - [ ] Seuls les ports nécessaires sont exposés

- [ ] **Optimisation des Dockerfiles :**
  - [ ] Respect des bonnes pratiques

---

### Paramétrage
- [ ] **Docker Compose :**
  - [ ] Choix du port front
  - [ ] Choix du port back
  - [ ] Choix du fichier `.env`

---

## Bonus
- [ ] Déploiement Kubernetes pour la stack
- [ ] Réseaux overlay chiffrés
- [ ] Docker Compose totalement paramétrable
