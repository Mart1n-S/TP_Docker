# Suivi du TP - Docker et Kubernetes

## Rendu
- [ ] **Dépôt Git contenant :**
  - [x] Le code front et son Dockerfile
  - [x] Le code back et son Dockerfile
  - [x] Un `docker-compose` à la racine
  - [ ] Un rapport au format MD/doc/pdf décrivant ce que vous avez fait, vos galères, etc.

---

## Attentes

### Fonctionnalités minimales
- [x] **Bouton dans le front envoie une requête au back :**
  - [x] Le back écrit en BDD
  - [x] Le back répond au front que tout s'est bien passé

---

### Stack et déploiement
- [ ] **Stack lancée dans Docker Swarm**
  - [ ] Bonus : Lancée via des manifestes Kubernetes

---

### Conteneurs
- [x] **Conteneur front :**
  - [x] Healthcheck implémenté
  - [x] Lancé avec un utilisateur non-root (explications incluses)
    - Pour tester : docker exec -it frontend whoami 
  > `RUN addgroup -S appgroup && adduser -S appuser -G appgroup`

  Cette ligne crée un groupe (appgroup) et un utilisateur (appuser) non privilégié dans l'image Docker. L'option -S crée un groupe/utilisateur système sans privilèges administratifs.

  >`RUN chown -R appuser:appgroup /app`

  Cette commande permet de donner à l'utilisateur **appuser** la propriété des fichiers du projet, assurant ainsi qu'il aura les permissions nécessaires pour travailler avec les fichiers dans le conteneur.

  >`USER appuser`

  Cette ligne spécifie que le conteneur doit être exécuté avec l'utilisateur non privilégié appuser. Il n'a donc pas de privilèges root, réduisant les risques en cas de faille de sécurité.


- [x] **Conteneur back :**
  - [x] Healthcheck implémenté
  - [x] Lancé avec un utilisateur non-root (explications incluses)
    - Pour tester : docker exec -it backend whoami
  >`RUN addgroup -S appgroup && adduser -S appuser -G appgroup`

  Ici aussi, un groupe et un utilisateur non privilégié sont créés pour exécuter le conteneur. Cela garantit que l'utilisateur **appuser** n'aura pas de privilèges d'administrateur.

  >`USER appuser`

  Cette ligne définit que le conteneur s'exécutera sous l'utilisateur appuser, empêchant toute élévation de privilèges qui pourrait compromettre la sécurité du système.

L'utilisation d'un utilisateur non root pour exécuter les conteneurs permet de minimiser les risques en cas de compromission du conteneur. Si un attaquant parvient à pénétrer un conteneur, l'exécution avec des privilèges élevés (root) lui permettrait de prendre le contrôle complet de l'hôte. Mais sous un utilisateur non root, l'impact d'une exploitation de vulnérabilité est limité, car l'utilisateur n'a pas accès à des privilèges système critiques.

---

### Configuration
- [x] **Back configuré par variables d'environnement :**
  - [x] Allowed origin pour le front
  - [x] Autres variables configurées

- [x] **Front :**
  - [x] API URL configurable par variables d'environnement
  - [x] Script exécuté au démarrage du conteneur pour produire un fichier `settings.json` qui sera fetché par le front

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
  - [x] Déployé (PHPMyAdmin, Adminer, PgAdmin, etc.)
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
- [x] **Docker Compose :**
  - [x] Choix du port front
  - [x] Choix du port back
  - [x] Choix du fichier `.env`

---

## Bonus
- [ ] Déploiement Kubernetes pour la stack
- [ ] Réseaux overlay chiffrés
- [x] Docker Compose totalement paramétrable
