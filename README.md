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
- [x] **Stack lancée dans Docker Swarm**
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
  - [x] Front et back accessibles dans un réseau public depuis l'extérieur
  - [x] Back et BDD dans un réseau privé non exposé à l'extérieur
  - [ ] Bonus : Réseaux (overlay) chiffrés

---

### Déploiements additionnels
- [ ] **Uptime Kuma :**
  - [ ] Sonde HTTP backend
  - [ ] Sonde HTTP frontend
  - [ ] Sonde sur le conteneur BDD

- [x] **Portainer :**
  - [x] Déployé pour accéder et administrer le cluster

- [x] **Client Web BDD :**
  - [x] Déployé (PHPMyAdmin, Adminer, PgAdmin, etc.)
  - [x] Bonus : Service scale à 0 au lancement de la stack et passe à 1 lorsque nécessaire

---

### Sécurité et optimisation
- [x] **Sécurisation :**
  - [x] Infos de connexion à la BDD stockées sous forme de secrets

- [x] **Exposition des ports :**
  - [x] Seuls les ports nécessaires sont exposés

- [x] **Optimisation des Dockerfiles :**
  - [x] Respect des bonnes pratiques

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





# 📘 Guide de Déploiement

## Prérequis
1. Avoir **Docker Desktop** et **Docker Compose** installés sur votre machine.

---

## Étapes pour construire et déployer

### 1️⃣ **Construire les images Docker**

Commencez par construire les images nécessaires pour le frontend et le backend. Depuis la racine du projet, exécutez :

```bash
docker build -t frontend-vue ./frontend
docker build -t backend-node ./backend
```

### 2️⃣ **Configurer les variables d'environnement**
Si nécessaire, personnalisez les ports ou d'autres paramètres. Voici tout ce qui est paramétrable avec les variables d'environnement :
> **NOTE :** Les valeurs données ci-dessous sont les valeurs par défaut si vous ne définissez pas vous-mêmes les variables d'environnement. Compose utilisera celles-ci par défaut.

#### Windows
```powershell
# Configuration des ports des containers
$env:FRONTEND_PORT="5173"
$env:BACKEND_PORT="3000"
$env:PHPMYADMIN_PORT="80"
$env:PORTAINER_PORT="9000"

# Configuration des ports de votre machine
$env:MACHINE_FRONTEND_PORT="5173"
$env:MACHINE_BACKEND_PORT="3000"
$env:MACHINE_PHPMYADMIN_PORT="80"
$env:MACHINE_PORTAINER_PORT="9000"

# Si en prod, possibilité de changer l'hôte à un seul endroit
$env:HOST="http://localhost"
```
> **INFO :** Si vous avez initialisé des variables d'environnement, vous pouvez vérifier qu'elles ont bien été prises en compte :
```bash
$env:FRONTEND_PORT
$env:BACKEND_PORT
...
```

#### Linux / macOS
```bash
export FRONTEND_PORT=5173
export BACKEND_PORT=3000
export PHPMYADMIN_PORT=80
export PORTAINER_PORT=9000

export MACHINE_FRONTEND_PORT=5173
export MACHINE_BACKEND_PORT=3000
export MACHINE_PHPMYADMIN_PORT=80
export MACHINE_PORTAINER_PORT=9000

export HOST=http://localhost

# Pour vérifier
echo $FRONTEND_PORT
echo $BACKEND_PORT
...
```

### 3️⃣ **Initialiser Docker Swarm**
Ensuite, mettez en place Docker Swarm :
```bash
docker swarm init
```

### 4️⃣ **Créer les secrets Docker**

Si vous voulez modifier les identifiants de connexion à la base de données, modifiez ce qui se trouve dans les différents fichiers texte, puis créez les secrets :

```bash
docker secret create mysql_database secrets/mysql_database.txt

docker secret create mysql_root_password secrets/mysql_root_password.txt

docker secret create mysql_user_password secrets/mysql_user_password.txt

docker secret create mysql_user secrets/mysql_user.txt
```
> **INFO :** Pour vérifier que les secrets ont bien été pris en compte :
```bash
docker secret ls
```

### 5️⃣ **Déployer la stack Docker Swarm**

Une fois les images construites et les secrets créés, déployez la stack :

```bash
docker stack deploy -c compose.yml <nom_de_la_stack>

#Exemple :

docker stack deploy -c compose.yml projet-docker
```

### 6️⃣ **Mettre à l’échelle un service**

Par défaut, ce service a 0 réplicas. Pour activer **phpMyAdmin** en augmentant les réplicas, utilisez la commande suivante :
```bash
docker service scale <nom_de_la_stack>_phpmyadmin=1

#Exemple:

docker service scale projet-docker_phpmyadmin=1
```

---

## URL des services
Une fois le déploiement terminé, vous pouvez accéder aux différents services via les URL suivantes (en supposant que vous avez utilisé les valeurs par défaut pour les ports, sinon remplacez les ports par ceux de votre configuration) :

> **Frontend (Vue.js ou autre framework)** : [http://localhost:5173](http://localhost:5173)

> **Backend (API ou serveur Node.js, etc.)** : [http://localhost:3000](http://localhost:3000)

> **phpMyAdmin (gestion de base de données MySQL)** : [http://localhost:80](http://localhost:80)

> **Portainer (interface de gestion de Docker)** : [http://localhost:9000](http://localhost:9000)


---

## Commandes utiles

### Afficher les stacks
```bash
docker stack ls
```
### Afficher l’état des services
```bash
docker service ls
```

### Mettre à jour les variables d’environnement
Pour modifier une variable d’environnement comme le port du frontend :
```bash
$env:MACHINE_FRONTEND_PORT="5173"

docker stack deploy -c compose.yml <nom_de_la_stack>
```

### Arrêter la stack
```bash
docker stack rm <nom_de_la_stack>

#Exemple:

docker stack rm projet-docker
```

### Supprimer les secrets
```bash
docker secret rm mysql_root_password mysql_database mysql_user mysql_user_password
```

### Vérifier l'état des healthchecks d'un conteneur
```bash
docker inspect --format='{{json .State.Health}}' <container_name_or_id>
```

--- 

## 🔧 Utilisation de Portainer pour gérer votre cluster Docker

Portainer est une interface de gestion Docker très pratique qui permet de superviser et gérer vos containers, images, volumes, réseaux et stacks de manière intuitive. Une fois que vous avez déployé votre stack avec Docker Swarm, vous pouvez utiliser Portainer pour effectuer diverses actions de gestion, comme l'augmentation du nombre de réplicas de vos services.

### Accéder à Portainer
Une fois que vous avez démarré vos services Docker, vous pouvez accéder à Portainer via l'URL suivante :

- **Portainer (interface de gestion de Docker)** : [http://localhost:9000](http://localhost:9000)

### Gérer les réplicas avec Portainer

Une des fonctionnalités utiles de Portainer est la possibilité de mettre à l’échelle vos services, par exemple, augmenter le nombre de réplicas d'un service. Voici comment procéder :

1. **Se connecter à Portainer** : Accédez à Portainer à l'adresse `http://localhost:9000` et connectez-vous avec vos identifiants.
2. **Accéder à votre Stack Docker** : Dans l'interface de Portainer, choisissez votre environnement et allez dans la section **"Stacks"** pour voir la liste des stacks déployées.
3. **Sélectionner votre stack** : Cliquez sur la stack que vous souhaitez gérer.
4. **Modifier le nombre de réplicas** : Dans la section des services de votre stack, vous pouvez voir les services déployés. Pour augmenter le nombre de réplicas d'un service (par exemple, pour phpMyAdmin), il suffit de modifier le champ **"Replicas"** et d'indiquer le nombre de réplicas souhaité.
5. **Appliquer les changements** : Une fois les réplicas modifiés, cliquez sur **"Deploy the stack"** pour appliquer les changements. Docker Swarm mettra automatiquement à l’échelle votre service en fonction des nouvelles valeurs spécifiées.

